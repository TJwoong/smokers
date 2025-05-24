import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

interface CollectionState<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
}

export const useCollection = <T extends DocumentData>(collectionPath: string) => {
  const [state, setState] = useState<CollectionState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const q = query(collection(db, collectionPath));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as unknown as T[];

        setState({
          data: documents,
          loading: false,
          error: null
        });
      },
      error => {
        console.error('Error fetching collection:', error);
        setState({
          data: null,
          loading: false,
          error: error.message
        });
      }
    );

    return () => unsubscribe();
  }, [collectionPath]);

  return state;
}; 