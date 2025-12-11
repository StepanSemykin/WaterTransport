import { useState } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import styles from './FilterTabs.module.css';

export default function FilterTabs({ onFilterChange }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { label: 'Все лодки', value: 'all' },
    { label: 'Яхты', value: 'yacht' },
    { label: 'Катера', value: 'boat' },
    { label: 'Парусники', value: 'sailboat' },
    { label: 'Рыбалка', value: 'fishing' },
  ];

  const handleTabClick = (category) => {
    setActiveTab(category);
    if (typeof onFilterChange === 'function') onFilterChange(category);
  };

  return (
    <div className="d-flex overflow-auto pb-2">
      <ButtonGroup>
        {tabs.map((tab) => (
          <ToggleButton
            key={tab.value}
            id={`tab-${tab.value}`}
            type="radio"
            name="boat-categories"
            value={tab.value}
            checked={activeTab === tab.value}
            onChange={() => handleTabClick(tab.value)}
            className={`${styles.tabButton} ${activeTab === tab.value ? styles.active : ''}`}
          >
            {tab.label}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}
