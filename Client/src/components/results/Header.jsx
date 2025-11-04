import { ArrowLeft, ArrowDownUp } from 'lucide-react';
import styles from './Header.module.css';
import { Button } from 'react-bootstrap';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Button variant="link" className={styles.iconBtn} aria-label="Назад">
          <ArrowLeft size={18} className={styles.icon} strokeWidth={1.33} />
        </Button>

        <h1 className={styles.title}>Доступные лодки</h1>

        <Button variant="link" className={styles.iconBtn} aria-label="Сортировка">
          <ArrowDownUp size={18} className={styles.icon} strokeWidth={1.33} />
        </Button>
      </div>
    </header>
  );
}
