import React from 'react';
import './NoImageModal.css';

interface NoImageModalProps {
  onClose: () => void;
  onSkip: () => void;
}

const NoImageModal: React.FC<NoImageModalProps> = ({ onClose, onSkip }) => {
  return (
    <div className="no-image-modal-backdrop">
      <div className="no-image-modal">
        <h2>흡연구역 사진을 공유해주세요</h2>
        <p>흡연구역의 실제 사진을 첨부해주시면<br/>다른 이용자에게 큰 도움이 됩니다.</p>
        <div className="no-image-modal-buttons">
          <button className="primary" onClick={onClose}>사진 첨부하러 가기</button>
          <button className="secondary" onClick={onSkip}>사진 공유 없이 흡연구역 위치만 저장</button>
        </div>
      </div>
    </div>
  );
};

export default NoImageModal;
