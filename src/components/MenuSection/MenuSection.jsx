import { Button, Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MenuItem from '../MenuItem/MenuItem';
import './MenuSection.css';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import wrongSound from '../../assets/sound/wrong.mp3';

export default function MenuSection({ items, urunGruplari, onAdd, onShowDetail, onAddProduct, actionMode, setActionMode, selectedProducts, onDeleteMulti }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showWarning, setShowWarning] = useState(false);
  const [shakingBtn, setShakingBtn] = useState(null);

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

  const handleModeToggle = (mode) => {
    if (items.length === 0) {
      triggerWarning(mode);
      return;
    }
    setActionMode(prevMode => {
      if (mode === 'delete') {
        if (prevMode === 'delete') return 'delete-multi';
        if (prevMode === 'delete-multi') return 'order';
        return 'delete';
      }
      return prevMode === mode ? 'order' : mode;
    });
  };

  return (
    <section className="menu-section">
      <div className="menu-header d-flex flex-wrap align-items-center mb-4">
        <h2 className="section-title m-0 me-3">{t('menuTitle')}</h2>
        <div className="title-line flex-grow-1"></div>
        {actionMode !== 'order' && (
          <div className="w-100 mt-2">
            <span className={`mode-instruction-text ${actionMode === 'edit' ? 'text-blue' : 'text-red'}`}>
              ℹ️ {
                actionMode === 'edit' ? t('instructionSelect') :
                  actionMode === 'delete-multi' ? t('instructionMulti') :
                    t('instructionSelect')
              }
            </span>
          </div>
        )}
      </div>

      <div className="menu-grid flex-grow-1 overflow-auto pb-3 d-flex flex-column">
        {items.length === 0 ? (
          <div className="menu-empty-message">
            <i className="bi bi-grid-3x3-gap mb-3"></i>
            <p>{t('emptyMenu').split('.')[0]}.</p>
            <small>{t('emptyMenu').split('.')[1]}</small>
          </div>
        ) : (
          <>
            {/* 1. Groupless Items (Items with no urungrubu or empty urungrubu) */}
            {items.filter(item => !item.urungrubu).length > 0 && (
              <Row xs={1} sm={2} md={3} lg={4} className="g-3 m-0 mb-4">
                {items.filter(item => !item.urungrubu).map(item => (
                  <Col key={item.id} className="p-2">
                    <MenuItem
                      item={item}
                      onAdd={onAdd}
                      onShowDetail={onShowDetail}
                      isMultiDeleteMode={actionMode === 'delete-multi'}
                      isSelected={selectedProducts?.includes(item.id)}
                    />
                  </Col>
                ))}
              </Row>
            )}

            {/* 2. Grouped Items (Mapped according to urunGruplari) */}
            {urunGruplari && urunGruplari.map(group => {
              const groupItems = items.filter(item => item.urungrubu === group.name);
              
              if (groupItems.length === 0) return null; // Don't render empty groups

              return (
                <div key={group.id} className="menu-group-section mb-4">
                  <div className="group-header d-flex align-items-center">
                    <h3 className="group-title m-0">{group.name}</h3>
                    <div className="group-line ms-3 flex-grow-1"></div>
                  </div>
                  <Row xs={1} sm={2} md={3} lg={4} className="g-3 m-0">
                    {groupItems.map(item => (
                      <Col key={item.id} className="p-2">
                        <MenuItem
                          item={item}
                          onAdd={onAdd}
                          onShowDetail={onShowDetail}
                          isMultiDeleteMode={actionMode === 'delete-multi'}
                          isSelected={selectedProducts?.includes(item.id)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="menu-actions d-flex flex-column flex-sm-row gap-2 mt-3 pt-3">
        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipAddProduct'))}>
          <Button 
            className="btn-outline btn-with-icon flex-grow-1 border-0 btn-add-action" 
            onClick={onAddProduct}
            data-testid="action-add"
          >
            <i className="bi bi-plus-circle-fill me-2"></i> {t('addProduct')}
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" trigger={isMobile ? [] : 'hover'} overlay={renderTooltip(t('tooltipEditMode'))}>
          <Button
            className={`btn-outline border-0 flex-grow-1 btn-edit-action ${actionMode === 'edit' ? 'active-mode' : ''} ${shakingBtn === 'edit' ? 'shake-btn' : ''}`}
            onClick={() => handleModeToggle('edit')}
            data-testid="action-edit"
          >
            <i className="bi bi-pencil-square me-2"></i> {t('edit')}
          </Button>
        </OverlayTrigger>

        <OverlayTrigger 
          placement="top" 
          trigger={isMobile ? [] : 'hover'}
          overlay={renderTooltip(
            actionMode === 'delete' ? t('tooltipSingleDeleteActive') : 
            actionMode === 'delete-multi' ? (selectedProducts.length > 0 ? t('tooltipDeleteSelected') : t('tooltipMultiDeleteActive')) : 
            t('tooltipDeleteMode')
          )}
        >
          <Button
            className={`btn-outline border-0 flex-grow-1 btn-delete-action ${(actionMode === 'delete' || actionMode === 'delete-multi') ? 'active-mode' : ''} ${actionMode === 'delete-multi' && selectedProducts.length > 0 ? 'btn-danger-action' : ''} ${shakingBtn === 'delete' ? 'shake-btn' : ''}`}
            data-testid="action-delete"
            onClick={() => {
              if (items.length === 0) {
                triggerWarning('delete');
                return;
              }
              if (actionMode === 'delete-multi' && selectedProducts.length > 0) {
                onDeleteMulti();
              } else {
                handleModeToggle('delete');
              }
            }}
          >
            <i className={`bi ${actionMode === 'delete-multi' && selectedProducts.length > 0 ? 'bi-trash-fill' : 'bi-trash3'} me-2`}></i>
            {
              actionMode === 'delete-multi' && selectedProducts.length > 0 
                ? `${t('selectedItems')} (${selectedProducts.length})` 
                : actionMode === 'delete' 
                  ? t('singleDelete') 
                  : actionMode === 'delete-multi' 
                    ? t('multiDelete') 
                    : t('delete')
            }
          </Button>
        </OverlayTrigger>
      </div>

      <Modal show={showWarning} onHide={() => setShowWarning(false)} centered className="warning-notice-modal">
        <Modal.Body className="text-center p-4">
          <div className="warning-icon-wrapper mb-3">
            <i className="bi bi-exclamation-triangle-fill text-danger"></i>
          </div>
          <h4 className="notice-title">{t('warningNoProducts')}</h4>
          <p className="notice-text mb-4">{t('warningNoProductsText')}</p>
          <Button className="btn-ok w-100" onClick={() => setShowWarning(false)}>{t('ok')}</Button>
        </Modal.Body>
      </Modal>
    </section>
  );
}
