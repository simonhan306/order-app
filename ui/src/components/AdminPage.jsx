import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import './AdminPage.css'

function formatOrderDate(date) {
  const d = typeof date === 'object' && date instanceof Date ? date : new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

function getStockStatus(count) {
  if (count === 0) return '품절'
  if (count < 5) return '주의'
  return '정상'
}

const STATUS_FLOW = {
  '주문 접수': { next: '제조 중', buttonLabel: '제조 시작' },
  '제조 중': { next: '완료', buttonLabel: '제조 완료' },
  완료: null,
}

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ordersData, menusData] = await Promise.all([
        api.getOrders(),
        api.getMenus(true),
      ])
      setOrders(ordersData)
      setMenus(menusData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const adjustStock = useCallback(async (menuId, delta) => {
    try {
      const updated = await api.updateStock(menuId, delta)
      setMenus((prev) =>
        prev.map((m) => (m.id === menuId ? { ...m, stock: updated.stock } : m))
      )
    } catch (err) {
      alert(err.message || '재고 조정 실패')
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId, nextStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, nextStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o))
      )
    } catch (err) {
      alert(err.message || '상태 변경 실패')
    }
  }, [])

  const totalOrders = orders.length
  const countReceived = orders.filter((o) => o.status === '주문 접수').length
  const countInProgress = orders.filter((o) => o.status === '제조 중').length
  const countCompleted = orders.filter((o) => o.status === '완료').length

  if (loading) return <main className="admin-page"><p className="admin-page__loading">불러오는 중...</p></main>
  if (error) return <main className="admin-page"><p className="admin-page__error">오류: {error}</p></main>

  return (
    <main className="admin-page">
      <section className="admin-section admin-dashboard">
        <h2 className="admin-section__title">관리자 대시보드</h2>
        <div className="admin-dashboard__stats">
          <span className="admin-dashboard__stat">총 주문 {totalOrders}</span>
          <span className="admin-dashboard__stat">주문 접수 {countReceived}</span>
          <span className="admin-dashboard__stat">제조 중 {countInProgress}</span>
          <span className="admin-dashboard__stat">제조 완료 {countCompleted}</span>
        </div>
      </section>

      <section className="admin-section admin-stock">
        <h2 className="admin-section__title">재고 현황</h2>
        <div className="admin-stock__list">
          {menus.map((menu) => {
            const count = menu.stock ?? 0
            const status = getStockStatus(count)
            return (
              <div key={menu.id} className="admin-stock__item">
                <div className="admin-stock__name">{menu.name}</div>
                <div className="admin-stock__row">
                  <span className="admin-stock__qty">{count}개</span>
                  <span className={`admin-stock__status admin-stock__status--${status === '정상' ? 'normal' : status === '주의' ? 'warn' : 'out'}`}>
                    {status}
                  </span>
                </div>
                <div className="admin-stock__actions">
                  <button
                    type="button"
                    className="admin-stock__btn"
                    onClick={() => adjustStock(menu.id, -1)}
                    disabled={count <= 0}
                    aria-label={`${menu.name} 재고 감소`}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="admin-stock__btn"
                    onClick={() => adjustStock(menu.id, 1)}
                    aria-label={`${menu.name} 재고 증가`}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="admin-section admin-orders">
        <h2 className="admin-section__title">주문 현황</h2>
        {orders.length === 0 ? (
          <p className="admin-orders__empty">접수된 주문이 없습니다.</p>
        ) : (
          <ul className="admin-orders__list">
            {orders.map((order) => {
              const flow = STATUS_FLOW[order.status]
              return (
                <li key={order.id} className="admin-orders__item">
                  <div className="admin-orders__info">
                    <span className="admin-orders__date">
                      {formatOrderDate(order.ordered_at)}
                    </span>
                    <span className="admin-orders__menu">
                      {(order.items || [])
                        .map((it) =>
                          it.optionLabels?.length
                            ? `${it.menuName} (${it.optionLabels.join(', ')}) x ${it.quantity}`
                            : `${it.menuName} x ${it.quantity}`
                        )
                        .join(', ')}
                    </span>
                    <span className="admin-orders__amount">
                      {Number(order.total_amount).toLocaleString('ko-KR')}원
                    </span>
                  </div>
                  <div className="admin-orders__status">
                    {flow ? (
                      <button
                        type="button"
                        className="admin-orders__action admin-orders__action--primary"
                        onClick={() => updateOrderStatus(order.id, flow.next)}
                      >
                        {flow.buttonLabel}
                      </button>
                    ) : (
                      <span className="admin-orders__label">제조 완료</span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
