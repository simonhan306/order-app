# 프로젝트 구조

커피 주문 앱(Order App)의 폴더 및 파일 구조와 역할을 설명합니다. 처음 보는 개발자도 앱 전체를 이해할 수 있도록 상세히 작성했습니다.

---

## 1. 프로젝트 소개

### 1.1 앱이 하는 일

**커피 주문 앱**은 다음 두 가지 사용자 관점이 있습니다.

| 사용자 | 기능 |
|--------|------|
| **일반 고객** | 메뉴 선택 → 옵션(샷 추가 등) 선택 → 장바구니 담기 → 주문하기 |
| **관리자** | 주문 현황 확인 → 주문 상태 변경(접수 → 제조 중 → 완료) · 메뉴별 재고 조정 |

사용자 인증·결제는 없으며, 학습용 풀스택 웹 앱입니다.

### 1.2 기술 스택

| 계층 | 기술 | 용도 |
|------|------|------|
| 프론트엔드 | React, Vite, JavaScript | SPA UI |
| 백엔드 | Node.js, Express | REST API |
| 데이터베이스 | PostgreSQL | 메뉴, 옵션, 주문 저장 |

---

## 2. 아키텍처 개요

```
[브라우저]  ←→  [React (ui/)]  ←→  [Express API (server/)]  ←→  [PostgreSQL]
   │                    │                      │
   │                    │  HTTP /api/*         │  SQL
   │                    │  (fetch)             │  (pg)
   │                    │                      │
   └─ localhost:5173    └─ localhost:3001      └─ DB
```

- **프론트엔드**: `ui/` – React SPA, Vite로 개발·빌드
- **백엔드**: `server/` – Express가 `/api/menus`, `/api/orders` 등 제공
- **DB**: 메뉴, 옵션, 주문, 주문상세 저장

개발 시 Vite가 `/api` 요청을 백엔드(3001)로 프록시합니다.

---

## 3. 데이터 흐름

### 3.1 주문 흐름

1. **주문하기 화면**: `GET /api/menus`로 메뉴·옵션 조회
2. **장바구니**: 화면 내 상태로 관리(담기, 수량 변경)
3. **주문 버튼**: `POST /api/orders`로 주문 전송 → DB 저장, 재고 차감
4. **관리자 화면**: `GET /api/orders`로 목록 조회, `PATCH`로 상태 변경

### 3.2 DB 테이블 관계

```
menus (메뉴)     ←── options (옵션, menu_id FK)
   │
   └── order_items (주문상세, menu_id FK)
              │
              └── orders (주문, order_id FK)
```

---

## 4. 전체 폴더 구조

```
order-app/
├── docs/              # 문서
├── server/            # 백엔드 (Express, PostgreSQL)
├── ui/                # 프론트엔드 (React, Vite)
├── package.json       # 루트 패키지 (ui/server 스크립트)
└── render.yaml        # Render 배포 설정
```

---

## 5. 루트

| 파일 | 역할 |
|------|------|
| `package.json` | ui/server 실행 스크립트 (`dev`, `dev:server`, `build` 등) |
| `render.yaml` | Render Blueprint (프론트엔드 Static Site) |

---

## 6. docs/ – 문서

| 파일 | 역할 |
|------|------|
| `PRD.md` | 화면, 데이터 모델, API 설계 등 제품 요구사항 |
| `FRONTEND-REVIEW.md` | 프론트엔드 리뷰 및 참고 사항 |
| `project_structure.md` | 프로젝트 구조 설명 (이 문서) |

---

## 7. server/ – 백엔드

Express.js + PostgreSQL 기반 REST API 서버.

### 7.1 폴더 구조

```
server/
├── src/
│   ├── index.js         # Express 앱, 미들웨어, 라우트 등록
│   ├── db/
│   │   ├── index.js     # PostgreSQL Pool, query(), SSL 설정
│   │   └── schema.sql   # menus, options, orders, order_items DDL
│   └── routes/
│       ├── menus.js     # 메뉴 목록, 재고 수정
│       └── orders.js    # 주문 CRUD, 상태 변경
├── scripts/
│   ├── init-db.js       # 테이블 생성 + 시드 데이터
│   └── update-menu-images.js  # 메뉴 이미지 경로 업데이트
├── index.js             # 배포용 엔트리 (node index.js)
├── package.json
├── nodemon.json         # 개발 시 자동 재시작
├── .env                 # DB 연결 정보 (git 제외)
└── README.md
```

