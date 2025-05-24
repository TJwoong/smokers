import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 환경 변수를 통해 설정 로드 시도
let firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 환경 변수가 로드되지 않은 경우 직접 설정
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('process.env')) {
  console.log('환경 변수에서 Firebase 설정을 로드할 수 없어 직접 설정을 사용합니다.');
  firebaseConfig = {
    apiKey: "AIzaSyDUF4vaZ9ZSVppLvlNJXpijMXOjgz_Li_4",
    authDomain: "smokers-26368.firebaseapp.com",
    projectId: "smokers-26368",
    storageBucket: "smokers-26368.appspot.com",
    messagingSenderId: "17953740631",
    appId: "1:17953740631:web:ec319c7637637d634a5012"
  };
}

console.log('Firebase 설정:', { ...firebaseConfig, apiKey: '***' }); // API 키는 보안상 마스킹

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
console.log('[config.ts] Firebase Auth 인스턴스 생성됨:', auth);

export const db = getFirestore(app);
export const storage = getStorage(app); 