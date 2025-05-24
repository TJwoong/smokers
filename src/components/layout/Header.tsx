import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // 경로 수정 가능성 있음
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config'; // 경로 수정 가능성 있음
import { Button } from '../common/Button'; // Button 컴포넌트 경로 확인 필요
import './Header.css';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          SMOKERS {/* 로고 텍스트 변경 */}
        </Link>
        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `header__nav-link ${isActive ? 'active' : ''}`
            }
            end // 홈 링크는 정확히 일치할 때만 active
          >
            홈
          </NavLink>
          <NavLink
            to="/locations"
            className={({ isActive }) => 
              `header__nav-link ${isActive ? 'active' : ''}`
            }
          >
            흡연구역 찾기
          </NavLink>
          {/* 추가 네비게이션 링크 */} 
        </nav>
        <div className="header__auth">
          {user ? (
            <div className="header__user">
              <Link to="/profile" className="header__profile">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    className="header__avatar"
                  />
                ) : (
                  <div className="header__avatar header__avatar--placeholder">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                {/* <span>{user.displayName || user.email}</span> */} {/* 사용자 이름 표시 옵션 */}
              </Link>
              <Button
                variant="secondary" /* 로그아웃 버튼 스타일 조정 */
                size="sm"
                onClick={handleSignOut}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <Button
              variant="primary" /* 로그인 버튼 스타일 조정 */
              size="sm"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}; 