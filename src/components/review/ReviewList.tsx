import React from 'react';
import type { Review } from '../../types';
import { ReviewItem } from './ReviewItem';
import './ReviewList.css';

interface ReviewListProps {
  reviews: Review[];
  currentUserId: string | null;
  onDelete: (reviewId: string) => Promise<void>;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onDelete
}) => {
  if (reviews.length === 0) {
    return (
      <div className="review-list review-list--empty">
        <p>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}; 