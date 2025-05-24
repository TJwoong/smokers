import React, { useState } from 'react';
import { Review } from '../types/index';

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string; imageFile?: File | null }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment, imageFile });
    setRating(5);
    setComment('');
    setImageFile(null);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        평점:
        <input
          type="number"
          value={rating}
          min={1}
          max={5}
          onChange={e => setRating(Number(e.target.value))}
        />
      </label>
      <label>
        코멘트:
        <textarea value={comment} onChange={e => setComment(e.target.value)} required />
      </label>
      <label>
        이미지 첨부:
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
      </label>
      <button type="submit">리뷰 등록</button>
    </form>
  );
};

export default ReviewForm;
