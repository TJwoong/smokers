import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDUF4vaZ9ZSVppLvlNJXpijMXOjgz_Li_4",
  authDomain: "smokers-26368.firebaseapp.com",
  databaseURL: "https://smokers-26368-default-rtdb.firebaseio.com",
  projectId: "smokers-26368",
  storageBucket: "smokers-26368.appspot.com",
  messagingSenderId: "17953740631",
  appId: "1:17953740631:web:ec319c7637637d634a5012",
  measurementId: "G-MJZSK966EV"
};

// Firebase 앱이 이미 초기화되어 있는지 확인
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
