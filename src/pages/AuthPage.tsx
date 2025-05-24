import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../firebase';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();

  const checkEmailAvailability = async () => {
    setEmailStatus('checking');
    setError(null);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
        setEmailStatus('idle');
        setEmailChecked(false);
        setError('이메일을 입력해주세요.');
        return;
      }
      const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      if (methods && methods.length > 0) {
        setEmailStatus('unavailable');
        setEmailChecked(false);
      } else {
        setEmailStatus('available');
        setEmailChecked(true);
      }
    } catch {
      setEmailStatus('idle');
      setEmailChecked(false);
      setError('이메일 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLogin) {
      if (!emailChecked) {
        setError('이메일 중복확인을 해주세요.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('이미 사용 중인 이메일입니다.');
          break;
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/weak-password':
          setError('비밀번호는 최소 6자 이상이어야 합니다.');
          break;
        case 'auth/user-not-found':
          setError('등록되지 않은 이메일입니다.');
          break;
        case 'auth/wrong-password':
          setError('잘못된 비밀번호입니다.');
          break;
        default:
          setError('인증 중 오류가 발생했습니다.');
      }
    }
  };

  React.useEffect(() => {
    setEmailChecked(false);
    setEmailStatus('idle');
  }, [email, isLogin]);

  return (
    <div className="auth-container">
      <h2>{isLogin ? '로그인' : '회원가입'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            disabled={emailStatus === 'checking'}
          />
          {!isLogin && (
            <button type="button" onClick={checkEmailAvailability} disabled={!email || emailStatus === 'checking'} style={{marginLeft:'8px'}}>
              {emailStatus === 'checking' ? '확인 중...' : '중복확인'}
            </button>
          )}
          {!isLogin && emailStatus === 'available' && (
            <span style={{color:'green', marginLeft:'8px'}}>사용 가능한 이메일입니다.</span>
          )}
          {!isLogin && emailStatus === 'unavailable' && (
            <span style={{color:'red', marginLeft:'8px'}}>이미 사용 중인 이메일입니다.</span>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          {!isLogin && (
            <small className="password-requirements">
              비밀번호 요구사항:
              <ul>
                <li>최소 6자 이상</li>
                <li>영문, 숫자 조합 권장</li>
                <li>특수문자 포함 시 더욱 안전</li>
              </ul>
            </small>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      <div className="auth-toggle">
        <p>{isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}</p>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </div>
    </div>
  );
}; 