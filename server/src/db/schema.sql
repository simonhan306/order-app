-- Menus (메뉴)
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0
);

-- Options (옵션) - menu_id: 연결할 메뉴 (NULL이면 전체 메뉴 적용)
CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  option_price INTEGER NOT NULL DEFAULT 0,
  menu_id INTEGER REFERENCES menus(id)
);

-- Orders (주문)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT '주문 접수',
  total_amount INTEGER NOT NULL
);

-- OrderItems (주문 상세)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER NOT NULL REFERENCES menus(id),
  quantity INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  option_ids INTEGER[] DEFAULT '{}'
);
