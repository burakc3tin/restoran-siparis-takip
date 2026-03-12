import { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, ListGroup } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import './PaymentModal.css';

export default function PaymentModal({ show, onHide, order, onConfirmPayment }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirmPayment(order);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="payment-modal" backdrop="static" size="lg">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 text-center">
          <i className="bi bi-wallet2 me-2"></i>
          {t('paymentTitle')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4">
          <Col md={6} className="d-flex flex-column">
            <h5 className="mb-3 text-white border-bottom border-secondary pb-2">
              <i className="bi bi-credit-card-2-front me-2"></i>
              {t('billingDetails')}
            </h5>

            {/* Dummy Credit Card Graphic */}
            <div className="credit-card-graphic mb-4">
              <div className="card-chip"></div>
              <div className="card-logo">💳</div>
              <div className="card-number-display">**** **** **** 4242</div>
              <div className="card-holder-display">
                <span>{t('cardHolder').toUpperCase()}</span>
                <span>BURAK CETIN</span>
              </div>
            </div>

            <Form id="paymentForm" onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
              <Form.Group className="mb-3">
                <Form.Label>{t('cardNumber')}</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    className="custom-input payment-input pe-5"
                    value="**** **** **** 4242"
                    readOnly
                    disabled
                  />
                  <i className="bi bi-credit-card position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('cardHolder')}</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-input payment-input"
                  value="BURAK CETIN"
                  readOnly
                  disabled
                />
              </Form.Group>

              <Row className="mb-4">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>{t('expiryDate')}</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-input payment-input text-center"
                      value="12/28"
                      readOnly
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>{t('cvv')}</Form.Label>
                    <Form.Control
                      type="password"
                      className="custom-input payment-input text-center"
                      value="***"
                      readOnly
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col md={6} className="d-flex flex-column">
            <h5 className="mb-3 text-white border-bottom border-secondary pb-2">
              <i className="bi bi-receipt me-2"></i>
              {t('orderSummary')}
            </h5>

            <div className="payment-summary-container mb-4">
              <div className="payment-summary-scroll">
                {order.map((item, index) => (
                  <div key={index} className="payment-summary-item">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <small className="item-meta">{item.quantity} x {item.price} TL</small>
                    </div>
                    <span className="item-price">{item.price * item.quantity} TL</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-total-box p-3 rounded mb-4 d-flex justify-content-between align-items-center">
              <span className="fs-5">{t('totalAmount')}</span>
              <span className="fs-4 fw-bold text-danger">{total} TL</span>
            </div>

            <Button
              className="btn-confirm-payment w-100 mt-auto py-3 fs-5"
              type="submit"
              form="paymentForm"
              disabled={loading}
            >
              {loading ? (
                <><Spinner animation="border" size="sm" className="me-2" />{t('paymentProcessing')}</>
              ) : (
                <><i className="bi bi-check2-circle me-2"></i>{t('confirmPayment')} - {total} TL</>
              )}
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
