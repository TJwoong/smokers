import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { 
  SmokingLocation,
  LocationInput, 
  LocationType, 
  LocationStatus, 
  OperatingHours, 
  SeatingOptions, 
  WeatherProtection 
} from '../types';
import { storage } from '../firebase';
import './AddLocation.css';
import GoogleMap from '../components/GoogleMap';

import NoImageModal from '../components/NoImageModal';

const AddLocation = () => {
  // 추가: UX 개선용 상태 및 한글 라벨 매핑
  const [showNoImageModal, setShowNoImageModal] = useState(false);
  const [skipImage, setSkipImage] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isSelectingOnMap, setIsSelectingOnMap] = useState(false);
  const [tempLatLng, setTempLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const typeLabelMap: { [key in LocationType]: string } = {
    [LocationType.BOOTH]: '부스',
    [LocationType.OUTDOOR]: '실외',
    [LocationType.INDOOR]: '실내',
  };
  // 현재 위치 가져오기
  const handleGetCurrentLocation = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSmokingData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGeoLoading(false);
      },
      (error) => {
        alert('위치 정보를 가져오지 못했습니다: ' + error.message);
        setGeoLoading(false);
      }
    );
  };
  // 지도에서 위치 선택 핸들러
  const handleMapClick = (e: any) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setTempLatLng({ lat, lng });
  };

  // 지도 선택 적용
  const handleApplyMapSelection = () => {
    if (tempLatLng) {
      setSmokingData((prev) => ({ ...prev, latitude: tempLatLng.lat, longitude: tempLatLng.lng }));
      setIsSelectingOnMap(false);
    }
  };

  // 주소 검색(적용)
  const handleAddressSearch = () => {
    setSmokingData((prev) => ({ ...prev, address: addressInput }));
  };

  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 로그인 상태 확인
  const [loginChecked, setLoginChecked] = useState(false);
  
  useEffect(() => {
    // user 상태가 확정되면 (로딩이 완료되면) 로그인 체크 완료로 표시
    if (user !== undefined) {
      setLoginChecked(true);
    }
  }, [user]);
  const { add } = useFirestore<SmokingLocation>('smokingLocations');

  const [smokingData, setSmokingData] = useState<Partial<LocationInput>>({
    name: '',
    address: '',
    type: LocationType.BOOTH,
    description: '',
    latitude: 0,
    longitude: 0,
    operatingHours: {},
    seating: {
      chairs: false,
      tables: false,
      standingArea: false,
      wheelchairAccessible: false
    },
    weatherProtection: {
      roof: false,
      windBreak: false,
      heaters: false,
      coveredArea: false
    },
    status: LocationStatus.ACTIVE,
    createdBy: '',
    tags: []
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!smokingData.name?.trim()) {
      errors.name = '장소 이름을 입력해주세요.';
    }
    
    if (!smokingData.address?.trim()) {
      errors.address = '주소를 입력해주세요.';
    }
    
    if (!smokingData.description?.trim()) {
      errors.description = '흡연구역 코멘트를 입력해주세요.';
    }
    
    if (smokingData.latitude === 0) {
      errors.latitude = '위도를 입력해주세요.';
    }
    
    if (smokingData.longitude === 0) {
      errors.longitude = '경도를 입력해주세요.';
    }
    
    if (!imageFile && !skipImage) {
      setShowNoImageModal(true);
      return false;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 사진 없이 저장 허용 핸들러
  const handleSkipImage = () => {
    setShowNoImageModal(false);
    setSkipImage(true);
    // 폼 재제출
    setTimeout(() => {
      const form = document.querySelector('.add-location-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // 이미지 업로드
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `smokingLocations/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // 데이터 준비
      const locationData: SmokingLocation = {
        // 등록 직전 데이터 콘솔 확인
        // eslint-disable-next-line no-console
        ...(() => { console.log('[장소 등록 시도] locationData:', smokingData); return {}; })(),
        name: smokingData.name || '',
        address: smokingData.address || '',
        type: smokingData.type || LocationType.BOOTH,
        description: smokingData.description || '',
        latitude: smokingData.latitude || 0,
        longitude: smokingData.longitude || 0,
        imageUrl,
        status: LocationStatus.ACTIVE,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        tags: smokingData.tags || [],
        operatingHours: smokingData.operatingHours,
        seating: smokingData.seating,
        weatherProtection: smokingData.weatherProtection
      };
      
      // Firestore에 저장
      await add(locationData);
      
      alert('흡연 장소가 성공적으로 등록되었습니다!');
      navigate('/locations');
    } catch (error) {
      console.error('장소 등록 중 오류 발생:', error);
      alert('장소 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckboxChange = (category: 'seating' | 'weatherProtection', option: string) => {
    setSmokingData(prev => {
      const currentOptions = prev[category] || {};
      return {
        ...prev,
        [category]: {
          ...currentOptions,
          [option]: !(currentOptions as any)?.[option]
        }
      };
    });
  };

  // 로그인 체크가 완료되고 로그인되지 않은 경우
  if (loginChecked && !user) {
    // 알림 없이 바로 리다이렉트
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="add-location-container">
      <h1>흡연구역 등록</h1>
      
      <form onSubmit={handleSubmit} className="location-form">
        <div className="form-group">
          <label htmlFor="name">장소 이름</label>
          <input
            type="text"
            id="name"
            value={smokingData.name}
            onChange={(e) => setSmokingData({ ...smokingData, name: e.target.value })}
            placeholder="장소 이름을 입력하세요"
            className={formErrors.name ? 'error' : ''}
          />
          {formErrors.name && <span className="error-message">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">주소</label>
          <div className="address-input-container">
            <input
              type="text"
              id="addressInput"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="주소를 입력하세요"
              className={formErrors.address ? 'error' : ''}
            />
            <button type="button" onClick={handleAddressSearch}>주소 적용</button>
          </div>
          <input
            type="text"
            id="address"
            value={smokingData.address}
            readOnly
            className={formErrors.address ? 'error' : ''}
          />
          {formErrors.address && <span className="error-message">{formErrors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">흡연구역 유형</label>
          <select
            id="type"
            name="type"
            value={smokingData.type}
            onChange={e => setSmokingData(prev => ({
              ...prev,
              type: e.target.value as LocationType
            }))}
          >
            {Object.values(LocationType).map(type => (
              <option key={type} value={type}>{typeLabelMap[type]}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">흡연구역 코멘트</label>
          <textarea
            id="description"
            value={smokingData.description}
            onChange={(e) => setSmokingData({ ...smokingData, description: e.target.value })}
            placeholder="흡연구역에 대한 유의사항, 설명을 간단히 입력해주세요."
            className={formErrors.description ? 'error' : ''}
          />
          {formErrors.description && <span className="error-message">{formErrors.description}</span>}
        </div>

        <div className="form-row" style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="latitude">위도</label>
            <input
              type="number"
              id="latitude"
              value={smokingData.latitude}
              readOnly
              className={formErrors.latitude ? 'error' : ''}
            />
            {formErrors.latitude && <span className="error-message">{formErrors.latitude}</span>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="longitude">경도</label>
            <input
              type="number"
              id="longitude"
              value={smokingData.longitude}
              readOnly
              className={formErrors.longitude ? 'error' : ''}
            />
            {formErrors.longitude && <span className="error-message">{formErrors.longitude}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 150 }}>
            <button type="button" onClick={handleGetCurrentLocation} disabled={geoLoading}>
              {geoLoading ? '위치 가져오는 중...' : '현재 위치 설정'}
            </button>
            <button type="button" style={{ marginLeft: 8 }} onClick={() => setIsSelectingOnMap(true)}>
              지도에서 선택
            </button>
          </div>
        </div>
        {isSelectingOnMap && (
          <div style={{marginTop: '1rem', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f9fafd'}}>
            <div style={{height: '320px', width: '100%'}}>
              <GoogleMap
                locations={tempLatLng ? [{ id: 'temp', name: '선택 위치', latitude: tempLatLng.lat, longitude: tempLatLng.lng, address: '', type: LocationType.OUTDOOR, createdAt: '', createdBy: '', isVerified: false, tags: [] }] : []}
                center={tempLatLng || (smokingData.latitude && smokingData.longitude ? { lat: smokingData.latitude, lng: smokingData.longitude } : undefined)}
                // onMapClick={handleMapClick}
                onMarkerClick={() => {}}
                selectedLocation={null}
              />
            </div>
            <div style={{padding: '0.5rem', textAlign: 'center'}}>
              <span style={{fontSize: '0.96rem', color: '#666'}}>지도를 클릭하여 위치를 선택하세요.</span>
              <button type="button" style={{marginLeft: '1rem'}} onClick={handleApplyMapSelection} disabled={!tempLatLng}>선택 적용</button>
              <button type="button" style={{marginLeft: '0.5rem'}} onClick={() => setIsSelectingOnMap(false)}>취소</button>
            </div>
          </div>
        )}


        <div className="form-group">
          <label htmlFor="image">흡연구역 사진</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className={formErrors.imageFile ? 'error' : ''}
          />
          {imageFile && <p>선택된 파일: {imageFile.name}</p>}
          {formErrors.imageFile && <span className="error-message">{formErrors.imageFile}</span>}
        </div>

        <div className="options-group">
  <div className="seating-options">
    <h3>기타</h3>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.seating as any)?.chairs || false}
        onChange={() => handleCheckboxChange('seating', 'chairs')}
      />
      의자
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.seating as any)?.tables || false}
        onChange={() => handleCheckboxChange('seating', 'tables')}
      />
      테이블
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.seating as any)?.standingArea || false}
        onChange={() => handleCheckboxChange('seating', 'standingArea')}
      />
      서있는 공간
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.seating as any)?.wheelchairAccessible || false}
        onChange={() => handleCheckboxChange('seating', 'wheelchairAccessible')}
      />
      휠체어 접근 가능
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.weatherProtection as any)?.roof || false}
        onChange={() => handleCheckboxChange('weatherProtection', 'roof')}
      />
      지붕
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.weatherProtection as any)?.windBreak || false}
        onChange={() => handleCheckboxChange('weatherProtection', 'windBreak')}
      />
      바람차단
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.weatherProtection as any)?.heaters || false}
        onChange={() => handleCheckboxChange('weatherProtection', 'heaters')}
      />
      난방기
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={(smokingData.weatherProtection as any)?.coveredArea || false}
        onChange={() => handleCheckboxChange('weatherProtection', 'coveredArea')}
      />
      보호 공간
    </label>
  </div>
</div>

        <button 
          type="submit" 
          className="submit-button"
        >
          {isUploading ? '업로드 중...' : '장소 추가'}
        </button>
      </form>
      {showNoImageModal && (
        <NoImageModal
          onClose={() => setShowNoImageModal(false)}
          onSkip={handleSkipImage}
        />
      )}
    </div>
  );
};

export default AddLocation;