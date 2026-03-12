import { useState } from 'react';
import { Button, ListGroup, Modal, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import wrongSound from '../../assets/sound/wrong.mp3';
import './OrderSection.css';

export default function OrderSection({ order, selectedOrders, toggleOrderSelection, onCancel, onClear, onCheckout, isProcessing }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showWarning, setShowWarning] = useState(false);
  const [shakingBtn, setShakingBtn] = useState(null);

  const total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  const triggerWarning = (btnType) => {
    setShakingBtn(btnType);
    setShowWarning(true);
    
    const audio = new Audio(wrongSound);
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Ses çalınamadı:", e));

    setTimeout(() => setShakingBtn(null), 500);
  };

  const handleActionClick = (action, btnType) => {
    if (order.length === 0) {
      triggerWarning(btnType);
      return;
    }
    action();
  };

  return (
    <aside className="order-section">
      <div className="order-header d-flex align-items-center mb-4">
        <h2 className="section-title m-0 me-3">{t('orderTitle')}</h2>
        <div className="title-line flex-grow-1"></div>
      </div>

      <ListGroup className="order-list mb-4 overflow-auto border-0 d-flex flex-column">
        {order.length === 0 ? (
          <div className="order-empty-message">
            <i className="bi bi-basket2 mb-2"></i>
            <p>{t('emptyOrder')}</p>
          </div>
        ) : (
          order.map((item, index) => {
            const isSelected = selectedOrders?.includes(item.orderItemId);
            return (
              <ListGroup.Item 
                key={index} 
                className={`order-row px-0 border-0 bg-transparent ${isSelected ? 'order-selected' : ''}`}
                onClick={() => toggleOrderSelection && toggleOrderSelection(item.orderItemId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="order-item-left d-flex align-items-center gap-2 overflow-hidden w-75">
                  {isSelected ? (
                    <i className="bi bi-check-circle-fill text-danger flex-shrink-0" style={{fontSize: '14px'}}></i>
                  ) : (
                    <span className="red-dot flex-shrink-0"></span>
                  )}
                  <span className="order-item-name text-truncate">{item.name}</span>
                  <span className="order-item-qty text-nowrap flex-shrink-0">× {item.quantity}</span>
                </div>
                <span className="order-item-price text-nowrap ms-2">{item.price * item.quantity} TL</span>
              </ListGroup.Item>
            );
          })
        )}
      </ListGroup>

      <div className="order-actions-top d-flex gap-3 mb-5">
        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipCancelOrder'))}>
          <Button 
            className={`btn-outline flex-grow-1 border-0 ${shakingBtn === 'cancel' ? 'shake-btn' : ''}`} 
            onClick={() => handleActionClick(onCancel, 'cancel')}
          >
            <i className={`bi ${selectedOrders?.length > 0 ? 'bi-x-circle' : 'bi-arrow-left-short'} me-2`}></i>
            {selectedOrders?.length > 0 ? `${t('cancelSelected')} (${selectedOrders.length})` : t('cancel')}
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipClearOrder'))}>
          <Button 
            className={`btn-outline flex-grow-1 border-0 ${shakingBtn === 'clear' ? 'shake-btn' : ''}`} 
            onClick={() => handleActionClick(onClear, 'clear')}
          >
            <i className="bi bi-trash me-2"></i> {t('clear')}
          </Button>
        </OverlayTrigger>
      </div>

      <div className="order-total-area d-flex flex-column align-items-center gap-4">
        <div className="total-text">
          {t('totalAmount')} <span className="total-amount ps-2">{total} TL</span>
        </div>
        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipCheckout'))}>
          <Button 
            className={`btn-pay w-100 border-0 ${shakingBtn === 'pay' ? 'shake-btn' : ''}`} 
            onClick={() => handleActionClick(onCheckout, 'pay')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <><i className="bi bi-credit-card me-2"></i> {t('pay')}</>
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <Modal show={showWarning} onHide={() => setShowWarning(false)} centered className="warning-notice-modal">
        <Modal.Body className="text-center p-4">
          <div className="warning-icon-wrapper mb-3">
            <i className="bi bi-cart-x-fill text-danger"></i>
          </div>
          <h4 className="notice-title">{t('warningOrderEmpty')}</h4>
          <p className="notice-text mb-4">{t('warningOrderEmptyText')}</p>
          <Button className="btn-ok w-100" onClick={() => setShowWarning(false)}>{t('ok')}</Button>
        </Modal.Body>
      </Modal>
    </aside>
  );
}
