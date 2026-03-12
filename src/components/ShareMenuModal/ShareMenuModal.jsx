import { useState, useEffect } from 'react';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import wrongSound from '../../assets/sound/wrong.mp3';
import './ShareMenuModal.css';

export default function ShareMenuModal({ show, onHide, menuItems, urunGruplari }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (show) {
      setCopied(false);
      if (menuItems.length === 0) {
        const audio = new Audio(wrongSound);
        audio.volume = 0.4;
        audio.play().catch(e => console.error("Ses çalınamadı:", e));
      }
    }
  }, [show, menuItems.length]);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  const generateShareText = () => {
    let text = `${t('menuShareHeader')}\n\n`;
    
    // Grouping items
    const ungrouped = menuItems.filter(item => !item.urungrubu);
    const grouped = urunGruplari ? urunGruplari.map(group => ({
      name: group.name,
      items: menuItems.filter(item => item.urungrubu === group.name)
    })).filter(g => g.items.length > 0) : [];

    // If urunGruplari is missing but items have groups, group them dynamically
    if (grouped.length === 0 && menuItems.some(i => i.urungrubu)) {
      const gMap = {};
      menuItems.filter(i => i.urungrubu).forEach(i => {
        if (!gMap[i.urungrubu]) gMap[i.urungrubu] = [];
        gMap[i.urungrubu].push(i);
      });
      Object.keys(gMap).forEach(name => {
        grouped.push({ name, items: gMap[name] });
      });
    }

    // Add ungrouped items
    if (ungrouped.length > 0) {
      ungrouped.forEach((item) => {
        text += `🍽️ ${item.name} - ${item.price} TL\n`;
      });
      text += '\n';
    }

    // Add grouped items
    grouped.forEach(group => {
      text += `--- ${group.name.toUpperCase()} ---\n`;
      group.items.forEach(item => {
        text += `🍽️ ${item.name} - ${item.price} TL\n`;
      });
      text += '\n';
    });

    return text.trim();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
  };

  return (
    <Modal show={show} onHide={onHide} centered className="share-menu-modal" backdrop="static">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="w-100 d-flex align-items-center gap-2">
          <i className="bi bi-share-fill text-danger"></i>
          {menuItems.length === 0 ? t('emptyMenuShareWarningTitle') : t('shareMenu')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {menuItems.length === 0 ? (
          <div className="empty-state-warning text-center py-4">
            <div className="warning-icon-wrapper mb-3">
              <i className="bi bi-exclamation-triangle-fill text-warning"></i>
            </div>
            <h5 className="text-white mb-3">{t('emptyMenuShareWarningTitle')}</h5>
            <p className="text-white-50">{t('emptyMenuShareWarningContent')}</p>
          </div>
        ) : (
          <div className="share-content d-flex flex-column gap-3">
            <div className="share-preview-box p-3 rounded">
              <pre className="share-preview-text m-0">{generateShareText()}</pre>
            </div>

            <div className="share-actions d-grid gap-2 mt-3">
              <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('copyToClipboard'))}>
                <Button 
                  variant="outline-light" 
                  className={`btn-share-action ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                >
                  <i className={`bi ${copied ? 'bi-clipboard-check-fill' : 'bi-clipboard'} me-2`}></i>
                  {copied ? t('copiedToClipboard') : t('copyToClipboard')}
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('shareOnWhatsapp'))}>
                <Button 
                  variant="success" 
                  className="btn-share-action btn-whatsapp"
                  onClick={handleWhatsAppShare}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  {t('shareOnWhatsapp')}
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('shareOnTelegram'))}>
                <Button 
                  variant="info" 
                  className="btn-share-action btn-telegram"
                  onClick={handleTelegramShare}
                >
                  <i className="bi bi-telegram me-2"></i>
                  {t('shareOnTelegram')}
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
