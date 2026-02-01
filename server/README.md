# Order App Server

Express.js 기반 백엔드 서버

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# .env 파일에서 DB 연결 정보 설정
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
```

## 데이터베이스 설정

PostgreSQL이 설치되어 있다면:

```bash
# 1. order_app 데이터베이스 생성
psql -U postgres -c "CREATE DATABASE order_app;"

# 2. 테이블 생성 및 시드 데이터 삽입
npm run db:init
```

## 실행

```bash
# 개발 모드 (nodemon - 파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

## 포트

기본 포트: **3001**  
`.env`에서 `PORT`로 변경 가능

## API

- `GET /api/health` - 서버 상태 확인 (DB 연결 포함)
