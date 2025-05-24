import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Review } from '../types/index';

// 특정 장소의 리뷰 가져오기
export async function getReviewsByLocation(locationId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('locationId', '==', locationId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Review));
}

// 리뷰 추가
export async function addReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: new Date()
  });
  return docRef.id;
}

// 리뷰 삭제
export async function deleteReview(id: string): Promise<void> {
  const docRef = doc(db, 'reviews', id);
  await deleteDoc(docRef);
}
