import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './components/OrderPage'
import AdminPage from './components/AdminPage'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('order')
  const [cart, setCart] = useState([])

  return (
    <div className="app">
      <Header currentScreen={screen} onNavigate={setScreen} />
      {screen === 'order' && (
        <OrderPage cart={cart} setCart={setCart} />
      )}
      {screen === 'admin' && (
        <AdminPage />
      )}
    </div>
  )
}
