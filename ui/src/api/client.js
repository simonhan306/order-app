const API_BASE = '/api'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
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
