import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initDb() {
  const client = new pg.Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'order_app',
  });

  try {
    await client.connect();
    const schemaPath = path.join(__dirname, '../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schema);
    console.log('Schema created successfully.');

    // 시드 데이터 확인 (없으면 추가)
    const { rows } = await client.query('SELECT COUNT(*) FROM menus');
    if (Number(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO menus (name, description, price, image, stock) VALUES
          ('아메리카노(ICE)', '시원한 아이스 아메리카노', 4000, NULL, 10),
          ('아메리카노(HOT)', '따뜻한 핫 아메리카노', 4000, NULL, 10),
          ('카페라떼', '부드러운 카페라떼', 5000, NULL, 10)
      `);
      await client.query(`
        INSERT INTO options (name, option_price, menu_id) VALUES
          ('샷 추가', 500, NULL),
          ('시럽 추가', 0, NULL)
      `);
      console.log('Seed data inserted.');
    }
  } catch (err) {
    console.error('Init failed:', err.message);
    if (err.code === '3D000') {
      console.log('\n데이터베이스가 없습니다. 먼저 생성해 주세요:');
      console.log('  createdb order_app');
      console.log('  또는 psql -U postgres -c "CREATE DATABASE order_app;"');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDb();
