import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSmokingLocations } from '../utils/smokingLocations';
import { SmokingLocation } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import GoogleMap from '../components/GoogleMap';
import './LocationList.css';

const DEFAULT_LOCATION = {
  latitude: 37.5665,  // 서울시청
  longitude: 126.9780
};

export const LocationList: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'INDOOR' | 'OUTDOOR' | 'BOOTH'>('ALL');
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [locations, setLocations] = useState<SmokingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SmokingLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSmokingLocations()
      .then((locs) => {
        setLocations(locs);
        setLoading(false);
      })
      .catch((err) => {
        setError('장소 데이터를 불러오지 못했습니다.');
        setLoading(false);
      });
    console.log('Geolocation status:', { latitude, longitude, locationError, locationLoading });
    
    // Removed loadDummyData and dummyLocations references as we now use Firestore smokingLocations



  }, [latitude, longitude, searchQuery]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleLocationClick = (location: SmokingLocation) => {
    setSelectedLocation(location);
    navigate(`/locations/${location.id}`);
    console.log('Navigating to detail page for:', location.id);
  };

  // 유형 필터 변경 핸들러
  const handleTypeChange = (type: 'ALL' | 'INDOOR' | 'OUTDOOR' | 'BOOTH') => {
    setFilterType(type);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (locationLoading) {
    return <div className="loading">위치 정보를 불러오는 중...</div>;
  }

  // 필터링 적용
  const filteredLocations = locations.filter((loc) => {
    const matchesType = filterType === 'ALL' || loc.type === filterType;
    const matchesQuery =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="location-list-container">
      {locationError && (
        <div className="location-error">
          <p>{locationError}</p>
          <p>기본 위치(서울시청)를 사용합니다.</p>
        </div>
      )}
      
      <div className="search-bar-container">
        <input 
          type="text"
          placeholder="주소 또는 장소명 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="filter-type-group" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <button className={filterType === 'ALL' ? 'active' : ''} onClick={() => handleTypeChange('ALL')}>전체</button>
          <button className={filterType === 'INDOOR' ? 'active' : ''} onClick={() => handleTypeChange('INDOOR')}>실내</button>
          <button className={filterType === 'OUTDOOR' ? 'active' : ''} onClick={() => handleTypeChange('OUTDOOR')}>실외</button>
          <button className={filterType === 'BOOTH' ? 'active' : ''} onClick={() => handleTypeChange('BOOTH')}>부스</button>
        </div>
      </div>

      <div className="view-mode-toggle">
        <button
          className={viewMode === 'map' ? 'active' : ''}
          onClick={() => setViewMode('map')}
        >
          지도 보기
        </button>
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          목록 보기
        </button>
      </div>

      <div className="map-view-container" style={{ display: viewMode === 'map' ? 'flex' : 'none' }}>
        {viewMode === 'map' && (
          <GoogleMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onMarkerClick={handleLocationClick}
            center={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          />
        )}
      </div>

      <div className="list-view-container" style={{ display: viewMode === 'list' ? 'flex' : 'none' }}>
        {viewMode === 'list' && (
          <div className="location-list">
            {loading ? (
              <div>로딩 중...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map(location => (
                <a
                  key={location.id}
                  href={`/locations/${location.id}`}
                  className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/locations/${location.id}`);
                  }}
                >
                  <button
                    className="detail-btn"
                    style={{marginBottom: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #007aff', background: '#fff', color: '#007aff', cursor: 'pointer', fontSize: '0.9rem'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      navigate(`/locations/${location.id}`);
                    }}
                  >상세보기</button>
                  <div className="location-type">{location.type}</div>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                  <div className="location-info">
                    <span className="rating">⭐ {(location.rating ?? 0).toFixed(1)}</span>
                    <span className="review-count">리뷰 {location.reviewCount}개</span>
                    <span className="distance">{(location as any).distance?.toFixed(1) ?? '계산 중...'}km</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};