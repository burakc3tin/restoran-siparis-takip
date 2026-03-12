import { Modal, Button, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import './DeleteConfirmationModal.css';

export default function DeleteConfirmationModal({ show, onHide, onConfirm, itemName, loading }) {
  const { t } = useLanguage();
  return (
    <Modal show={show} onHide={onHide} centered className="delete-confirm-modal" backdrop="static" size="md">
      <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
        <Modal.Title className="w-100 text-center text-danger">{t('deleteConfirmTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center pt-3 pb-4">
        <p className="mb-4 fs-5">
          <strong className="text-white">{itemName}</strong> {itemName?.includes('adet') ? t('deleteMultiConfirmText') : t('deleteConfirmText')}
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Button variant="outline-light" className="w-50" onClick={onHide} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button variant="danger" className="w-50" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : t('yesDelete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
