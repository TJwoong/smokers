import React from 'react';
import { Timestamp } from 'firebase/firestore';
import type { Review } from '../../types';
import { StarRating } from '../common/StarRating';
import './ReviewItem.css';

interface ReviewItemProps {
  review: Review;
  currentUserId: string | null;
  onDelete: (reviewId: string) => Promise<void>;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, currentUserId, onDelete }) => {
  const isOwner = currentUserId === review.userId;
  
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!review.id || !window.confirm('리뷰를 삭제하시겠습니까?')) return;
    await onDelete(review.id);
  };

  return (
    <div className="review-item">
      <div className="review-item__header">
        <div className="review-item__user">
          {review.userPhotoURL ? (
            <img
              src={review.userPhotoURL}
              alt={review.userName}
              className="review-item__user-photo"
            />
          ) : (
            <div className="review-item__user-photo-placeholder">
              {review.userName ? review.userName[0] : '익'}
            </div>
          )}
          <span className="review-item__username">{review.userName}</span>
        </div>
        <div className="review-item__rating">
          <StarRating rating={review.rating} readOnly size="sm" />
        </div>
      </div>

      <div className="review-item__content">
        <p className="review-item__comment">{review.comment}</p>
        {review.imageUrl && (
          <img
            src={review.imageUrl}
            alt="Review"
            className="review-item__image"
          />
        )}
      </div>

      <div className="review-item__footer">
        <span className="review-item__date">
          {review.createdAt instanceof Timestamp && formatDate(review.createdAt)}
        </span>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="review-item__delete-btn"
            aria-label="Delete review"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewItem; 