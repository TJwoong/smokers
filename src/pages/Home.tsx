import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="home__hero">
        <div className="container">
          <div className="home__hero-content">
            <h1 className="home__title">
              주변 흡연구역을<br />
              쉽고 빠르게 찾아보세요
            </h1>
            <p className="home__description">
              안전하고 편리한 흡연구역 찾기 서비스를 통해<br />
              주변의 흡연구역을 손쉽게 찾아보세요.
            </p>
            <div className="home__cta">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/locations')}
              >
                흡연구역 찾기
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/locations/add')}
              >
                장소 등록하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="container">
          <h2 className="home__section-title">주요 기능</h2>
          <div className="home__features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">🗺️</div>
              <h3 className="feature-card__title">지도 기반 검색</h3>
              <p className="feature-card__description">
                현재 위치를 기반으로 주변의 흡연구역을 쉽게 찾아보세요.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">⭐</div>
              <h3 className="feature-card__title">리뷰 시스템</h3>
              <p className="feature-card__description">
                다른 사용자들의 리뷰를 통해 장소의 정보를 확인하세요.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📍</div>
              <h3 className="feature-card__title">장소 등록</h3>
              <p className="feature-card__description">
                새로운 흡연구역을 발견하셨나요? 다른 사용자들과 공유해보세요.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📱</div>
              <h3 className="feature-card__title">모바일 최적화</h3>
              <p className="feature-card__description">
                언제 어디서나 모바일로 편리하게 이용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cta-section">
        <div className="container">
          <div className="home__cta-content">
            <h2 className="home__cta-title">
              지금 바로 시작하세요
            </h2>
            <p className="home__cta-description">
              회원가입 후 다양한 기능을 이용해보세요.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              시작하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}; 