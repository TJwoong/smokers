import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

// Location 타입 정의 (id는 Firestore 문서 ID)
export interface Location {
  id?: string;
  address: string;
  createdBy: string;
  isVerified: boolean;
  name: string;
  ratings: number;
  reviewCount: number;
  type: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  tags?: string[];
  createdAt?: any;
  updatedAt?: any;
}

// 모든 장소 가져오기
// (DEPRECATED) Use getSmokingLocations instead
export async function getLocations(): Promise<Location[]> {
  const snapshot = await getDocs(collection(db, 'smokingLocations'));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Location));
}

// Fetch all smoking locations from the correct collection
export async function getSmokingLocations(): Promise<Location[]> {
  const snapshot = await getDocs(collection(db, 'smokingLocations'));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Location));
}

// 특정 장소 가져오기
// (DEPRECATED) Use getSmokingLocation instead
export async function getLocation(id: string): Promise<Location | null> {
  const docRef = doc(db, 'smokingLocations', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Location : null;
}

// Fetch a single smoking location from the correct collection
export async function getSmokingLocation(id: string): Promise<Location | null> {
  const docRef = doc(db, 'smokingLocations', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Location : null;
}

// 장소 추가
// (DEPRECATED) Use addSmokingLocation instead
export async function addLocation(data: Omit<Location, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'smokingLocations'), data);
  return docRef.id;
}

export async function addSmokingLocation(data: Omit<Location, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'smokingLocations'), data);
  return docRef.id;
}

// 장소 수정
// (DEPRECATED) Use updateSmokingLocation instead
export async function updateLocation(id: string, data: Partial<Location>): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await updateDoc(docRef, data);
}

export async function updateSmokingLocation(id: string, data: Partial<Location>): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await updateDoc(docRef, data);
}

// 장소 삭제
// (DEPRECATED) Use deleteSmokingLocation instead
export async function deleteLocation(id: string): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await deleteDoc(docRef);
}

export async function deleteSmokingLocation(id: string): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await deleteDoc(docRef);
}

// (필요시) 필터/검색 예시
// (DEPRECATED) Use searchSmokingLocationsByType instead
export async function searchLocationsByType(type: string): Promise<Location[]> {
  const q = query(collection(db, 'smokingLocations'), where('type', '==', type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Location));
}

export async function searchSmokingLocationsByType(type: string): Promise<Location[]> {
  const q = query(collection(db, 'smokingLocations'), where('type', '==', type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Location));
}
