import 'dotenv/config';
import pg from 'pg';

/**
 * 메뉴 이미지 경로 업데이트
 * ui/public/images/ 에 이미지를 넣은 후 실행: npm run db:update-images
 *
 * 권장 파일명:
 *   - americano-ice.jpg  → 아메리카노(ICE)
 *   - americano-hot.jpg  → 아메리카노(HOT)
 *   - cafe-latte.jpg     → 카페라떼
 */
async function updateImages() {
  const client = new pg.Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'order_app',
  });

  const imageMap = {
    '아메리카노(ICE)': '/images/americano-ice.jpg',
    '아메리카노(HOT)': '/images/americano-hot.jpg',
    '카페라떼': '/images/cafe-latte.jpg',
  };

  try {
    await client.connect();
    for (const [name, imagePath] of Object.entries(imageMap)) {
      await client.query('UPDATE menus SET image = $1 WHERE name = $2', [
        imagePath,
        name,
      ]);
      console.log(`Updated ${name} → ${imagePath}`);
    }
    console.log('Done.');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

updateImages();
