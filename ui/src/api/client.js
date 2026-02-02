// 개발: Vite 프록시로 /api 사용. 배포: VITE_API_BASE_URL + /api
const BASE = import.meta.env.VITE_API_BASE_URL
const API_BASE = BASE ? `${BASE.replace(/\/$/, '')}/api` : '/api'

async function request(path, options = {}) {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}${path.startsWith('/') ? path : '/' + path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || res.statusText)
  return data
}

export const api = {
  getMenus(includeStock = false) {
    return request(`/menus${includeStock ? '?includeStock=true' : ''}`)
  },
  getOrders(status) {
    return request(status ? `/orders?status=${encodeURIComponent(status)}` : '/orders')
  },
  getOrder(id) {
    return request(`/orders/${id}`)
  },
  createOrder(body) {
    return request('/orders', { method: 'POST', body: JSON.stringify(body) })
  },
  updateOrderStatus(id, status) {
    return request(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  updateStock(menuId, delta) {
    return request(`/menus/${menuId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    })
  },
}
