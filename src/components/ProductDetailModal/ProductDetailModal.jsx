import { Modal, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import './ProductDetailModal.css';

export default function ProductDetailModal({ show, onHide, product }) {
  const { t } = useLanguage();
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered className="product-detail-modal" size="lg">
      <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="detail-layout">
          <div className="detail-image-container">
            {product.image && (product.image.startsWith('http') || product.image.startsWith('blob') || product.image.startsWith('/')) ? (
              <img src={product.image} alt={product.name} className="detail-image" />
            ) : (
              <div className="detail-emoji-large">{product.image}</div>
            )}
          </div>
          <div className="detail-content p-4 p-md-5">
            <h2 className="detail-title mb-2">{product.name}</h2>
            <div className="detail-price mb-4">{product.price} TL</div>
            
            <div className="detail-description-box mb-4">
              <h5 className="desc-heading"><i className="bi bi-card-text me-2"></i>{t('detailDescription')}</h5>
              <p className="detail-description">
                {product.description || t('detailNoDescription')}
              </p>
            </div>
            
            {product.qrCode && (
              <div className="detail-qr-container mt-auto text-center text-md-start">
                <hr className="border-secondary opacity-25 mb-4 d-md-none" />
                <div className="d-flex flex-column align-items-center align-items-md-start">
                  <p className="small text-white-50 mb-2 opacity-75">
                    <i className="bi bi-qr-code-scan me-2"></i> Ürün QR Kodu
                  </p>
                  <div className="qr-wrapper">
                    <img src={product.qrCode} alt="QR Code" className="detail-qr-image" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
