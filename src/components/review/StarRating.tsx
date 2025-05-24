import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  size = 'medium',
  readonly = false,
  interactive = false
}) => {
  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'star-rating--small';
      case 'large':
        return 'star-rating--large';
      default:
        return 'star-rating--medium';
    }
  };

  return (
    <div className={`star-rating ${getSizeClass()} ${interactive ? 'star-rating--interactive' : ''}`}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star-rating__star ${index < rating ? 'star-rating__star--filled' : ''}`}
          onClick={() => handleClick(index)}
          role={!readonly ? 'button' : undefined}
          tabIndex={!readonly ? 0 : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}; 