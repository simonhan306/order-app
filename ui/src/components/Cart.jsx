import './Cart.css'

export default function Cart({ items = [], onOrder }) {
  const total = (items ?? []).reduce((sum, it) => sum + it.subtotal, 0)

  return (
    <section className="cart">
      <h2 className="cart__title">장바구니</h2>
      {(items ?? []).length === 0 ? (
        <p className="cart__empty">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="cart__list">
            {(items ?? []).map((it) => (
              <li key={it.key} className="cart__item">
                <span className="cart__item-name">
                  {it.menuName}
                  {(it.optionLabels?.length > 0) && ` (${it.optionLabels.join(', ')})`} X {it.quantity}
                </span>
                <span className="cart__item-subtotal">
                  {it.subtotal.toLocaleString('ko-KR')}원
                </span>
              </li>
            ))}
          </ul>
          <div className="cart__footer">
            <span className="cart__total">총 금액 {total.toLocaleString('ko-KR')}원</span>
            <button type="button" className="cart__order-btn" onClick={onOrder}>
              주문하기
            </button>
          </div>
        </>
      )}
    </section>
  )
}
