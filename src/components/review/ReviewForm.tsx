import React, { useState, ChangeEvent, FormEvent } from 'react';
import { StarRating } from './StarRating';
import './ReviewForm.css';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string, image: File | null) => Promise<void>;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }
    onSubmit(rating, comment, image);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__rating">
        <label>평점</label>
        <StarRating
          rating={rating}
          onChange={setRating}
          size="large"
          interactive
        />
      </div>
      <div className="review-form__comment">
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          required
        />
      </div>
      <div className="review-form__image">
        <label htmlFor="image">Add Image (optional):</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="review-form__image-preview"
          />
        )}
      </div>
      <div className="review-form__actions">
        <button type="submit" className="review-form__submit">
          Submit Review
        </button>
        {onCancel && (
          <button
            type="button"
            className="review-form__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}; 