import './Footer.css';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="footer">
      <p className="footer-text">{t('developedBy')}</p>
    </footer>
  );
}
