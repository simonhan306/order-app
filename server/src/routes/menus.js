import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

// GET /api/menus?includeStock=true
router.get('/', async (req, res) => {
  try {
    const includeStock = req.query.includeStock === 'true';
    const menuCols = includeStock
      ? 'id, name, description, price, image, stock'
      : 'id, name, description, price, image';

    const menuRows = await query(
      `SELECT ${menuCols} FROM menus ORDER BY id`
    );

    const optionsRows = await query(
      'SELECT id, name, option_price, menu_id FROM options ORDER BY id'
    );

    const menus = menuRows.rows.map((m) => ({
      ...m,
      options: optionsRows.rows
        .filter((o) => o.menu_id === null || o.menu_id === m.id)
        .map((o) => ({
          id: o.id,
          name: o.name,
          label: o.name,
          option_price: o.option_price,
          price: o.option_price,
        })),
    }));

    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/menus/:id/stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { delta } = req.body;
    if (delta !== 1 && delta !== -1) {
      return res.status(400).json({ error: 'delta must be 1 or -1' });
    }

    const { rows } = await query(
      'UPDATE menus SET stock = GREATEST(0, stock + $1) WHERE id = $2 RETURNING id, name, stock',
      [delta, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
