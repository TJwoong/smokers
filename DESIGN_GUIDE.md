# Smokers App Design Guide

## 디자인 컨셉

### 1. 컬러 팔레트
- Primary: #1E88E5 (파란색 계열)
- Secondary: #43A047 (초록색 계열)
- Background: #F5F5F5 (밝은 회색)
- Text: #212121 (진한 회색)
- Error: #D32F2F (빨간색)
- Success: #388E3C (초록색)

### 2. 타이포그래피
```css
/* 기본 폰트 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;

/* 헤더 */
h1 {
  font-size: 2rem;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

/* 본문 */
p {
  font-size: 1rem;
  line-height: 1.5;
}
```

## UI 컴포넌트

### 1. 버튼 스타일
```css
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary {
  background-color: #1E88E5;
  color: white;
}

.button-secondary {
  background-color: #43A047;
  color: white;
}

.button-outline {
  border: 1px solid #1E88E5;
  color: #1E88E5;
  background: transparent;
}
```

### 2. 입력 필드
```css
.input-field {
  padding: 0.75rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #1E88E5;
  outline: none;
}
```

### 3. 카드 컴포넌트
```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  margin-bottom: 1rem;
}
```

## 레이아웃 가이드

### 1. 그리드 시스템
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

### 2. 반응형 디자인
```css
/* 모바일 */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 태블릿 */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
```

## 컴포넌트 예시

### 1. 흡연구역 카드
```tsx
const SmokingLocationCard: React.FC<SmokingLocationProps> = ({ location }) => {
  return (
    <div className="card">
      <h3>{location.name}</h3>
      <p className="address">{location.address}</p>
      <div className="type-badge">{location.type}</div>
      <div className="rating">
        평점: {location.ratings} ({location.reviewCount} 리뷰)
      </div>
    </div>
  );
};
```

### 2. 리뷰 컴포넌트
```tsx
const ReviewItem: React.FC<ReviewProps> = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <span className="user-name">{review.userName}</span>
        <span className="rating">{review.rating}점</span>
      </div>
      <p className="review-content">{review.comment}</p>
      <span className="review-date">
        {formatDate(review.createdAt)}
      </span>
    </div>
  );
};
```

## 애니메이션 가이드

### 1. 트랜지션
```css
/* 기본 트랜지션 */
.transition-base {
  transition: all 0.3s ease;
}

/* 페이드 인 애니메이션 */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 2. 인터랙션
```css
/* 호버 이펙트 */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 클릭 이펙트 */
.button:active {
  transform: scale(0.98);
}
``` 