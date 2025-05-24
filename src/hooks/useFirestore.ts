import { useState, useReducer } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

type Action = 
  | { type: 'IS_PENDING' }
  | { type: 'ADDED_DOCUMENT', payload: DocumentReference }
  | { type: 'DELETED_DOCUMENT' }
  | { type: 'ERROR', payload: string };

interface State {
  document: DocumentReference | null;
  isPending: boolean;
  error: string | null;
  success: boolean;
}

const initialState: State = {
  document: null,
  isPending: false,
  error: null,
  success: false
};

const firestoreReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'IS_PENDING':
      return { ...state, isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return { 
        ...state, 
        isPending: false, 
        document: action.payload, 
        success: true, 
        error: null 
      };
    case 'DELETED_DOCUMENT':
      return { 
        ...state, 
        isPending: false, 
        document: null, 
        success: true, 
        error: null 
      };
    case 'ERROR':
      return { 
        ...state, 
        isPending: false, 
        document: null, 
        success: false, 
        error: action.payload 
      };
    default:
      return state;
  }
};

export const useFirestore = <T extends { id?: string }>(collectionName: string) => {
  const [state, dispatch] = useReducer(firestoreReducer, initialState);

  const add = async (document: Omit<T, 'id'>) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, collectionName), {
        ...document,
        createdAt
      });

      dispatch({ type: 'ADDED_DOCUMENT', payload: docRef });
      return docRef;
    } catch (err) {
      dispatch({ type: 'ERROR', payload: (err as Error).message });
      return null;
    }
  };

  const remove = async (id: string) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      dispatch({ type: 'DELETED_DOCUMENT' });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: (err as Error).message });
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(db, collectionName, id);
      const updatedAt = serverTimestamp();
      await updateDoc(docRef, {
        ...updates,
        updatedAt
      });
      dispatch({ type: 'ADDED_DOCUMENT', payload: docRef });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: (err as Error).message });
    }
  };

  return { 
    add, 
    remove, 
    update,
    document: state.document, 
    isPending: state.isPending, 
    error: state.error, 
    success: state.success 
  };
}; 