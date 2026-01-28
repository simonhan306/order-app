import { useState } from 'react'
import { MENU_OPTIONS } from '../data/menu'
import './MenuCard.css'

export default function MenuCard({ item, onAddToCart }) {
  const [optionIds, setOptionIds] = useState([])

  const toggleOption = (id) => {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    )
  }

  const optionTotal = MENU_OPTIONS.filter((o) => optionIds.includes(o.id)).reduce(
    (sum, o) => sum + o.price,
    0
  )
  const unitPrice = item.price + optionTotal

  const handleAdd = () => {
    const options = MENU_OPTIONS.filter((o) => optionIds.includes(o.id))
    onAddToCart({ ...item, optionIds, options, unitPrice })
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image" aria-hidden>
        <span className="menu-card__image-placeholder">이미지</span>
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">{item.price.toLocaleString('ko-KR')}원</p>
      <p className="menu-card__desc">{item.description}</p>
      <div className="menu-card__options">
        {MENU_OPTIONS.map((opt) => (
          <label key={opt.id} className="menu-card__option">
            <input
              type="checkbox"
              checked={optionIds.includes(opt.id)}
              onChange={() => toggleOption(opt.id)}
            />
            <span>
              {opt.label} ({opt.price > 0 ? `+${opt.price.toLocaleString('ko-KR')}원` : '+0원'})
            </span>
          </label>
        ))}
      </div>
      <button type="button" className="menu-card__btn" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}
