import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import QRCode from 'qrcode';
import './ReceiptModal.css';

export default function ReceiptModal({ show, onHide, payment }) {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (show && payment) {
      generateQRCode();
    }
  }, [show, payment]);

  const generateQRCode = async () => {
    try {
      // Create a string with payment details for the QR code
      const qrValue = `Suitable Receipt\nID: ${payment.id}\nDate: ${payment.date}\nTotal: ${payment.totalAmount} TL`;
      const url = await QRCode.toDataURL(qrValue, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR Code error:', err);
    }
  };

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="receipt-modal" size="md">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 text-center text-white">
          <i className="bi bi-receipt me-2"></i>
          {t('invoiceTitle')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center bg-dark p-4">
        {/* The Receipt Paper */}
        <div className="receipt-paper" id="printable-receipt">
          <div className="receipt-header text-center mb-4">
            <h2 className="receipt-brand-name">SUITABLE</h2>
            <div className="receipt-divider"></div>
            <p className="receipt-subtitle">{t('invoiceTitle')}</p>
          </div>

          <div className="receipt-info mb-4">
            <div className="d-flex justify-content-between">
              <span>{t('invoiceNo')}:</span>
              <span className="fw-bold">#INV-{payment.id?.substring(0, 8).toUpperCase() || 'DUMMY'}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>{t('receiptDate')}:</span>
              <span>{payment.date}</span>
            </div>
          </div>

          <div className="receipt-items mb-4">
            <div className="receipt-divider-dashed mb-2"></div>
            <div className="d-flex justify-content-between fw-bold mb-2">
              <span className="flex-grow-1">{t('productName')}</span>
              <span className="mx-2">{t('quantity')}</span>
              <span className="text-end" style={{ minWidth: '80px' }}>{t('productPrice')}</span>
            </div>
            <div className="receipt-divider-dashed mb-3"></div>

            {payment.products && payment.products.map((item, index) => (
              <div key={index} className="receipt-item d-flex justify-content-between mb-2">
                <span className="flex-grow-1 text-truncate pe-2">{item.name}</span>
                <span className="mx-2">{item.quantity}</span>
                <span className="text-end" style={{ minWidth: '80px' }}>{item.price * item.quantity} TL</span>
              </div>
            ))}

            <div className="receipt-divider-dashed mt-3"></div>
          </div>

          <div className="receipt-summary">
            <div className="d-flex justify-content-between fs-4 fw-bold">
              <span>{t('receiptTotal')}</span>
              <span className="text-danger">{payment.totalAmount} TL</span>
            </div>
          </div>

          <div className="receipt-footer text-center mt-5">
            <div className="receipt-divider mb-3"></div>
            <p className="mb-1">{t('thanks')}</p>
            <div className="receipt-qr-container mt-3">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="receipt-qr-img" />}
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          className="btn-print mt-4 w-100 py-3 rounded-pill no-print"
          onClick={handlePrint}
        >
          <i className="bi bi-printer me-2"></i>
          {t('print')}
        </Button>
      </Modal.Body>
    </Modal>
  );
}