### 7.2 주요 파일 설명

| 파일 | 역할 |
|------|------|
| `src/index.js` | Express 앱, CORS, JSON 파서, `/api/health`, 메뉴/주문 라우터 등록 |
| `src/db/index.js` | pg Pool 생성, `query()` 헬퍼, Render 등 배포 환경 SSL 설정 |
| `src/db/schema.sql` | menus, options, orders, order_items 테이블 DDL |
| `src/routes/menus.js` | GET /api/menus, PATCH /api/menus/:id/stock |
| `src/routes/orders.js` | GET/POST /api/orders, GET/PATCH /api/orders/:id |
| `scripts/init-db.js` | DB 초기화 및 시드 데이터 삽입 |
| `scripts/update-menu-images.js` | 메뉴별 이미지 경로 DB 업데이트 |
| `index.js` | Render 등에서 `node index.js`로 실행 시 `src/index.js` 로드 |

### 7.3 API 목록

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/health | 서버·DB 상태 확인 |
| GET | /api/menus | 메뉴 목록 (`?includeStock=true` 시 재고 포함) |
| PATCH | /api/menus/:id/stock | 재고 증감 (`{ delta: 1 \| -1 }`) |
| GET | /api/orders | 주문 목록 (선택: `?status=`) |
| GET | /api/orders/:id | 주문 상세 |
| POST | /api/orders | 주문 생성 (재고 차감) |
| PATCH | /api/orders/:id | 주문 상태 변경 |

---

## 8. ui/ – 프론트엔드

React + Vite 기반 SPA.

### 8.1 폴더 구조

```
ui/
├── public/
│   ├── images/          # 메뉴 이미지
│   │   ├── americano-ice.jpg
│   │   ├── americano-hot.jpg
│   │   └── cafe-latte.jpg
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── client.js    # API 클라이언트
│   ├── components/
│   │   ├── Header.jsx   # 상단 네비게이션
│   │   ├── OrderPage.jsx   # 주문 화면
│   │   ├── MenuCard.jsx    # 메뉴 카드
│   │   ├── Cart.jsx        # 장바구니
│   │   └── AdminPage.jsx   # 관리자 화면
│   ├── data/
│   │   └── menu.js      # (참고용) 로컬 메뉴 데이터
│   ├── App.jsx          # 앱 루트
│   ├── main.jsx         # React 진입점
│   └── index.css        # 전역 스타일
├── index.html
├── vite.config.js       # Vite 설정, /api 프록시
├── package.json
├── .env                 # VITE_API_BASE_URL (git 제외)
└── RENDER_DEPLOY.md     # Render 배포 가이드
```

### 8.2 화면별 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `App.jsx` | 화면(주문/관리자) 전환, 장바구니 상태 관리, Header·페이지 구성 |
| `Header.jsx` | 상단 네비게이션 (주문하기 / 관리자) |
| `OrderPage.jsx` | 메뉴 로드, 장바구니, 주문 API 호출 |
| `MenuCard.jsx` | 메뉴 표시, 옵션 선택, 담기 |
| `Cart.jsx` | 장바구니 목록, 합계, 주문 버튼 |
| `AdminPage.jsx` | 대시보드, 재고 조정, 주문 목록·상태 변경 |

### 8.3 API 연동

- `src/api/client.js`: `api.getMenus()`, `api.createOrder()` 등 fetch 래퍼
- 로컬: Vite 프록시로 `/api` → `localhost:3001`
- 배포: `VITE_API_BASE_URL` 환경 변수로 백엔드 URL 지정

---

## 9. 실행 방법

```bash
# 프론트엔드 (http://localhost:5173)
npm run dev

# 백엔드 (http://localhost:3001)
npm run dev:server

# 프론트엔드 빌드
npm run build
```

### 9.1 처음 세팅 시

1. PostgreSQL 설치 후 DB 생성
2. `server/.env`에 DB 연결 정보 설정
3. `cd server && npm run db:init`으로 테이블·시드 생성
4. `npm run dev`와 `npm run dev:server`를 각각 실행

---

## 10. 배포 (Render)

- **DB**: Render PostgreSQL
- **백엔드**: Web Service, Root Directory `server`
- **프론트엔드**: Static Site, Root Directory `ui`, Publish `dist`
- `VITE_API_BASE_URL`에 백엔드 URL 설정

자세한 내용은 `ui/RENDER_DEPLOY.md`, `server/README.md`를 참고하세요.
