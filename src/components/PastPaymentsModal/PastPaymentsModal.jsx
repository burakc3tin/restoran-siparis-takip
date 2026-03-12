import { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Dropdown, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getOdemeler, deleteOdeme } from '../../services/firebase';
import PaymentDeleteConfirmModal from '../PaymentDeleteConfirmModal/PaymentDeleteConfirmModal';
import ReceiptModal from '../ReceiptModal/ReceiptModal';
import './PastPaymentsModal.css';

export default function PastPaymentsModal({ show, onHide }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest'
  const [expandedId, setExpandedId] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);

  useEffect(() => {
    if (show) {
      fetchPayments();
    }
  }, [show]);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getOdemeler();
      setPayments(data);
      setSelectedIds([]);
      setExpandedId(null);
    } catch (error) {
      console.error("Geçmiş ödemeler alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (dateString) => {
    // Handles formats like "12.03.2026 - 06:38" or "12.03.2026 -06:38"
    try {
      const parts = dateString.split('-');
      const datePart = parts[0].trim();
      const timePart = parts[1].trim();
      
      const [day, month, year] = datePart.split('.');
      const [hour, min] = timePart.split(':');
      return new Date(year, month - 1, day, hour, min).getTime();
    } catch (e) {
      return 0; 
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (sortBy === 'newest') {
      return parseDate(b.date) - parseDate(a.date);
    } else if (sortBy === 'oldest') {
      return parseDate(a.date) - parseDate(b.date);
    } else if (sortBy === 'highest') {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const traverseSelectAll = () => {
    if (selectedIds.length === payments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payments.map(p => p.id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    // 2-second fake loading as requested
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const deletePromises = selectedIds.map(id => deleteOdeme(id));
      await Promise.all(deletePromises);
      
      setPayments(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Ödeme silme hatası:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowReceipt = (payment) => {
    setSelectedReceiptPayment(payment);
    setShowReceiptModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered className="past-payments-modal" size="xl" backdrop="static">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="w-100 d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-clock-history text-danger"></i>
            {t('pastPayments')}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="d-flex flex-column h-100">
          <div className="payments-controls d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
            <OverlayTrigger placement="right" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipSelectAll'))}>
              <Form.Check 
                type="checkbox"
                id="selectAllPayments"
                label={t('selectAll')}
                checked={selectedIds.length > 0 && selectedIds.length === payments.length}
                onChange={traverseSelectAll}
                disabled={payments.length === 0}
                className="text-white fw-medium custom-checkbox select-all-check"
              />
            </OverlayTrigger>
            
            <div className="controls-right d-flex gap-3 align-items-center flex-wrap">
              <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipSort'))}>
                <Dropdown className="flex-grow-1 flex-md-grow-0">
                  <Dropdown.Toggle variant="outline-danger" id="dropdown-sort" className="sort-dropdown w-100">
                    <i className="bi bi-sort-down me-2"></i>
                    {sortBy === 'newest' ? t('sortByNewest') : sortBy === 'oldest' ? t('sortByOldest') : t('sortByHighest')}
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={() => setSortBy('newest')} active={sortBy === 'newest'}>{t('sortByNewest')}</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('oldest')} active={sortBy === 'oldest'}>{t('sortByOldest')}</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('highest')} active={sortBy === 'highest'}>{t('sortByHighest')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger>

              <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipDeletePayments'))}>
                <Button 
                  variant="danger" 
                  className="btn-delete-selected flex-grow-1 flex-md-grow-0"
                  disabled={selectedIds.length === 0}
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="bi bi-trash3 me-2"></i>
                  {t('deleteSelected')} {selectedIds.length > 0 && `(${selectedIds.length})`}
                </Button>
              </OverlayTrigger>
            </div>
          </div>

          <div className="payments-list-container flex-grow-1 overflow-auto">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100 py-5">
                <Spinner animation="border" variant="danger" />
              </div>
            ) : payments.length === 0 ? (
              <div className="empty-payments-message text-center py-5">
                <i className="bi bi-receipt-cutoff d-block mb-3"></i>
                <p>{t('noPastPayments')}</p>
              </div>
            ) : (
              <div className="payments-grid">
                {sortedPayments.map(payment => (
                  <div key={payment.id} className={`payment-card ${selectedIds.includes(payment.id) ? 'selected' : ''}`}>
                    <div className="payment-card-header d-flex justify-content-between align-items-start">
                      <Form.Check 
                        type="checkbox"
                        id={`check-${payment.id}`}
                        checked={selectedIds.includes(payment.id)}
                        onChange={() => toggleSelection(payment.id)}
                        className="custom-checkbox"
                      />
                      <div className="payment-date text-end">
                        <i className="bi bi-calendar2-event me-2 text-danger"></i>
                        {payment.date.includes(' - ') ? payment.date : payment.date.replace(' -', ' - ')}
                      </div>
                    </div>
                    
                    <div className="payment-card-body my-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-white-50 opacity-75">{t('totalItems')}:</span>
                        <span className="fw-bold text-white-50">{payment.totalItems}</span>
                      </div>
                      <div className="d-flex justify-content-between fs-5">
                        <span className="text-white-50 opacity-75">{t('totalAmount')}</span>
                        <span className="fw-bold text-danger" style={{ fontFamily: 'Frijole, cursive' }}>{payment.totalAmount} TL</span>
                      </div>
                    </div>

                    <div className="payment-card-footer mt-auto border-top border-secondary pt-3">
                      <Button 
                        variant="outline-light" 
                        className="btn-show-receipt w-100 mb-2 py-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleShowReceipt(payment)}
                      >
                         <i className="bi bi-receipt"></i>
                         {t('showReceipt')}
                      </Button>

                      <Button 
                        variant="link" 
                        className="text-decoration-none text-white p-0 w-100 text-start d-flex justify-content-between align-items-center"
                        onClick={() => toggleExpand(payment.id)}
                      >
                        <span className="fs-6">
                           <i className={`bi bi-box-seam me-2 ${expandedId === payment.id ? 'text-danger' : 'text-muted'}`}></i>
                           {expandedId === payment.id ? t('hideItems') : t('showItems')}
                        </span>
                        <i className={`bi bi-chevron-${expandedId === payment.id ? 'up' : 'down'}`}></i>
                      </Button>
                      
                      {expandedId === payment.id && payment.products && (
                        <div className="expanded-products-list mt-3">
                          {payment.products.map((prod, idx) => (
                            <div key={idx} className="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25 small">
                              <span className="text-truncate pe-2 text-white-50">{prod.name}</span>
                              <span className="text-nowrap text-white-50 opacity-75">{prod.quantity}x <span style={{ fontFamily: 'Frijole, cursive', fontSize: '0.8rem' }}>{prod.price} TL</span></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <PaymentDeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />

      <ReceiptModal 
        show={showReceiptModal}
        onHide={() => setShowReceiptModal(false)}
        payment={selectedReceiptPayment}
      />
    </>
  );
}
