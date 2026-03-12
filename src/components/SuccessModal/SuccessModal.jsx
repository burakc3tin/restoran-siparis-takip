import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Confetti from 'react-confetti';
import { useLanguage } from '../../context/LanguageContext';
import cashSound from '../../assets/sound/cash_sound.mp3';
import './SuccessModal.css';

export default function SuccessModal({ show, onHide }) {
  const { t } = useLanguage();
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (show) {
      const audio = new Audio(cashSound);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [show]);

  return (
    <>
      {show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1060, pointerEvents: 'none' }}>
          <Confetti 
            width={windowDimensions.width} 
            height={windowDimensions.height} 
            recycle={false} 
            numberOfPieces={600} 
            gravity={0.15}
          />
        </div>
      )}
      <Modal show={show} onHide={onHide} centered className="success-modal" backdrop="static">
        <Modal.Body className="text-center p-5">
          <div className="success-icon-wrapper mb-4">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="success-title mb-3">{t('paymentSuccessTitle')}</h2>
          <p className="success-text mb-4">{t('paymentSuccessMessage')}</p>
          <Button className="btn-success-ok w-100 py-3 fs-5" onClick={onHide}>
            {t('ok')}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
