import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import MenuCard from './MenuCard'
import Cart from './Cart'
import './OrderPage.css'

function makeCartKey(menuId, optionIds) {
  return `${menuId}-${[...(optionIds || [])].sort((a, b) => a - b).join(',')}`
}

export default function OrderPage({ cart, setCart }) {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getMenus(false)
      .then(setMenus)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addToCart = useCallback(
    (payload) => {
      const optionIds = payload.optionIds || []
      const key = makeCartKey(payload.id, optionIds)
      setCart((prev) => {
        const found = prev.find((it) => it.key === key)
        if (found) {
          return prev.map((it) =>
            it.key === key
              ? { ...it, quantity: it.quantity + 1, subtotal: it.unitPrice * (it.quantity + 1) }
              : it
          )
        }
        const optionLabels = (payload.options || []).map((o) => o.name || o.label)
        const newItem = {
          key,
          menuId: payload.id,
          menuName: payload.name,
          optionIds,
          optionLabels,
          unitPrice: payload.unitPrice,
          quantity: 1,
          subtotal: payload.unitPrice,
        }
        return [...prev, newItem]
      })
    },
    [setCart]
  )

  const handleOrder = useCallback(async () => {
    if (cart.length === 0) return
    const totalAmount = cart.reduce((sum, it) => sum + it.subtotal, 0)
    const body = {
      items: cart.map((it) => ({
        menuId: it.menuId,
        quantity: it.quantity,
        optionIds: it.optionIds || [],
        amount: it.subtotal,
      })),
      totalAmount,
    }
    try {
      await api.createOrder(body)
      setCart([])
      alert('주문 접수되었습니다.')
    } catch (err) {
      alert(err.message || '주문에 실패했습니다.')
    }
  }, [cart, setCart])

  if (loading) return <main className="order-page"><p className="order-page__loading">메뉴를 불러오는 중...</p></main>
  if (error) return <main className="order-page"><p className="order-page__error">메뉴 로드 실패: {error}</p></main>

  return (
    <main className="order-page">
      <div className="order-page__menu">
        {menus.map((item) => (
          <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
        ))}
      </div>
      <Cart items={cart} onOrder={handleOrder} />
    </main>
  )
}
