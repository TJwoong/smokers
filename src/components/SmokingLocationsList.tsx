import React from 'react';
import { Link } from 'react-router-dom';
import { SmokingLocation } from '../types';
import { useCollection } from '../hooks/useCollection';
import { StarRating } from './review/StarRating';
import './SmokingLocationsList.css';

export const SmokingLocationsList: React.FC = () => {
  const { data: locations, loading, error } = useCollection<SmokingLocation>('smokingLocations');

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">에러: {error}</div>;
  }

  if (!locations || locations.length === 0) {
    return <div className="no-locations">등록된 장소가 없습니다.</div>;
  }

  return (
    <div className="locations-list">
      {locations.map((location: SmokingLocation) => (
        <Link
          to={`/locations/${location.id}`}
          key={location.id}
          className="location-card"
        >
          <div className="location-card__image">
            {location.imageUrl ? (
              <img src={location.imageUrl} alt={location.name} />
            ) : (
              <div className="location-card__no-image">이미지 없음</div>
            )}
          </div>
          
          <div className="location-card__content">
            <h3 className="location-card__name">{location.name}</h3>
            <p className="location-card__address">{location.address}</p>
            
            <div className="location-card__rating">
              <StarRating rating={location.rating ?? 0} size="small" readonly />
              <span className="location-card__review-count">
                ({location.reviewCount})
              </span>
            </div>
            
            <div className="location-card__tags">
              <span className="location-card__tag">{location.type}</span>
              {location.seating && (
                <span className="location-card__tag">좌석</span>
              )}
              {location.weatherProtection && (
                <span className="location-card__tag">날씨 보호</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}; 