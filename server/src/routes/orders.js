import { Router } from 'express';
import { query, getPool } from '../db/index.js';

const router = Router();

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const params = [];
    let sql = `
      SELECT o.id, o.ordered_at, o.status, o.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'menuId', oi.menu_id,
              'menuName', m.name,
              'quantity', oi.quantity,
              'amount', oi.amount,
              'optionIds', COALESCE(oi.option_ids, '{}'),
              'optionLabels', (SELECT COALESCE(array_agg(name), '{}') FROM options WHERE id = ANY(COALESCE(oi.option_ids, '{}')))
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        )::json AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menus m ON m.id = oi.menu_id
    `;
    if (status) {
      params.push(status);
      sql += ` WHERE o.status = $${params.length}`;
    }
    sql += ` GROUP BY o.id ORDER BY o.ordered_at DESC`;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await query(
      `SELECT o.id, o.ordered_at, o.status, o.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'menuId', oi.menu_id,
              'menuName', m.name,
              'quantity', oi.quantity,
              'amount', oi.amount,
              'optionIds', COALESCE(oi.option_ids, '{}'),
              'optionLabels', (SELECT COALESCE(array_agg(name), '{}') FROM options WHERE id = ANY(COALESCE(oi.option_ids, '{}')))
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        )::json AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menus m ON m.id = oi.menu_id
      WHERE o.id = $1
      GROUP BY o.id`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  const client = await (await getPool()).connect();
  try {
    const { items, totalAmount } = req.body;
    if (!Array.isArray(items) || items.length === 0 || typeof totalAmount !== 'number') {
      return res.status(400).json({ error: 'Invalid request: items array and totalAmount required' });
    }

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (total_amount) VALUES ($1) RETURNING id, ordered_at, status, total_amount`,
      [totalAmount]
    );
    const order = orderResult.rows[0];

    for (const it of items) {
      const { menuId, quantity, optionIds = [], amount } = it;
      if (!menuId || !quantity || typeof amount !== 'number') {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Each item needs menuId, quantity, amount' });
      }

      await client.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, amount, option_ids)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, menuId, quantity, amount, optionIds]
      );

      await client.query(
        'UPDATE menus SET stock = GREATEST(0, stock - $1) WHERE id = $2',
        [quantity, menuId]
      );
    }

    await client.query('COMMIT');

    const { rows } = await client.query(
      `SELECT o.id, o.ordered_at, o.status, o.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'menuId', oi.menu_id,
              'menuName', m.name,
              'quantity', oi.quantity,
              'amount', oi.amount,
              'optionIds', COALESCE(oi.option_ids, '{}'),
              'optionLabels', (SELECT COALESCE(array_agg(name), '{}') FROM options WHERE id = ANY(COALESCE(oi.option_ids, '{}')))
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        )::json AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menus m ON m.id = oi.menu_id
      WHERE o.id = $1
      GROUP BY o.id`,
      [order.id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:id
router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const validStatuses = ['주문 접수', '제조 중', '완료'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'status must be one of: 주문 접수, 제조 중, 완료' });
    }

    const { rows } = await query(
      `UPDATE orders SET status = $1 WHERE id = $2
       RETURNING id, ordered_at, status, total_amount`,
      [status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = rows[0];
    const itemsResult = await query(
      `SELECT oi.menu_id AS "menuId", m.name AS "menuName", oi.quantity, oi.amount,
         oi.option_ids AS "optionIds",
         (SELECT COALESCE(array_agg(name), '{}') FROM options WHERE id = ANY(COALESCE(oi.option_ids, '{}'))) AS "optionLabels"
       FROM order_items oi JOIN menus m ON m.id = oi.menu_id WHERE oi.order_id = $1`,
      [id]
    );
    res.json({ ...order, items: itemsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
