import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { getOdemeler } from '../../services/firebase';
import { useState, useEffect } from 'react';
import './RewardsModal.css';

export default function RewardsModal({ show, onHide }) {
  const { t } = useLanguage();
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const thresholds = [
    { id: 'bronze', amount: 1000, label: t('bronzeReward'), icon: 'bi-award', color: '#cd7f32' },
    { id: 'silver', amount: 3000, label: t('silverReward'), icon: 'bi-award-fill', color: '#c0c0c0' },
    { id: 'gold', amount: 5000, label: t('goldReward'), icon: 'bi-trophy', color: '#ffd700' },
    { id: 'platinum', amount: 10000, label: t('platinumReward'), icon: 'bi-trophy-fill', color: '#e5e4e2' },
    { id: 'diamond', amount: 100000, label: t('diamondReward'), icon: 'bi-gem', color: '#b9f2ff' }
  ];

  useEffect(() => {
    if (show) {
      calculateTotal();
    }
  }, [show]);

  const calculateTotal = async () => {
    setLoading(true);
    try {
      const odemeler = await getOdemeler();
      const total = odemeler.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
      setTotalSpent(total);
    } catch (error) {
      console.error("Error fetching payments for rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (totalSpent < thresholds[0].amount) return 0;
    
    let lastIndex = -1;
    for (let i = 0; i < thresholds.length; i++) {
      if (totalSpent >= thresholds[i].amount) lastIndex = i;
    }
    
    if (lastIndex === thresholds.length - 1) return 100;
    
    // Position of current milestone (0 to 100)
    const baseOffset = (lastIndex / (thresholds.length - 1)) * 100;
    
    // Fractional part to the next milestone
    const currentAmount = totalSpent;
    const currentThreshold = thresholds[lastIndex].amount;
    const nextThreshold = thresholds[lastIndex + 1].amount;
    const fraction = (currentAmount - currentThreshold) / (nextThreshold - currentThreshold);
    
    const segmentWidth = 100 / (thresholds.length - 1);
    return baseOffset + (fraction * segmentWidth);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="rewards-modal">
      <Modal.Header closeButton closeVariant="white" className="border-0">
        <Modal.Title className="rewards-modal-title w-100 text-center">
          <i className="bi bi-stars me-2 text-warning"></i>
          {t('rewardsTitle')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="total-spent-banner mb-5">
          <span className="spent-label">{t('totalSpent')}</span>
          <div className="spent-amount-wrapper">
            <span className="spent-amount">{totalSpent.toLocaleString()}</span>
            <span className="currency">TL</span>
          </div>
        </div>

        <div className="journey-container">
          <h5 className="journey-title mb-4">
            <i className="bi bi-map me-2"></i>
            {t('journey')}
          </h5>
          
          <div className="journey-path">
            <div className="path-line">
              <div 
                className="path-fill" 
                style={{ height: `${calculateProgress()}%` }}
              ></div>
            </div>

            {thresholds.map((reward, index) => {
              const isReached = totalSpent >= reward.amount;
              return (
                <div 
                  key={reward.id} 
                  className={`journey-step ${isReached ? 'reached' : 'locked'}`}
                >
                  <div className="step-marker" style={{ borderColor: reward.color }}>
                    <i className={`bi ${reward.icon}`} style={{ color: isReached ? reward.color : '#444' }}></i>
                    {isReached && <div className="marker-glow" style={{ background: reward.color }}></div>}
                  </div>
                  
                  <div className="step-content">
                    <div className="step-header">
                      <span className="step-label" style={{ color: isReached ? '#fff' : '#666' }}>{reward.label}</span>
                      <span className={`status-badge ${isReached ? 'status-reached' : 'status-locked'}`}>
                        {isReached ? t('rewardReached') : t('rewardLocked')}
                      </span>
                    </div>
                    
                    <div className="step-details">
                      <span className="goal-text">{t('rewardGoal')}: {reward.amount.toLocaleString()} TL</span>
                      {!isReached && (
                        <div className="unlock-info">
                          <small>{t('rewardUnlockInfo')}</small>
                          <span className="remaining-amount">{(reward.amount - totalSpent).toLocaleString()} TL</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button className="btn-close-rewards" onClick={onHide}>
          {t('ok')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
