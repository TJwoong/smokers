import React, { Suspense } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Home } from './pages/Home';
import Login from './pages/Login';
import { LocationList } from './pages/LocationList';
import { LocationDetail } from './pages/LocationDetail';
import AddLocation from './pages/AddLocation';
import { Header } from './components/layout/Header';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const libraries: Libraries = ['places'];

const LoadingFallback = () => (
  <div className="loading-fallback">
    <p>로딩 중...</p>
  </div>
);

// 해시 기반 라우팅으로 전환하여 새로고침 문제 해결
function App() {
  console.log('App rendered with Hash Router');
  
  return (
    <AuthProvider>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
        loadingElement={<LoadingFallback />}
      >
        <Router>
          <div className="app">
            <Header />
            <main>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/locations" element={<LocationList />} />
                  <Route path="/locations/add" element={<AddLocation />} />
                  <Route path="/locations/:id" element={<LocationDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </LoadScript>
    </AuthProvider>
  );
}

export default App; 