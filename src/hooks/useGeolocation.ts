import { useState, useEffect } from 'react';

// 기본 위치 (강남역)
const DEFAULT_LOCATION = {
  latitude: 37.5665,  // 서울시청
  longitude: 126.9780
};

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    let watchId: number | null = null;
    let isMounted = true; // 컴포넌트 마운트 상태 추적

    const clearWatch = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      if (isMounted) {
        setState({
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          error: '이 브라우저는 위치 정보를 지원하지 않습니다.',
          loading: false
        });
      }
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      if (isMounted) {
        console.log('Geolocation success:', position.coords);
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false
        });
        // 성공 시 감시 중단 (선택 사항: 실시간 추적이 필요하면 주석 처리)
        // clearWatch(); 
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      if (isMounted) {
        console.error('Geolocation error:', error.code, error.message);
        let errorMessage = '위치 정보를 가져오는 중 오류가 발생했습니다.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '현재 위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다 (20초).';
            break;
        }
        setState({
          latitude: DEFAULT_LOCATION.latitude, // 오류 시 기본 위치 사용
          longitude: DEFAULT_LOCATION.longitude,
          error: errorMessage,
          loading: false
        });
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: false, // 정확도 낮춰서 시도
      timeout: 20000,        // 타임아웃 20초
      maximumAge: 60000       // 1분 이내 캐시된 위치 사용
    };

    console.log('Requesting geolocation watchPosition...');
    // 기존 watch 중지 후 새로 시작
    clearWatch();
    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // 컴포넌트 언마운트 시 정리
    return () => {
      isMounted = false;
      clearWatch();
      console.log('Cleared geolocation watch.');
    };
  }, []); // 의존성 배열 비워서 마운트 시 한 번만 실행

  return state;
};

export default useGeolocation; 