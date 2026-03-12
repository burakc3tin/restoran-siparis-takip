import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import './MenuItem.css';

export default function MenuItem({ item, onAdd, onShowDetail, isMultiDeleteMode, isSelected }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const handleInfoClick = (e) => {
    e.stopPropagation();
    if (onShowDetail) onShowDetail(item);
  };

  const renderTooltip = (text) => (
    <Tooltip id={`tooltip-${item.id}`}>{text}</Tooltip>
  );

  return (
    <OverlayTrigger 
      delay={{ show: 500, hide: 100 }}
      overlay={renderTooltip(t('tooltipAddToCart'))}
      trigger={isMobile ? [] : 'hover'}
    >
      <Card 
        className={`menu-item-card h-100 border-0 ${isSelected ? 'selected-for-delete' : ''}`} 
        onClick={() => onAdd(item)}
      >
        <div className="menu-item-image-wrapper position-relative">
          {item.image && (item.image.startsWith('http') || item.image.startsWith('blob') || item.image.startsWith('/')) ? (
            <Card.Img variant="top" src={item.image} alt={item.name} className="menu-item-img" />
          ) : (
            <div className="menu-item-emoji-display">{item.image}</div>
          )}
          
          {/* Info Icon for details */}
          <OverlayTrigger placement="right" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipViewDetail'))}>
            <div className="item-info-icon" onClick={handleInfoClick}>
              <i className="bi bi-info-circle-fill"></i>
            </div>
          </OverlayTrigger>

          {/* Check Icon for multi-delete (hidden unless mode is active) */}
          {isMultiDeleteMode && (
            <div className="item-check-overlay">
              <i className={`bi ${isSelected ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
            </div>
          )}
        </div>
        <Card.Footer className="menu-item-footer d-flex justify-content-between align-items-center p-2 p-sm-3 border-0">
          <span className="menu-item-name text-truncate me-2">{item.name}</span>
          <span className="menu-item-price text-nowrap">{item.price} TL</span>
        </Card.Footer>
      </Card>
    </OverlayTrigger>
  );
}
