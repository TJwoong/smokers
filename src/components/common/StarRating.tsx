import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  readOnly = false,
  size = 'md',
  onChange
}) => {
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`star-rating star-rating--${size}`}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star-rating__star ${
            index < rating ? 'star-rating__star--filled' : ''
          } ${!readOnly ? 'star-rating__star--interactive' : ''}`}
          onClick={() => handleClick(index)}
          role={!readOnly ? 'button' : undefined}
          tabIndex={!readOnly ? 0 : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}; 