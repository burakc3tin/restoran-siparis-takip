import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { uploadImage } from '../../services/cloudinary';
import { useLanguage } from '../../context/LanguageContext';
import { useProductActions } from '../../hooks/useProductActions';
import { useIsMobile } from '../../hooks/useIsMobile';
import { generateProductDescription } from '../../services/aiService';
import successSound from '../../assets/sound/success.mp3';
import wrongSound from '../../assets/sound/wrong.mp3';
import './AddProductModal.css';

export default function AddProductModal({ show, onHide, onProductAdded, onProductUpdated, editItem, urunGruplari, onShowGroupModal }) {
  const { t, lang } = useLanguage();
  const isMobile = useIsMobile();
  const { addProduct, updateProduct, loading: productLoading } = useProductActions();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0.00');
  const [description, setDescription] = useState('');
  const [urungrubu, setUrungrubu] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  const foodEmojis = [
    { id: '1', char: '🍔' }, { id: '2', char: '🍕' }, { id: '3', char: '🍣' },
    { id: '4', char: '🥗' }, { id: '5', char: '🍦' }, { id: '6', char: '🍰' },
    { id: '7', char: '🥩' }, { id: '8', char: '🍜' }, { id: '9', char: '🥪' },
    { id: '10', char: '🌮' }
  ];

  const isEmoji = (str) => {
    if (!str) return false;
    return foodEmojis.some(e => e.char === str);
  };

  useEffect(() => {
    if (editItem && show) {
      setName(editItem.name);
      setPrice(editItem.price.toString());
      setDescription(editItem.description || '');
      setUrungrubu(editItem.urungrubu || '');
      if (isEmoji(editItem.image)) {
        setSelectedEmoji(editItem.image);
        setPreview(null);
      } else {
        setPreview(editItem.image);
        setSelectedEmoji(null);
      }
      setFile(null);
    } else if (!show) {
      resetForm();
    }
  }, [editItem, show]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setSelectedEmoji(null); // Clear emoji if file is chosen
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setPreview(null);
    setFile(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const resetForm = () => {
    setName('');
    setPrice('0.00');
    setDescription('');
    setUrungrubu('');
    setFile(null);
    setPreview(null);
    setSelectedEmoji(null);
    setWasSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleAIGenerate = async () => {
    if (!name.trim()) {
      setValidationError(t('aiNameRequired'));
      
      const audio = new Audio(wrongSound);
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    setAiLoading(true);
    try {
      const generatedDesc = await generateProductDescription(name, lang);
      setDescription(generatedDesc);
    } catch (error) {
      setValidationError(t('aiError'));
      
      const audio = new Audio(wrongSound);
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true);
    
    if (!name.trim()) {
      setValidationError(t('validationMissingName'));
      
      const audio = new Audio(wrongSound);
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setValidationError(t('validationInvalidPrice'));
      
      const audio = new Audio(wrongSound);
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (!file && !selectedEmoji && !editItem) {
      setValidationError(t('validationMissingMedia'));
      
      const audio = new Audio(wrongSound);
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      let imageUrl = editItem ? editItem.image : '';
      
      if (file) {
        imageUrl = await uploadImage(file);
      } else if (selectedEmoji) {
        imageUrl = selectedEmoji;
      }

      const productData = {
        name,
        price: parseFloat(price),
        description,
        urungrubu: urungrubu || null,
        image: imageUrl
      };
      
      if (editItem) {
        const updated = await updateProduct(editItem.id, productData);
        if (onProductUpdated) onProductUpdated(updated);
      } else {
        const added = await addProduct(productData);
        if (onProductAdded) onProductAdded(added);
      }
      
      const audio = new Audio(successSound);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Ses çalınamadı:", e));
      
      handleClose();
    } catch (error) {
      console.error("Hata:", error);
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered className={`add-product-modal ${isShaking ? 'shake-modal' : ''}`} backdrop="static" size="lg">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 text-center">
          {editItem ? t('edit') : t('addProduct')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="g-4">
            <Col md={5} className="d-flex flex-column">
              <div className="photo-upload-area mb-3" onClick={handleUploadClick}>
                {preview ? (
                  <img src={preview} alt={t('preview')} className="preview-image" />
                ) : selectedEmoji ? (
                  <div className="preview-emoji-main">{selectedEmoji}</div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="camera-icon">📷</span>
                    <p className="m-0 mt-2">{t('addPhoto')}</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="d-none" 
                />
              </div>

              <div className="emoji-selector-container mb-4">
                <p className="text-center mb-2 small opacity-75">{t('orSelectEmoji')}</p>
                <div className="emoji-grid">
                  {foodEmojis.map((emoji) => (
                    <div 
                      key={emoji.id} 
                      className={`emoji-option ${selectedEmoji === emoji.char ? 'selected' : ''}`}
                      onClick={() => handleEmojiSelect(emoji.char)}
                    >
                      {emoji.char}
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col md={7} className="d-flex flex-column">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="productName">{t('productName')}</Form.Label>
                <Form.Control 
                  id="productName"
                  type="text" 
                  className={`custom-input ${name.length >= 3 ? 'valid-border' : (wasSubmitted && !name.trim() ? 'invalid-border' : '')}`} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={productLoading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="productGroup">{t('productGroup')} {t('optional')}</Form.Label>
                <Form.Select
                  id="productGroup"
                  className="custom-input mb-1 bg-dark text-white border-secondary"
                  value={urungrubu}
                  onChange={(e) => setUrungrubu(e.target.value)}
                  disabled={productLoading}
                >
                  <option value="">{t('selectGroup')}</option>
                  {urunGruplari && urunGruplari.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </Form.Select>
                <OverlayTrigger placement="right" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipNewGroup'))}>
                  <Button 
                    variant="link" 
                    className="p-0 text-decoration-none text-danger add-group-btn" 
                    onClick={onShowGroupModal}
                    disabled={productLoading}
                  >
                    <small>{t('addNewGroup')}</small>
                  </Button>
                </OverlayTrigger>
              </Form.Group>

              <Form.Group className="mb-3">
                <Row className="align-items-center">
                  <Col>
                    <Form.Label htmlFor="productPrice" className="m-0">{t('productPrice')}</Form.Label>
                  </Col>
                  <Col xs="auto">
                    <Form.Control 
                      id="productPrice"
                      type="number" 
                      step="0.01" 
                      className={`custom-input price-input text-end ${parseFloat(price) > 0 ? 'valid-border' : (wasSubmitted && (parseFloat(price) <= 0 || !price) ? 'invalid-border' : '')}`} 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={productLoading}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-4 flex-grow-1 d-flex flex-column position-relative">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="m-0">{t('productDesc')} {t('optional')}</Form.Label>
                  <OverlayTrigger placement="left" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('aiGenerate'))}>
                    <Button 
                      variant="link" 
                      className="ai-generate-btn p-0 text-decoration-none d-flex align-items-center gap-1"
                      onClick={handleAIGenerate}
                      disabled={productLoading || aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <Spinner animation="grow" size="sm" className="ai-spinner text-primary" />
                          <span className="ai-text-gradient">{t('aiGenerating')}</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-magic ai-icon"></i>
                          <span className="ai-text-gradient">{t('aiGenerate')}</span>
                        </>
                      )}
                    </Button>
                  </OverlayTrigger>
                </div>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  className={`custom-input textarea-input flex-grow-1 ${description.length > 0 ? 'valid-border' : ''} ${aiLoading ? 'ai-generating-glow' : ''}`} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={productLoading || aiLoading}
                  style={{ minHeight: '120px' }}
                />
              </Form.Group>

              <div className="modal-actions d-flex gap-3 mt-auto">
                <OverlayTrigger placement="top" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(t('cancel'))}>
                  <Button className="btn-cancel w-100" onClick={handleClose} disabled={productLoading}>{t('cancel')}</Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(editItem ? t('save') : t('add'))}>
                  <Button className="btn-add w-100" type="submit" disabled={productLoading}>
                    {productLoading ? <Spinner animation="border" size="sm" /> : (editItem ? t('save') : t('add'))}
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal show={!!validationError} onHide={() => setValidationError(null)} centered className="warning-notice-modal">
        <Modal.Body className="text-center p-4">
          <div className="warning-icon-wrapper mb-3">
            <i className="bi bi-exclamation-circle-fill text-danger"></i>
          </div>
          <h4 className="notice-title">{t('missingInfo')}</h4>
          <p className="notice-text mb-4">{validationError}</p>
          <Button className="btn-ok w-100" onClick={() => setValidationError(null)}>{t('ok')}</Button>
        </Modal.Body>
      </Modal>
    </Modal>
  );
}
