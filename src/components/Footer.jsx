// src/components/Footer.jsx
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Contact Info on the Left */}
        <div className="footer-contacts">
          <div className="footer-item">
            <img src="/office-icon.png" alt="Office Icon" />
            <span>ODTÜ TEKNOKENT MET YERLEŞKESİ, ODTÜ MEMS Tesisleri, Mustafa Kemal, Eskişehir Yolu, 06520 Çankaya/Ankara</span>
          </div>

          <div className="footer-item">
            <img src="/phone-icon.png" alt="Phone Icon" />
            <span>+90 (539) 822-9890</span>
          </div>

          <div className="footer-item">
            <img src="/email-icon.png" alt="Email Icon" />
            <a href="mailto:hello@damageai.com">hello@damageai.com</a>
          </div>
        </div>

        {/* Company Logo and Copyright */}
        <div className="footer-logo">
          <img src="/company-logo.png" alt="Company Logo" />
          <p className="footer-copyright">© 2025 DamageAI All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
