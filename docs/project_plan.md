# 흡연구역 찾기 서비스 마이그레이션 및 구현 계획 (1/3)

## 1. 프로젝트 개요 및 목표
- 사용자가 주변 흡연구역을 쉽게 찾을 수 있는 웹앱 구현
- 위치 기반, 지도 기반, 상세 정보 제공, 모바일 친화적 UI/UX

## 2. 1차 마이그레이션 및 구현 대상 파일(섹션1)
- public/index.html (최상위)
- src/App.tsx, src/index.tsx, src/components/GoogleMap.tsx, src/pages/LocationList.tsx 등 핵심 파일
- package.json, tsconfig.json, .env.example
- public/assets, manifest 등 필수 리소스
- README.md, SETUP_GUIDE.md, DESIGN_GUIDE.md, PROJECT_HISTORY.md (문서)

## 3. 진행 방식
- 3~5개 섹션 단위로 파일 생성/편집(섹션별 순차 진행)
- docs/project_plan.md에 작업 내역 및 계획 지속 업데이트
- 파일 생성/수정은 text-editor만 사용

---
(섹션2: index.html 및 첫 진입점 복제 후 이어서 작성)

---
## 섹션2: index.html 및 진입점 구현

1. public_html/index.html 파일을 public 폴더에서 최상위로 복사 완료(2025-05-14)
2. index.html 내부 구조 및 주요 요소:
   - Google Maps API 연동 스크립트 포함
   - #root div, 기본 meta, manifest, favicon 등 포함
3. index.html이 정상적으로 서비스에 노출되는지 점검 필요(현재 403 Forbidden 이슈)
4. public/assets, manifest.json, favicon 등도 함께 복사되어야 함

→ 다음 섹션: src/App.tsx, src/index.tsx, 주요 컴포넌트/페이지 복사 및 구조 점검
## 섹션3: src 진입점 및 주요 컴포넌트/페이지 복사

1. src/App.tsx, src/index.tsx, src/components/GoogleMap.tsx, src/pages/LocationList.tsx 등 핵심 파일 복사
2. src/components, src/pages, src/hooks, src/utils, src/types 등 전체 구조 점검
3. GoogleMap 컴포넌트: 지도 렌더링, 마커 표시, 위치 기반 기능 구현
4. LocationList 페이지: 흡연구역 목록, 필터, 상세정보 연동
5. src/index.tsx에서 ReactDOM.render로 App 진입점 연결

→ 다음 섹션: 환경설정 파일(.env.example, package.json, tsconfig.json 등) 복사 및 점검

---
## 섹션4: 환경설정 및 의존성 파일 복사/점검

1. .env.example, package.json, tsconfig.json 등 환경설정/의존성 파일 복사
2. .env 파일은 서버 환경에 맞게 별도 작성 필요 (API 키 등 보안 정보 제외)
3. package.json 내 주요 의존성: react, react-dom, firebase, @types/react, google-maps-react 등
4. tsconfig.json: src 경로, jsx, strict 옵션 등 점검
5. README.md, SETUP_GUIDE.md 등 문서도 최신화 필요

→ 다음 섹션: 디자인 가이드 적용, 스타일 파일 복사 및 반영

---
## 섹션5: 디자인 가이드 적용 및 스타일 파일 복사

1. DESIGN_GUIDE.md 참고, 색상/폰트/버튼/입력폼 등 UI 스타일 통일
2. src/components/GoogleMap.css, src/pages/LocationList.css 등 스타일 파일 복사 및 적용
3. public/index.html에 폰트, favicon, manifest 등 링크 확인
4. 반응형(모바일/PC) 스타일 점검 및 적용

→ 다음 섹션: 실제 src 구조/코드 복제 및 세부 기능 구현, 서비스 정상화(403 등 문제 해결)

---
