import React, { useEffect, useRef, useState } from 'react';
import { SmokingLocation } from '../types';
import './GoogleMap.css';

const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.9780
};

interface Props {
  locations: SmokingLocation[];
  onMarkerClick?: (location: SmokingLocation) => void;
  selectedLocation?: SmokingLocation | null;
  center?: { lat: number; lng: number };
}

const markerIconUrl = '/free-icon-map-marker-5860579.png';

const GoogleMapComponent = ({
  locations,
  onMarkerClick,
  selectedLocation,
  center = DEFAULT_CENTER
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (mapInstance) return;
    if (window.google && window.google.maps && mapRef.current) {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: 11,
          zoomControl: true,
        });
        setMapInstance(map);
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }
      } catch (error) {
        console.error('Error creating map instance:', error);
      }
      return;
    }
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 11,
            zoomControl: true,
          });
          setMapInstance(map);
          if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
          }
        }
      };
      document.body.appendChild(script);
    }
  }, [center, mapInstance]);

  // 마커 생성 및 지도에 표시
  useEffect(() => {
    if (!mapInstance) return;
    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    locations.forEach(location => {
      const lat = Number(location.latitude);
      const lng = Number(location.longitude);
      console.log('마커 생성 시도:', location, lat, lng);
      if (!lat || !lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: location.name,
        icon: {
          url: markerIconUrl,
          scaledSize: new window.google.maps.Size(38, 38)
        }
      });
      marker.addListener('click', () => {
        if (onMarkerClick) onMarkerClick(location);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
  <div class="info-window">
    <h3>${location.name}</h3>
    <p>${location.address}</p>
    <p>${location.description ? location.description : ''}</p>
    <div class="info-meta">
      <span class="type ${location.type.toLowerCase()}">#${location.type}</span>
      <span class="rating">⭐ ${location.rating ?? '-'} (${location.reviewCount ?? 0} 리뷰)</span>
    </div>
  </div>
`);
          infoWindowRef.current.open(mapInstance, marker);
        }
      });
      markersRef.current.push(marker);
    });
  }, [mapInstance, locations, onMarkerClick]);

  useEffect(() => {
    if (!mapInstance || !selectedLocation) return;
    try {
      mapInstance.panTo({ lat: selectedLocation.latitude, lng: selectedLocation.longitude });
      mapInstance.setZoom(17);
    } catch (error) {
      console.error('Error panning with vanilla map:', error);
    }
  }, [mapInstance, selectedLocation]);

  useEffect(() => {
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      if (mapInstance) {
        console.log('Cleaning up vanilla map instance.');
      }
    };
  }, [mapInstance]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default GoogleMapComponent;
