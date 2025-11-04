import { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from '../components/results/Header.jsx';
import SearchBar from '../components/results/SearchBar.jsx';
import FilterTabs from '../components/results/FilterTabs.jsx';
import BoatCard from '../components/results/BoatCard.jsx';
import styles from './Results.module.css';


export const boats = [
  {
    id: '1',
    name: 'Blue Horizon',
    type: 'Luxury Yacht',
    category: 'yacht',
    image: 'src/images/yacht1.jpg',
    rating: 4.8,
    reviews: 124,
    capacity: 10,
    location: 'Сочи, Морской порт',
    pricePerHour: 12000,
    features: ['Wi-Fi', 'Бар', 'Bluetooth', 'Каюты'],
    status: 'available'
  },
  {
    id: '2',
    name: 'Sea Breeze',
    type: 'Fishing Boat',
    category: 'fishing',
    image: '/images/fishing1.jpg',
    rating: 4.3,
    reviews: 67,
    capacity: 6,
    location: 'Геленджик, причал №3',
    pricePerHour: 5000,
    features: ['Эхолот', 'Холодильник', 'Музыка'],
    status: 'booked'
  },
  {
    id: '3',
    name: 'Sunny Wave',
    type: 'Speed Boat',
    category: 'boat',
    image: '/images/boat1.jpg',
    rating: 4.6,
    reviews: 98,
    capacity: 4,
    location: 'Адлер, причал №1',
    pricePerHour: 7000,
    features: ['Солнцезащита', 'Bluetooth', 'Напитки'],
    status: 'available'
  },
  {
    id: '4',
    name: 'Ocean Dream',
    type: 'Sailboat',
    category: 'sailboat',
    image: '/images/sailboat1.jpg',
    rating: 4.9,
    reviews: 152,
    capacity: 8,
    location: 'Ялта, набережная',
    pricePerHour: 9500,
    features: ['Паруса', 'Музыка', 'Wi-Fi', 'Бар'],
    status: 'available'
  }
]


export default function Results() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBoats = useMemo(() => {
    if (selectedCategory === 'all') return boats;
    return boats.filter((boat) => boat.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.controls}>
        <Container>
          <div className={styles.controlsInner}>
            <SearchBar />
            <FilterTabs onFilterChange={setSelectedCategory} />
          </div>
        </Container>
      </div>

      <div className={styles.infoBar}>
        <Container>
          <p className={styles.infoText}>
            {filteredBoats.length}{' '}
            {filteredBoats.length === 1 ? 'лодка доступна' : 'лодок доступно'}
          </p>
        </Container>
      </div>

      <Container fluid className={styles.cardsWrap}>
        <Row xs={1} className="g-4">
            {filteredBoats.map((boat) => (
            <Col key={boat.id}>
                <BoatCard boat={boat} />
            </Col>
            ))}
        </Row>
      </Container>

    </div>
  );
}
