import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Review } from '../../types';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import './ReviewSection.css';

interface ReviewSectionProps {
  locationId: string;
  reviews: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ locationId, reviews }) => {
  const [isWriting, setIsWriting] = useState(false);
  const { user } = useAuth();
  const { add, remove } = useFirestore<Review>('reviews');

  const handleSubmitReview = async (rating: number, comment: string, image: File | null) => {
    if (!user) {
      alert('리뷰를 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `reviews/${locationId}/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await add({
        locationId,
        userId: user.uid,
        userName: user.displayName || '익명',
        rating,
        comment,
        imageUrl,
        createdAt: Timestamp.now() as unknown as Timestamp,
        userPhotoURL: user.photoURL || undefined,
        helpfulCount: 0,
        commentCount: 0,
        cleanliness: 5, // 기본값
        safetyLevel: 5  // 기본값
      });
      setIsWriting(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await remove(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="review-section">
      <div className="review-section__header">
        <h2 className="review-section__title">리뷰</h2>
        {user && !isWriting && (
          <button
            className="review-section__write-btn"
            onClick={() => setIsWriting(true)}
          >
            리뷰 작성
          </button>
        )}
      </div>

      {isWriting && (
        <ReviewForm onSubmit={handleSubmitReview} onCancel={() => setIsWriting(false)} />
      )}

      <ReviewList
        reviews={reviews}
        currentUserId={user?.uid || null}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}; 