import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './components/OrderPage'
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
        <div className="app-placeholder">
          <p>관리자 화면은 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}
