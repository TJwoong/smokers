# Smokers App Setup Guide

## Prerequisites
- Node.js LTS 버전
- npm (Node Package Manager)
- Firebase 계정

## 초기 설정

### 1. 프로젝트 클론 및 패키지 설치
```bash
git clone [repository-url]
cd smokers-app
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음 변수들을 설정:

```env
PORT=4000
NODE_OPTIONS=--openssl-legacy-provider
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase 설정

1. Firebase Console에서 새 프로젝트 생성
2. 웹 앱 추가
3. Authentication 설정
   - 이메일/비밀번호 로그인 활성화
4. Firestore Database 설정
   - 데이터베이스 생성
   - 보안 규칙 설정

### 4. 앱 실행
```bash
npm start
```

## 프로젝트 구조

```
smokers-app/
├── src/
│   ├── components/
│   │   ├── SmokingLocationsList.tsx
│   │   ├── SmokingLocationDetail.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── ...
│   ├── firebase.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
├── .env
└── package.json
```

## 주요 컴포넌트

### AuthPage
- 사용자 로그인/회원가입 처리
- Firebase Authentication 연동
- 에러 처리 및 사용자 피드백

### SmokingLocationsList
- 흡연구역 목록 표시
- 필터링 및 정렬 기능
- 실시간 업데이트

### SmokingLocationDetail
- 개별 흡연구역 정보 표시
- 수정/삭제 기능
- 리뷰 시스템

## Firebase 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // 흡연구역 문서
    match /locations/{locationId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.createdBy;
    }
    
    // 리뷰 문서
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 에러 처리

### 인증 관련 에러
```typescript
const handleAuthError = (error: any) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다.';
    case 'auth/weak-password':
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    default:
      return '인증 과정에서 오류가 발생했습니다.';
  }
};
``` 