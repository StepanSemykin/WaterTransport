import React from 'react';
import './Header.css';

const Header = ({ onNavigate }) => {
  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1 onClick={(e) => handleNavClick(e, 'home')} style={{ cursor: 'pointer' }}>
            WaterTransport
          </h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#" onClick={(e) => handleNavClick(e, 'home')}>Главная</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, 'about')}>О нас</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, 'services')}>Услуги</a></li>
            <li><a href="#" onClick={(e) => handleNavClick(e, 'contact')}>Контакты</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;