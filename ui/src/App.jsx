import { useState, useCallback } from 'react'
import Header from './components/Header'
import OrderPage from './components/OrderPage'
import AdminPage from './components/AdminPage'
import { ADMIN_STOCK_MENU_IDS } from './data/menu'
import './App.css'

const initialInventory = Object.fromEntries(
  ADMIN_STOCK_MENU_IDS.map((id) => [id, 10])
)

export default function App() {
  const [screen, setScreen] = useState('order')
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(initialInventory)

  const submitOrder = useCallback((cartItems) => {
    const totalAmount = cartItems.reduce((sum, it) => sum + it.subtotal, 0)
    const order = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date(),
      items: cartItems.map((it) => ({
        menuName: it.menuName,
        optionLabels: it.optionLabels,
        quantity: it.quantity,
        subtotal: it.subtotal,
      })),
      totalAmount,
      status: '주문접수',
    }
    setOrders((prev) => [order, ...prev])
  }, [])

  return (
    <div className="app">
      <Header currentScreen={screen} onNavigate={setScreen} />
      {screen === 'order' && (
        <OrderPage cart={cart} setCart={setCart} onSubmitOrder={submitOrder} />
      )}
      {screen === 'admin' && (
        <AdminPage
          orders={orders}
          setOrders={setOrders}
          inventory={inventory}
          setInventory={setInventory}
        />
      )}
    </div>
  )
}
