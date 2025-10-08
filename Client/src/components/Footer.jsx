import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>WaterTransport</h3>
            <p>Надежные водные перевозки для вашего бизнеса</p>
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <p>Телефон: +7 (800) 123-45-67</p>
            <p>Email: info@watertransport.ru</p>
          </div>
          <div className="footer-section">
            <h4>Услуги</h4>
            <ul>
              <li>Грузовые перевозки</li>
              <li>Пассажирские перевозки</li>
              <li>Аренда судов</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 WaterTransport. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;