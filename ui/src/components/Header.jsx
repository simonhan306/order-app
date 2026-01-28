import './Header.css'

export default function Header({ currentScreen, onNavigate }) {
  return (
    <header className="header">
      <div className="header-brand">COZY</div>
      <nav className="header-nav">
        <button
          type="button"
          className={`header-nav-item ${currentScreen === 'order' ? 'header-nav-item--active' : ''}`}
          onClick={() => onNavigate('order')}
          aria-current={currentScreen === 'order' ? 'page' : undefined}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`header-nav-item ${currentScreen === 'admin' ? 'header-nav-item--active' : ''}`}
          onClick={() => onNavigate('admin')}
          aria-current={currentScreen === 'admin' ? 'page' : undefined}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}
