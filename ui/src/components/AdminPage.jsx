import { useCallback } from 'react'
import { MENU_LIST, ADMIN_STOCK_MENU_IDS } from '../data/menu'
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

export default function AdminPage({ orders, setOrders, inventory, setInventory }) {
  const totalOrders = orders.length
  const countReceived = orders.filter((o) => o.status === '주문접수').length
  const countInProgress = orders.filter((o) => o.status === '제조중').length
  const countCompleted = orders.filter((o) => o.status === '제조완료').length

  const adjustStock = useCallback(
    (menuId, delta) => {
      setInventory((prev) => {
        const next = { ...prev }
        const cur = next[menuId] ?? 0
        next[menuId] = Math.max(0, cur + delta)
        return next
      })
    },
    [setInventory]
  )

  const updateOrderStatus = useCallback(
    (orderId, nextStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      )
    },
    [setOrders]
  )

  const stockMenus = MENU_LIST.filter((m) => ADMIN_STOCK_MENU_IDS.includes(m.id))

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
          {stockMenus.map((menu) => {
            const count = inventory[menu.id] ?? 0
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
            {orders.map((order) => (
              <li key={order.id} className="admin-orders__item">
                <div className="admin-orders__info">
                  <span className="admin-orders__date">
                    {formatOrderDate(order.createdAt)}
                  </span>
                  <span className="admin-orders__menu">
                    {order.items
                      .map((it) =>
                        it.optionLabels?.length
                          ? `${it.menuName} (${it.optionLabels.join(', ')}) x ${it.quantity}`
                          : `${it.menuName} x ${it.quantity}`
                      )
                      .join(', ')}
                  </span>
                  <span className="admin-orders__amount">
                    {order.totalAmount.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <div className="admin-orders__status">
                  {order.status === '주문접수' && (
                    <button
                      type="button"
                      className="admin-orders__action admin-orders__action--primary"
                      onClick={() => updateOrderStatus(order.id, '제조중')}
                    >
                      제조 시작
                    </button>
                  )}
                  {order.status === '제조중' && (
                    <button
                      type="button"
                      className="admin-orders__action admin-orders__action--primary"
                      onClick={() => updateOrderStatus(order.id, '제조완료')}
                    >
                      제조 완료
                    </button>
                  )}
                  {order.status === '제조완료' && (
                    <span className="admin-orders__label">제조 완료</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
