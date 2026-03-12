import { useState } from 'react';
import { Navbar, Nav, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import LanguageModal from '../LanguageModal/LanguageModal';
import './Header.css';

export default function Header({ onShowPastPayments, onShowShareMenu, onShowRewards }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showLangModal, setShowLangModal] = useState(false);

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  return (
    <>
    <Navbar className="header-navbar p-0">
      <Container fluid className="header-container px-3 flex-wrap">
        <div className="header-left d-flex align-items-center mb-2 mb-sm-0 flex-wrap">
          <div className="window-controls d-flex gap-1 me-3 mb-2 mb-sm-0">
            <span className="control control-red"></span>
            <span className="control control-yellow"></span>
            <span className="control control-green"></span>
          </div>
          <h1 className="header-title m-0 text-truncate">Suitable {t('headerTitle')}</h1>
        </div>
        <Nav className="header-right d-flex flex-row gap-2 justify-content-end w-sm-100">
          <OverlayTrigger placement="bottom" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(t('tooltipPastPayments'))}>
            <button 
              className="icon-button position-relative"
              onClick={(e) => {
                e.currentTarget.blur();
                onShowPastPayments();
              }}
            >
              <i className="bi bi-clock-history"></i>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(t('tooltipLanguage'))}>
            <button 
              className="icon-button globe-button" 
              onClick={(e) => {
                e.currentTarget.blur();
                setShowLangModal(true);
              }}
            >
              <i className="bi bi-globe"></i>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(t('tooltipShareMenu'))}>
            <button 
              className="icon-button" 
              onClick={(e) => {
                e.currentTarget.blur();
                onShowShareMenu();
              }}
            >
              <i className="bi bi-send"></i>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" trigger={isMobile ? [] : ['hover', 'focus']} overlay={renderTooltip(t('rewardsTooltip'))}>
            <button 
              className="icon-button rewards-button" 
              onClick={(e) => {
                e.currentTarget.blur();
                onShowRewards();
              }}
            >
              <i className="bi bi-trophy-fill"></i>
            </button>
          </OverlayTrigger>
        </Nav>
      </Container>
    </Navbar>

    <LanguageModal show={showLangModal} onHide={() => setShowLangModal(false)} />
    </>
  );
}
