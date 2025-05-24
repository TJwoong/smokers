import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">흡연구역</h3>
            <p className="footer__description">
              안전하고 편리한 흡연구역 찾기 서비스
            </p>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__subtitle">메뉴</h4>
            <ul className="footer__list">
              <li><a href="/" className="footer__link">홈</a></li>
              <li><a href="/locations" className="footer__link">흡연구역 찾기</a></li>
              <li><a href="/locations/add" className="footer__link">장소 등록</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">고객지원</h4>
            <ul className="footer__list">
              <li><a href="/terms" className="footer__link">이용약관</a></li>
              <li><a href="/privacy" className="footer__link">개인정보처리방침</a></li>
              <li><a href="/contact" className="footer__link">문의하기</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} 흡연구역. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 