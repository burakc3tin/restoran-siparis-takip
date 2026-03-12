import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { languages } from '../../services/languageService';
import './LanguageModal.css';

export default function LanguageModal({ show, onHide }) {
  const { lang: currentLang, setLang, t } = useLanguage();

  const handleSelect = (code) => {
    setLang(code);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="language-modal" backdrop="static" size="lg">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 text-center">{t('selectLanguage')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row className="g-4">
          <Col md={12}>
            <div className="language-grid">
              {languages.map((lang) => (
                <div 
                  key={lang.code} 
                  className={`language-option ${currentLang === lang.code ? 'selected' : ''}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                  {currentLang === lang.code && <i className="bi bi-check2-circle selected-check"></i>}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
