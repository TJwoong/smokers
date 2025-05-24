import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { SmokingLocation, Review as ReviewType } from '../types';
import { StarRating } from './common/StarRating';
import { ReviewSection } from './review/ReviewSection';
import './SmokingLocationDetail.css';

export const SmokingLocationDetail: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState<SmokingLocation | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationId) return;

      setIsPending(true);
      setError(null);

      try {
        const docRef = doc(db, 'smokingLocations', locationId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLocation({ id: docSnap.id, ...docSnap.data() } as SmokingLocation);
        } else {
          setError('해당 장소를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('장소 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsPending(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!locationId) return;

      setIsLoadingReviews(true);
      setReviewError(null);

      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewsQuery = query(reviewsRef, where('locationId', '==', locationId));
        const querySnapshot = await getDocs(reviewsQuery);
        
        const fetchedReviews: ReviewType[] = [];
        querySnapshot.forEach((doc) => {
          fetchedReviews.push({ id: doc.id, ...doc.data() } as ReviewType);
        });

        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviewError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [locationId]);

  if (!locationId) {
    navigate('/');
    return null;
  }

  if (isPending || isLoadingReviews) return <div>로딩 중...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>해당 장소를 찾을 수 없습니다.</div>;

  return (
    <div className="location-detail">
      <div className="location-detail__header">
        <h1 className="location-detail__title">{location.name}</h1>
        <div className="location-detail__rating">
          <StarRating rating={location.rating ?? 0} readOnly size="lg" />
          <span className="location-detail__review-count">
            ({location.reviewCount}개의 리뷰)
          </span>
        </div>
      </div>

      <div className="location-detail__content">
        <div className="location-detail__info">
          <p className="location-detail__address">{location.address}</p>
          <p className="location-detail__type">{location.type}</p>
          <p className="location-detail__description">{location.description}</p>
          
          <div className="location-detail__features">
            {location.operatingHours && Object.keys(location.operatingHours).length > 0 && (
              <div className="location-detail__feature">
                <span className="location-detail__feature-label">영업 시간:</span>
                <span className="location-detail__feature-value">
                  {Object.entries(location.operatingHours).map(([day, hours]) => (
                    <div key={day}>
                      {day}: {(hours as any).open} - {(hours as any).close}
                    </div>
                  ))}
                </span>
              </div>
            )}
            
            {location.seating && (
              <div className="location-detail__feature">
                <span className="location-detail__feature-label">좌석:</span>
                <span className="location-detail__feature-value">
                  {location.seating.chairs ? '의자 있음, ' : ''}
                  {location.seating.tables ? '테이블 있음, ' : ''}
                  {location.seating.standingArea ? '스탠딩 있음' : ''}
                  {!location.seating.chairs && !location.seating.tables && !location.seating.standingArea && '없음'}
                </span>
              </div>
            )}
            
            {location.weatherProtection && (
              <div className="location-detail__feature">
                <span className="location-detail__feature-label">날씨 보호:</span>
                <span className="location-detail__feature-value">
                  {location.weatherProtection.roof ? '지붕 있음, ' : ''}
                  {location.weatherProtection.heaters ? '히터 있음, ' : ''}
                  {location.weatherProtection.windBreak ? '바람막이 있음' : ''}
                  {!location.weatherProtection.roof && !location.weatherProtection.heaters && !location.weatherProtection.windBreak && '없음'}
                </span>
              </div>
            )}
          </div>
        </div>

        {location.imageUrl && (
          <img
            src={location.imageUrl}
            alt={location.name}
            className="location-detail__image"
          />
        )}
      </div>

      {reviewError && <div className="error">{reviewError}</div>}
      
      <ReviewSection
        locationId={locationId}
        reviews={reviews}
      />
    </div>
  );
}; 