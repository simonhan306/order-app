# Render 프론트엔드 배포 가이드

## 1. 수정된 코드

### api/client.js
- **변경 내용**: `VITE_API_BASE_URL` 환경 변수 지원
- **동작**:
  - 로컬: `VITE_API_BASE_URL` 미설정 → `/api` 사용 (Vite 프록시)
  - 배포: `VITE_API_BASE_URL` 설정 → `{BASE_URL}/api` 로 API 호출

---

## 2. Render 배포 절차

### Step 1: Static Site 생성
1. [Render Dashboard](https://dashboard.render.com) → **New +** → **Static Site**
2. 저장소 연결 (GitHub/GitLab)

### Step 2: 설정

| 항목 | 값 |
|------|-----|
| **Name** | `order-app` (원하는 이름) |
| **Branch** | `main` |
| **Root Directory** | `ui` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: 환경 변수
**Environment** 섹션에서 추가:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | 백엔드 URL (예: `https://order-app-backend-od8d.onrender.com`) |

> 백엔드가 아직 배포되지 않았다면, 배포 후 URL을 확인해 환경 변수에 넣고 **Manual Deploy** → **Clear build cache & deploy** 로 다시 배포하세요.

### Step 4: 배포
- **Create Static Site** 클릭
- 빌드 완료 후 제공되는 URL에서 앱 확인

---

## 3. 주의사항

- **빌드 시점 주입**: `VITE_` 변수는 **빌드 시점**에 코드에 포함됩니다.
  - 환경 변수를 바꾼 뒤에는 **재배포**가 필요합니다.
- **백엔드 URL**: `VITE_API_BASE_URL`에는 서버 주소만 넣습니다 (`/api` 제외).
  - ✅ `https://order-app-backend-od8d.onrender.com`
  - ❌ `https://order-app-backend-od8d.onrender.com/api`
- **CORS**: 백엔드에 CORS가 설정되어 있어야 프론트엔드에서 API 호출이 됩니다.
