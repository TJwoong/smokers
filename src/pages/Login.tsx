import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail, onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // 이메일이 변경되면 검증 상태 초기화
  useEffect(() => {
    setIsEmailVerified(false);
    setEmailStatus('');
  }, [email]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkEmailAvailability = async () => {
    if (!validateEmail(email)) {
      setEmailStatus('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsCheckingEmail(true);
    setEmailStatus('');
    setError('');
    setIsEmailVerified(false);

    const trimmedEmail = email.trim().toLowerCase();

    try {
      console.log(`[checkEmailAvailability] 시작: ${trimmedEmail}, projectId:`, process.env.REACT_APP_FIREBASE_PROJECT_ID || (auth.app && auth.app.options && auth.app.options.projectId));
      const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      console.log(`[checkEmailAvailability] fetchSignInMethodsForEmail 결과 (${trimmedEmail}):`, methods, 'projectId:', process.env.REACT_APP_FIREBASE_PROJECT_ID || (auth.app && auth.app.options && auth.app.options.projectId));
      if (methods && methods.length > 0) {
        console.log('[checkEmailAvailability] Firebase: 이미 등록된 이메일', trimmedEmail);
        setEmailStatus('❌ 이미 가입된 이메일입니다');
        setIsEmailVerified(false);
      } else {
        console.log('[checkEmailAvailability] Firebase: 사용 가능한 이메일', trimmedEmail);
        setEmailStatus('✓ 사용 가능한 이메일입니다');
        setIsEmailVerified(true);
      }
    } catch (error: any) {
      console.error('[checkEmailAvailability] Email check error:', error, '입력값:', trimmedEmail, 'projectId:', process.env.REACT_APP_FIREBASE_PROJECT_ID || (auth.app && auth.app.options && auth.app.options.projectId));
      if (error.code === 'auth/invalid-email') {
        setEmailStatus('유효하지 않은 이메일 형식입니다');
      } else {
        setEmailStatus('이메일 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.error('[checkEmailAvailability] 상세 오류:', error, '입력값:', trimmedEmail, 'projectId:', process.env.REACT_APP_FIREBASE_PROJECT_ID || (auth.app && auth.app.options && auth.app.options.projectId));
      }
      setIsEmailVerified(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('비밀번호는 8자 이상이어야 합니다');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('대문자를 포함해야 합니다');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('소문자를 포함해야 합니다');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('숫자를 포함해야 합니다');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('특수문자를 포함해야 합니다');
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      setLoading(false);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (resetPasswordMode) {
      try {
        await sendPasswordResetEmail(auth, trimmedEmail);
        alert('비밀번호 재설정 이메일이 발송되었습니다.');
        setResetPasswordMode(false);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          setError('등록되지 않은 이메일입니다.');
        } else {
          setError('비밀번호 재설정 이메일 발송에 실패했습니다.');
        }
      }
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // 회원가입 시도 전 중복확인 자동 실행 (isEmailVerified가 false면 강제 실행)
        if (!isEmailVerified) {
          await checkEmailAvailability();
          if (!isEmailVerified) {
            setError('이메일 중복 확인이 필요합니다.');
            setLoading(false);
            return;
          }
        }
        if (!validatePassword(password)) {
          setLoading(false);
          return;
        }
        // 최종적으로 회원가입 시도
        await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      } else {
        // 로그인 시도
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('이미 가입된 이메일입니다. 로그인을 진행해주세요.');
          setIsSignUp(false);
          break;
        case 'auth/user-not-found':
          setError('등록되지 않은 이메일입니다.');
          break;
        case 'auth/wrong-password':
          setError('비밀번호가 올바르지 않습니다.');
          break;
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/too-many-requests':
          setError('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          setError('로그인/회원가입 중 오류가 발생했습니다.');
      }
    }
    setLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isSignUp) {
      validatePassword(newPassword);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailVerified(false);
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      setError('Google 로그인에 실패했습니다.');
    }
  };

  if (resetPasswordMode) {
    return (
      <div className="login-container">
        <h2>비밀번호 재설정</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? '처리중...' : '재설정 이메일 발송'}
          </button>
          <button type="button" onClick={() => setResetPasswordMode(false)} className="secondary-button">
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>{isSignUp ? '회원가입' : '로그인'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group email-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일"
            required
            autoComplete="email"
          />
          {isSignUp && (
            <button
              type="button"
              onClick={checkEmailAvailability}
              className="email-check-btn"
              disabled={!email || isCheckingEmail}
            >
              {isCheckingEmail ? '확인중' : '중복확인'}
            </button>
          )}
        </div>
        {isSignUp && emailStatus && (
          <div className={emailStatus.includes('사용 가능') ? 'success-message' : 'error-message'} style={{marginTop: '-10px', marginBottom: '15px'}}>
            {emailStatus}
          </div>
        )}
        <div className="form-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {isSignUp && passwordErrors.length > 0 && (
          <div className="password-requirements">
            {passwordErrors.map((error, index) => (
              <div key={index} className="requirement-item">
                ⚠️ {error}
              </div>
            ))}
          </div>
        )}
        {isSignUp && (
          <div className="form-group">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="이름 또는 닉네임 (선택사항)"
              autoComplete="name"
            />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            로그인 상태 유지
          </label>
          {!isSignUp && (
            <button
              type="button"
              onClick={() => setResetPasswordMode(true)}
              className="forgot-password"
            >
              비밀번호 찾기
            </button>
          )}
        </div>
        <button 
          type="submit" 
          disabled={loading || (isSignUp && !isEmailVerified)}
        >
          {loading ? '처리중...' : (isSignUp ? '회원가입' : '로그인')}
        </button>
        <button type="button" onClick={handleGoogleLogin} className="google-login">
          Google로 {isSignUp ? '회원가입' : '로그인'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setPasswordErrors([]);
            setError('');
            setIsEmailVerified(false);
            setEmailStatus('');
          }}
          className="toggle-btn"
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </form>
    </div>
  );
};

export default Login; 