import { useCallback } from 'react'
import { MENU_LIST } from '../data/menu'
import MenuCard from './MenuCard'
import Cart from './Cart'
import './OrderPage.css'

function makeCartKey(menuId, optionIds) {
  return `${menuId}-${[...optionIds].sort().join(',')}`
}

export default function OrderPage({ cart, setCart, onSubmitOrder }) {
  const addToCart = useCallback(
    (payload) => {
      const key = makeCartKey(payload.id, payload.optionIds)
      setCart((prev) => {
        const found = prev.find((it) => it.key === key)
        if (found) {
          return prev.map((it) =>
            it.key === key
              ? { ...it, quantity: it.quantity + 1, subtotal: it.unitPrice * (it.quantity + 1) }
              : it
          )
        }
        const optionLabels = payload.options.map((o) => o.label)
        const newItem = {
          key,
          menuId: payload.id,
          menuName: payload.name,
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

  const handleOrder = useCallback(() => {
    if (cart.length === 0) return
    onSubmitOrder(cart)
    setCart([])
    alert('주문 접수되었습니다.')
  }, [cart, onSubmitOrder, setCart])

  return (
    <main className="order-page">
      <div className="order-page__menu">
        {MENU_LIST.map((item) => (
          <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
        ))}
      </div>
      <Cart items={cart} onOrder={handleOrder} />
    </main>
  )
}
