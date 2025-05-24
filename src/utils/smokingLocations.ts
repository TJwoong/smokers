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
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export interface SmokingLocation {
  id?: string;
  address: string;
  createdAt: any;
  createdBy: string;
  description?: string;
  isVerified: boolean;
  latitude: number;
  longitude: number;
  name: string;
  tags: string[];
  type: import('../types').LocationType;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  operatingHours?: import('../types').OperatingHours;
  seating?: import('../types').SeatingOptions;
  weatherProtection?: import('../types').WeatherProtection;
  status?: import('../types').LocationStatus;
}

export async function getSmokingLocations(): Promise<SmokingLocation[]> {
  const snapshot = await getDocs(collection(db, 'smokingLocations'));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as SmokingLocation));
}

export async function getSmokingLocation(id: string): Promise<SmokingLocation | null> {
  const docRef = doc(db, 'smokingLocations', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  // Ensure type is LocationType
  let type = data.type;
  if (type && Array.isArray(type) && type.length > 0) {
    // 배열인 경우 첫 번째 요소만 사용
    type = type[0];
  } else if (typeof type !== 'string') {
    // 기본값 설정
    type = 'BOOTH' as import('../types').LocationType;
  }
  return { id: docSnap.id, ...data, type } as SmokingLocation;
}

export async function addSmokingLocation(data: Omit<SmokingLocation, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'smokingLocations'), data);
  return docRef.id;
}

export async function updateSmokingLocation(id: string, data: Partial<SmokingLocation>): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await updateDoc(docRef, data);
}

export async function deleteSmokingLocation(id: string): Promise<void> {
  const docRef = doc(db, 'smokingLocations', id);
  await deleteDoc(docRef);
}
