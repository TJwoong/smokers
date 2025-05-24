import React from 'react';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import type { SmokingLocation } from '../../types';
import { StarRating } from '../common/StarRating';
import './Review.css';

interface Review {
  id: string;
  locationId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: Timestamp;
  helpfulCount: number;
  commentCount: number;
}

interface ReviewProps {
  review: Review;
  currentUserId?: string;
  onDelete?: (reviewId: string) => void;
}

export const Review: React.FC<ReviewProps> = ({
  review,
  currentUserId,
  onDelete
}) => {
  const isOwner = currentUserId === review.userId;
  const createdAt = review.createdAt instanceof Timestamp 
    ? review.createdAt.toDate() 
    : new Date();

  return (
    <div className="review">
      <div className="review__header">
        <div className="review__user-info">
          <img
            src={review.userPhotoURL || '/default-avatar.png'}
            alt={review.userName}
            className="review__user-avatar"
          />
          <div className="review__user-details">
            <span className="review__user-name">{review.userName}</span>
            <span className="review__date">
              {format(createdAt, 'PPP')}
            </span>
          </div>
        </div>
        {isOwner && onDelete && (
          <button
            className="review__delete-btn"
            onClick={() => onDelete(review.id)}
            aria-label="리뷰 삭제"
          >
            삭제
          </button>
        )}
      </div>

      <div className="review__content">
        <div className="review__rating">
          <StarRating rating={review.rating} size="sm" readOnly />
          <span className="review__rating-value">{review.rating.toFixed(1)}</span>
        </div>
        <p className="review__comment">{review.comment}</p>
        {review.imageUrl && (
          <img
            src={review.imageUrl}
            alt="리뷰 이미지"
            className="review__image"
            loading="lazy"
          />
        )}
      </div>

      <div className="review__footer">
        <div className="review__stats">
          <span className="review__helpful">
            도움됨 {review.helpfulCount}
          </span>
          <span className="review__comments">
            댓글 {review.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Review; 