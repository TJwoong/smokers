# 흡연구역 찾기 앱 (Smoking Area Finder)

## 프로젝트 소개
이 앱은 사용자 주변의 흡연구역을 쉽게 찾을 수 있도록 도와주는 웹 애플리케이션입니다.

## 주요 기능

### 위치 기반 서비스
- 사용자의 현재 위치를 기반으로 주변 흡연구역 표시
- 거리별 정렬 및 현재 위치로부터의 거리 표시

### 지도 기능
- Google Maps API를 활용한 직관적인 지도 인터페이스
- 위치 유형별(실내, 실외, 부스) 구분 및 시각화
- 마커 클릭을 통한 위치 상세 정보 확인

### 위치 목록
- 지도 보기/목록 보기 토글 가능
- 위치 유형, 평점, 리뷰 수 등 주요 정보 제공
- 직관적인 카드 형태의 UI

### 상세 정보
- 각 흡연구역의 상세 정보 제공 (주소, 설명 등)
- 시설 정보 (좌석, 테이블, 휠체어 접근성 등)
- 날씨 보호 시설 정보 (지붕, 바람막이, 히터 등)

### 사용자 경험
- 모바일 친화적인 반응형 디자인
- 직관적인 네비게이션 및 UI/UX
- 빠른 정보 접근성

## 기술 스택
- React
- TypeScript
- Firebase (Authentication, Firestore)
- Google Maps API
- Styled Components

## 시작하기

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 7.0.0 이상

### 설치 방법
1. 저장소 클론
```bash
git clone [repository-url]
cd smokers-app
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

4. 개발 서버 실행
```bash
npm start
```

## 프로젝트 구조
```
smokers-app/
├── public/
│   └── assets/
│       └── markers/          # 지도 마커 SVG 파일들
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── pages/              # 페이지 컴포넌트
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   └── firebase.ts         # Firebase 설정
└── package.json
```

## 테스트
현재 더미 데이터를 사용하여 개발 및 테스트를 진행할 수 있습니다. 더미 데이터는 `src/utils/dummyData.ts`에 정의되어 있습니다.

## 라이선스
MIT License