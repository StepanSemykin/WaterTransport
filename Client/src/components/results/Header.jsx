import { useNavigate } from 'react-router-dom';

import { ArrowLeft, User as UserIcon, Home, ArrowDownUp } from 'lucide-react';
import { Button } from 'react-bootstrap';

import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles["header"]}>
      <div className={styles["inner"]}>
        <Button 
          variant="light" 
          onClick={() => navigate("/")}
          className={styles["home-icon-button"]} 
          aria-label="Домашняя страница"
        >
          <ArrowLeft className={styles["home-icon"]}/>
        </Button>

        <h1 className={styles["title"]}>Результаты откликов</h1>

        <Button 
          variant="light" 
          onClick={() => navigate("/user")}
          className={styles["user-icon-button"]}
          aria-label="Профиль"
        >
          <UserIcon className={styles["user-icon"]} />
        </Button>
      </div>
    </header>
  );
}
