# 커피 주문 앱 - 프런트엔드 (UI)

Vite + React (바닐라 JavaScript) 개발 환경입니다.

## 설정

```bash
cd ui
npm install
```

> npm이 `only-if-cached` 모드일 경우 설치가 실패할 수 있습니다. 터미널에서 `npm config set cache null` 후 다시 `npm install` 하거나, 일반 터미널에서 실행해 보세요.

## 실행

- **개발 서버**: `npm run dev` — 로컬에서 앱 실행 (HMR)
- **빌드**: `npm run build` — `dist` 폴더에 프로덕션 빌드 생성
- **미리보기**: `npm run preview` — 빌드 결과물 로컬 서버로 미리보기

## 폴더 구조

```
ui/
├── public/          # 정적 파일
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx     # 진입점
│   └── index.css    # 전역 스타일
├── index.html
├── vite.config.js
└── package.json
```
