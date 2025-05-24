import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSmokingLocation, updateSmokingLocation, deleteSmokingLocation } from '../utils/smokingLocations';
import { getReviewsByLocation, addReview, deleteReview } from '../utils/reviews';
import { uploadImage } from '../utils/storage';
import { auth } from '../firebase';
import GoogleMap from '../components/GoogleMap';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import ImageUploader from '../components/ImageUploader';
import TagList from '../components/TagList';
import { Review, SmokingLocation } from '../types/index';
import './LocationDetail.css';

export const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<SmokingLocation | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const currentUserId = user?.uid || '';
  const isOwner = location?.createdBy === currentUserId || currentUserId === 'admin';

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const loc = await getSmokingLocation(id);
      setLocation(loc);
      setMainImagePreview(loc?.imageUrl ?? null);
      setTags(loc?.tags || []);
      setEditName(loc?.name || '');
      setEditDesc(loc?.description || '');
      if (!loc) {
        setLoading(false);
        return;
      }
      const revs = await getReviewsByLocation(id);
      setReviews(revs);
      setLoading(false);
    })();
  }, [id]);

  const handleEditSave = async () => {
    if (!location) return;
    setLoading(true);
    let imageUrl = location.imageUrl;
    if (mainImageFile) {
      imageUrl = await uploadImage(mainImageFile, 'locations');
    }
    await updateSmokingLocation(location.id!, {
      name: editName,
      description: editDesc,
      tags,
      imageUrl,
    });
    setLocation({ ...location, name: editName, description: editDesc, tags, imageUrl });
    setMainImagePreview(imageUrl ?? null);
    setIsEditMode(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!location) return;
    setLoading(true);
    await deleteSmokingLocation(location.id!);
    setShowDeleteConfirm(false);
    setLoading(false);
    navigate('/locations');
  };

  const handleMainImageUpload = (file: File) => {
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string; imageFile?: File | null }) => {
    setLoading(true);
    let imageUrls: string[] = [];
    if (data.imageFile) {
      const url = await uploadImage(data.imageFile, 'reviewImages');
      imageUrls = [url];
    }
    await addReview({
      rating: data.rating,
      comment: data.comment,
      locationId: location!.id!,
      userId: currentUserId,
      cleanliness: 5,
      safetyLevel: 5,
      images: imageUrls,
      // createdAt is set server-side or by Firestore, so omit here
    });
    const revs = await getReviewsByLocation(location!.id!);
    setReviews(revs);
    setLoading(false);
  };

  const handleReviewDelete = async (reviewId: string) => {
    setLoading(true);
    await deleteReview(reviewId);
    setReviews(reviews.filter(r => r.id !== reviewId));
    setLoading(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (!location) {
    return (
      <div className="location-detail error">
        <Link to="/locations" className="back-button">← 목록으로</Link>
        <p>해당 위치를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const seating = (location as any).seating || {};
  const weatherProtection = (location as any).weatherProtection || {};

  return (
    <div className="location-detail">
      <Link to="/locations" className="back-button">← 목록으로</Link>
      {isOwner && !isEditMode && (
        <div className="owner-actions">
          <button onClick={() => setIsEditMode(true)}>수정</button>
          <button onClick={() => setShowDeleteConfirm(true)}>삭제</button>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div>정말로 이 장소를 삭제하시겠습니까?</div>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={() => setShowDeleteConfirm(false)}>취소</button>
        </div>
      )}
      {isEditMode ? (
        <div className="edit-section">
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="이름" />
          <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="설명" />
          <TagList tags={tags} editable={true} onChange={handleTagsChange} />
          <ImageUploader onUpload={handleMainImageUpload} previewUrl={mainImagePreview || undefined} label="장소 대표 이미지" />
          <button onClick={handleEditSave}>저장</button>
          <button onClick={() => setIsEditMode(false)}>취소</button>
        </div>
      ) : (
        <>
          <h1>{location.name}</h1>
          <p className="address">{location.address}</p>
          <div className="main-image-section">
            <ImageUploader onUpload={handleMainImageUpload} previewUrl={mainImagePreview || undefined} label="장소 대표 이미지" />
          </div>
          <div className="tags-section">
            <h3>태그</h3>
            <TagList tags={tags} editable={isOwner && isEditMode} onChange={handleTagsChange} />
          </div>
          <div className="info-section">
            <div className="rating">
              <span>⭐ {(location as any).rating?.toFixed?.(1) ?? '-'}</span>
              <span className="review-count">리뷰 {(location as any).reviewCount ?? 0}개</span>
            </div>
            <p className="description">{location.description}</p>
          </div>
          <div className="location-detail__map">
            <GoogleMap
              locations={[location]}
              selectedLocation={location}
              center={{ lat: location.latitude, lng: location.longitude }}
            />
          </div>
          <div className="features-section">
            <h2>시설 정보</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>좌석</h3>
                <ul>
                  <li className={seating.chairs ? 'available' : ''}>의자 있음</li>
                  <li className={seating.tables ? 'available' : ''}>테이블 있음</li>
                  <li className={seating.standingArea ? 'available' : ''}>스탠딩 구역 있음</li>
                  <li className={seating.wheelchairAccessible ? 'available' : ''}>휠체어 접근 가능</li>
                </ul>
              </div>
              <div className="feature">
                <h3>날씨 보호</h3>
                <ul>
                  <li className={weatherProtection.roof ? 'available' : ''}>지붕 있음</li>
                  <li className={weatherProtection.windBreak ? 'available' : ''}>바람막이 있음</li>
                  <li className={weatherProtection.heaters ? 'available' : ''}>히터 있음</li>
                  <li className={weatherProtection.coveredArea ? 'available' : ''}>실내/외 복합 공간</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="reviews-section">
            <h2>리뷰</h2>
            <ReviewForm onSubmit={handleReviewSubmit} />
            <ReviewList reviews={reviews} currentUserId={currentUserId} onDelete={handleReviewDelete} />
          </div>
        </>
      )}
    </div>
  );
};
