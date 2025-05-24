import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  previewUrl?: string;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, previewUrl, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="image-uploader">
      {label && <label>{label}</label>}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        이미지 선택
      </button>
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="미리보기" style={{ maxWidth: 160, borderRadius: 8, marginTop: 8 }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
