import React from 'react';
import { Review } from '../types/index';

interface ReviewListProps {
  reviews: Review[];
  currentUserId: string;
  onDelete: (reviewId: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUserId, onDelete }) => {
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="review-rating">⭐ {review.rating}</span>
            <span className="review-user">작성자: {review.userId}</span>
            {review.userId === currentUserId && (
              <button onClick={() => onDelete(review.id!)}>삭제</button>
            )}
          </div>
          <div className="review-body">
            <p>{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((img, idx) => (
                  <img key={idx} src={img} alt="리뷰 이미지" width={80} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
