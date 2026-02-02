# Order App Server

Express.js 기반 백엔드 서버

## Render 배포 설정

### ⚠️ Root Directory 필수
**Root Directory**를 `server`로 설정하지 않으면 `Cannot find module '.../server/index.js'` 오류가 발생합니다.

| 항목 | 값 |
|------|-----|
| **Root Directory** | `server` **(필수)** |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

## 환경 변수 (Render Environment)

| Key | Value |
|-----|-------|
| `PORT` | (자동 설정) |
| `DB_HOST` | Render PostgreSQL Internal Hostname |
| `DB_PORT` | 5432 |
| `DB_USER` | DB 사용자명 |
| `DB_PASSWORD` | DB 비밀번호 |
| `DB_NAME` | DB 이름 |

또는 `DATABASE_URL` 하나로 대체 가능 (코드에서 지원 시).
