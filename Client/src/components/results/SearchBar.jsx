import { Search } from 'lucide-react';
import { Form } from 'react-bootstrap';

import styles from './SearchBar.module.css';

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
