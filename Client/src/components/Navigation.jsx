import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (e, page) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
        >
          ☰
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'home')}
              className={currentPage === 'home' ? 'active' : ''}
            >
              Главная
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'about')}
              className={currentPage === 'about' ? 'active' : ''}
            >
              О компании
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'services')}
              className={currentPage === 'services' ? 'active' : ''}
            >
              Услуги
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'fleet')}
              className={currentPage === 'fleet' ? 'active' : ''}
            >
              Флот
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, 'contact')}
              className={currentPage === 'contact' ? 'active' : ''}
            >
              Контакты
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;