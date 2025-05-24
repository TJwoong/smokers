import React, { createContext, useReducer, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthState {
  user: User | null;
  authIsReady: boolean;
}

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_IS_READY'; payload: User | null };

export const AuthContext = createContext<AuthContextType | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}; 