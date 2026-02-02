# 프로젝트 구조

커피 주문 앱(Order App)의 폴더 및 파일 구조와 역할을 설명합니다.

---

## 전체 구조

```
order-app/
├── docs/              # 문서
├── server/            # 백엔드 (Express, PostgreSQL)
├── ui/                # 프론트엔드 (React, Vite)
├── package.json       # 루트 패키지 (ui/server 스크립트)
└── render.yaml        # Render 배포 설정
```

---

## 루트

| 파일 | 역할 |
|------|------|
| `package.json` | ui/server 빌드·실행 스크립트 정의 (`dev`, `dev:server`, `build` 등) |
| `render.yaml` | Render Blueprint 설정 (프론트엔드 Static Site) |

---

## docs/ – 문서

| 파일 | 역할 |
|------|------|
| `PRD.md` | 제품 요구사항 정의 (화면, 데이터 모델, API 설계) |
| `FRONTEND-REVIEW.md` | 프론트엔드 리뷰 및 참고 사항 |
| `project_structure.md` | 프로젝트 폴더/파일 구조 및 역할 설명 (이 문서) |

---

## server/ – 백엔드

Express.js + PostgreSQL 기반 API 서버.

```
server/
├── src/
│   ├── index.js         # Express 앱 진입점, 미들웨어, 라우트 등록
│   ├── db/
│   │   ├── index.js     # PostgreSQL 연결 풀 및 query 함수
│   │   └── schema.sql   # 테이블 DDL (menus, options, orders, order_items)
│   └── routes/
│       ├── menus.js     # GET /api/menus, PATCH /api/menus/:id/stock
│       └── orders.js    # GET/POST /api/orders, PATCH /api/orders/:id
├── scripts/
│   ├── init-db.js       # 테이블 생성 및 시드 데이터 (npm run db:init)
│   └── update-menu-images.js  # 메뉴 이미지 경로 업데이트
├── index.js             # 배포용 진입점 (src/index.js 로드)
├── package.json
├── nodemon.json         # 개발 시 nodemon 설정
├── .env                 # DB 연결 정보 등 (git 제외)
└── README.md
```

### 주요 파일

| 파일 | 역할 |
|------|------|
| `src/index.js` | Express 앱, CORS·JSON 파서, `/api/health`, 메뉴/주문 라우터 |
| `src/db/index.js` | pg Pool 생성, `query()`, SSL(배포 환경) 지원 |
| `src/db/schema.sql` | menus, options, orders, order_items 테이블 정의 |
| `src/routes/menus.js` | 메뉴 목록 조회, 재고 수정 API |
| `src/routes/orders.js` | 주문 생성·조회·상태 변경 API |
| `scripts/init-db.js` | DB 초기화(스키마 + 시드 데이터) |
| `scripts/update-menu-images.js` | 메뉴 이미지 경로 DB 업데이트 |
| `index.js` | Render 배포 시 `node index.js` 실행용 엔트리 |

---

## ui/ – 프론트엔드

React + Vite 기반 SPA.

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
│   │   └── client.js    # API 클라이언트 (fetch 래퍼)
│   ├── components/
│   │   ├── Header.jsx   # 상단 네비게이션 (주문하기 / 관리자)
│   │   ├── OrderPage.jsx   # 주문 화면 (메뉴, 장바구니)
│   │   ├── MenuCard.jsx    # 메뉴 카드
│   │   ├── Cart.jsx        # 장바구니
│   │   └── AdminPage.jsx   # 관리자 화면 (재고, 주문 현황)
│   ├── data/
│   │   └── menu.js      # (참고용) 로컬 메뉴 데이터
│   ├── App.jsx          # 앱 루트 컴포넌트
│   ├── App.css
│   ├── main.jsx         # React 진입점
│   └── index.css        # 전역 스타일
├── index.html
├── vite.config.js       # Vite 설정, /api 프록시
├── package.json
├── .env                 # VITE_API_BASE_URL (git 제외)
├── README.md
└── RENDER_DEPLOY.md     # Render 프론트엔드 배포 가이드
```

### 주요 파일

| 파일 | 역할 |
|------|------|
| `src/main.jsx` | React 앱 마운트 |
| `src/App.jsx` | 화면 전환(주문/관리자), 장바구니 상태, 헤더·페이지 구성 |
| `src/api/client.js` | `api.getMenus()`, `api.createOrder()` 등 API 호출 |
| `src/components/OrderPage.jsx` | 메뉴 로드, 장바구니, 주문 요청 |
| `src/components/MenuCard.jsx` | 메뉴 표시, 옵션 선택, 담기 |
| `src/components/Cart.jsx` | 장바구니 목록, 합계, 주문 버튼 |
| `src/components/AdminPage.jsx` | 대시보드, 재고 관리, 주문 목록·상태 변경 |
| `src/components/Header.jsx` | 탭 네비게이션 |
| `vite.config.js` | `/api` → `localhost:3001` 프록시 설정 |
| `public/images/` | 메뉴 이미지 (정적 자산) |

---

## 실행 방법

```bash
# 프론트엔드 개발 서버 (http://localhost:5173)
npm run dev

# 백엔드 개발 서버 (http://localhost:3001)
npm run dev:server

# 프론트엔드 빌드
npm run build
```
