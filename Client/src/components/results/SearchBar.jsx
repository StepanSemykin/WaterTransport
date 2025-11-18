import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';
import { Form } from 'react-bootstrap';

export default function SearchBar() {
  return (
    <div className={styles.wrap}>
      <Search className={styles.icon} strokeWidth={1.33} />
      <Form.Control
        type="text"
        placeholder="Поиск лодок..."
        className={styles.input}
      />
    </div>
  );
}
