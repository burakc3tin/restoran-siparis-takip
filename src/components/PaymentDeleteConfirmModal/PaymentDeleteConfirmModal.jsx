import { Modal, Button, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import './PaymentDeleteConfirmModal.css';

export default function PaymentDeleteConfirmModal({ show, onHide, onConfirm, loading }) {
  const { t } = useLanguage();

  return (
    <Modal show={show} onHide={onHide} centered className="payment-delete-modal" backdrop="static">
      <Modal.Body className="text-center p-4">
        <div className="delete-icon-wrapper mb-3">
          <i className="bi bi-trash3-fill text-danger"></i>
        </div>
        <h4 className="delete-title mb-3 text-white">{t('deleteSelected')}</h4>
        <p className="delete-text mb-4 text-white-50">{t('warningDeletePayments')}</p>
        
        <div className="d-flex gap-3 mt-4">
          <Button 
            className="btn-delete-cancel flex-grow-1" 
            onClick={onHide}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button 
            className="btn-delete-confirm flex-grow-1" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : t('yesDelete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
