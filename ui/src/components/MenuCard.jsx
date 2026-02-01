import { useState } from 'react'
import './MenuCard.css'

export default function MenuCard({ item, onAddToCart }) {
  const [optionIds, setOptionIds] = useState([])
  const options = item.options || []

  const toggleOption = (id) => {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    )
  }

  const optionTotal = options
    .filter((o) => optionIds.includes(o.id))
    .reduce((sum, o) => sum + (o.price ?? o.option_price ?? 0), 0)
  const unitPrice = (item.price ?? 0) + optionTotal

  const handleAdd = () => {
    const selectedOptions = options.filter((o) => optionIds.includes(o.id))
    onAddToCart({
      ...item,
      optionIds: [...optionIds],
      options: selectedOptions,
      unitPrice,
    })
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image" aria-hidden>
        {item.image ? (
          <img src={item.image} alt={item.name} className="menu-card__img" />
        ) : (
          <span className="menu-card__image-placeholder">이미지</span>
        )}
      </div>
      <h3 className="menu-card__name">{item.name}</h3>
      <p className="menu-card__price">{Number(item.price).toLocaleString('ko-KR')}원</p>
      <p className="menu-card__desc">{item.description || ''}</p>
      <div className="menu-card__options">
        {options.map((opt) => {
          const price = opt.price ?? opt.option_price ?? 0
          return (
            <label key={opt.id} className="menu-card__option">
              <input
                type="checkbox"
                checked={optionIds.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
              />
              <span>
                {opt.name || opt.label} ({price > 0 ? `+${price.toLocaleString('ko-KR')}원` : '+0원'})
              </span>
            </label>
          )
        })}
      </div>
      <button type="button" className="menu-card__btn" onClick={handleAdd}>
        담기
      </button>
    </article>
  )
}
