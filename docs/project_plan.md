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

## 부록: 프로젝트 계획 검토 결과 및 제언 (2024-05-15)

### 1. 프로젝트 계획 검토 요약
본 프로젝트 계획은 흡연 구역 찾기 서비스의 마이그레이션 및 구현을 위한 초기 단계를 잘 정의하고 있습니다. 주요 파일 식별, 기본 구조 설정, 환경 설정 및 디자인 가이드라인 적용 등 핵심적인 초기 단계가 포함되어 있습니다.

그러나 초기 검토 결과, 다음과 같은 영역에서 추가적인 명확화 및 보완이 필요할 것으로 보입니다. 이러한 사항들은 프로젝트의 성공적인 진행과 유지보수성을 높이는 데 기여할 것입니다.

### 2. 개선 제안 사항
다음은 프로젝트 계획을 더욱 강화하기 위한 구체적인 제안 사항들입니다:

1.  **상태 관리 전략 구체화:**
    *   **현재 상황:** React 애플리케이션의 상태(state) 관리 방식(예: Context API, Redux, Zustand 등)에 대한 명시적 언급이 없습니다.
    *   **제안:** 애플리케이션의 복잡성을 고려하여 적절한 상태 관리 라이브러리 또는 패턴을 결정하고, 이를 계획에 명시해야 합니다. 예를 들어, "Context API를 활용한 주요 상태 관리" 또는 "Zustand를 도입하여 전역 상태 관리" 등으로 구체화할 수 있습니다.

2.  **흡연구역 데이터 출처 및 API 명세 구체화:**
    *   **현재 상황:** 흡연구역 데이터를 어디서, 어떻게 가져올지에 대한 구체적인 내용(예: 자체 백엔드 API, 공공 데이터 API, Firebase Firestore 등)이 누락되어 있습니다.
    *   **제안:** 데이터 출처, API 엔드포인트, 요청/응답 형식 등을 명확히 정의하고, 필요한 경우 백엔드 개발 계획과 연동해야 합니다.

3.  **오류 처리 및 로딩 상태 UI/UX 계획 보강:**
    *   **현재 상황:** 데이터 로딩 중이거나 API 오류 발생 시 사용자에게 상황을 어떻게 전달하고 안내할지에 대한 UI/UX 계획이 명시되어 있지 않습니다.
    *   **제안:** 스켈레톤 UI, 로딩 스피너, 오류 메시지 표시 방식 등 사용자 경험을 고려한 구체적인 처리 방안을 계획에 포함해야 합니다.

4.  **테스팅 전략 수립:**
    *   **현재 상황:** 단위 테스트, 통합 테스트, E2E(End-to-End) 테스트 등 코드 품질 및 안정성 확보를 위한 테스팅 전략이 언급되지 않았습니다.
    *   **제안:** 주요 기능 및 컴포넌트에 대한 테스트 케이스 작성 계획, 사용할 테스팅 라이브러리(예: Jest, React Testing Library, Cypress) 등을 명시하여 프로젝트의 신뢰도를 높여야 합니다.

5.  **빌드 및 배포 프로세스 정의:**
    *   **현재 상황:** 개발 완료 후 애플리케이션을 어떻게 빌드하고 프로덕션 환경에 배포할지에 대한 구체적인 프로세스가 없습니다.
    *   **제안:** 웹팩/Vite 등 빌드 도구 설정, CI/CD 파이프라인 구축 계획(예: GitHub Actions, Jenkins), 호스팅 환경(예: Firebase Hosting, AWS S3/CloudFront, Vercel) 등을 고려한 배포 전략을 수립해야 합니다.

6.  **`index.html` 403 Forbidden 이슈 해결 계획 통합:**
    *   **현재 상황:** `index.html` 파일 접근 시 발생하는 "403 Forbidden" 이슈가 언급되었으나, 이를 진단하고 해결하기 위한 구체적인 단계나 담당자 지정이 없습니다.
    *   **제안:** 해당 이슈의 원인 분석 및 해결 방안 모색을 위한 작업을 계획의 초기 단계에 명시적으로 포함하고, 필요시 관련 인프라팀 또는 서버 담당자와의 협의 계획을 추가해야 합니다.

7.  **Firebase 역할 명확화:**
    *   **현재 상황:** `package.json`에 Firebase 의존성이 포함되어 있으나, 이를 인증(Authentication), 데이터베이스(Firestore/Realtime Database), 호스팅(Hosting), 서버리스 함수(Cloud Functions) 등 어떤 목적으로 활용할 것인지 구체적으로 명시되어 있지 않습니다.
    *   **제안:** Firebase의 각 서비스를 어떤 기능 구현에 사용할 것인지 명확히 정의하여, 관련된 설정 및 개발 계획을 구체화해야 합니다. 예를 들어, "Firebase Authentication을 통한 사용자 인증", "Firestore를 활용한 사용자별 흡연구역 즐겨찾기 정보 저장" 등으로 명시할 수 있습니다.

8.  **문서 업데이트 방식 구체화:**
    *   **현재 상황:** "docs/project_plan.md에 작업 내역 및 계획 지속 업데이트"라는 지침이 다소 포괄적입니다.
    *   **제안:** 주간 회의 후, 주요 기능 구현 완료 시점, 또는 각 섹션 완료 시점 등 구체적인 업데이트 주기나 기준을 설정하여 계획의 현행성을 유지하는 것이 좋습니다.

9.  **"text-editor만 사용" 제약 조건 검토:**
    *   **현재 상황:** "파일 생성/수정은 text-editor만 사용"이라는 제약이 명시되어 있습니다.
    *   **제안:** 이 제약 조건이 AI 에이전트의 도구 사용을 의미하는 것인지, 아니면 실제 개발 환경에 대한 제약인지 명확히 할 필요가 있습니다. 만약 후자라면, 최신 IDE의 장점(코드 자동 완성, 디버깅, 리팩토링 등)을 활용하지 못해 개발 생산성에 영향을 줄 수 있으므로 재검토를 권장합니다. (AI 에이전트의 경우 현재 도구 사용 방식에 부합합니다.)

상기 제안 사항들을 반영하여 프로젝트 계획을 업데이트하면, 보다 체계적이고 예측 가능한 프로젝트 수행이 가능해질 것입니다.
---
