import { Card, Button, Badge } from 'react-bootstrap';
import { Star, Users, MapPin } from 'lucide-react';
import styles from './BoatCard.module.css';

export default function BoatCard({ boat }) {
  const isBooked = boat.status === 'booked';

  return (
    <Card className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={boat.image}
          alt={boat.name}
          className={styles.image}
          loading="lazy"
        />

        <Badge
          bg={isBooked ? 'danger' : 'success'}
          className={styles.statusBadge}
        >
          {isBooked ? 'Booked' : 'Available'}
        </Badge>
      </div>

      <Card.Body className={styles.body}>
        <div className={styles.topRow}>
          <div>
            <Card.Title className={styles.title}>{boat.name}</Card.Title>
            <Card.Subtitle className={styles.subTitle}>{boat.type}</Card.Subtitle>
          </div>
          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>{boat.pricePerHour}₽</div>
            <div className={styles.priceUnit}>/час</div>
          </div>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.rating}>
            <Star size={16} className={styles.iconStar} strokeWidth={1.33} />
            <span className={styles.mutedSmall}>{boat.rating}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.mutedSmall}>{boat.reviews} отзывов</span>
          </div>
          <div className={styles.capacity}>
            <Users size={16} className={styles.iconSecondary} strokeWidth={1.33} />
            <span className={styles.mutedSmall}>До {boat.capacity} человек</span>
          </div>
        </div>

        <div className={styles.locationRow}>
          <MapPin size={16} className={styles.iconSecondary} strokeWidth={1.33} />
          <span className={styles.mutedSmall}>{boat.location}</span>
        </div>

        <div className={styles.features}>
          {boat.features.map((f, i) => (
            <Badge key={i} bg="light" text="dark" className={styles.featureChip}>
              {f}
            </Badge>
          ))}
        </div>

        <Button
          type="button"
          variant="primary"
          disabled={isBooked}
          className={`${styles.cta} ${isBooked ? styles.ctaDisabled : ''}`}
          aria-disabled={isBooked}
        >
          {isBooked ? 'Currently Unavailable' : 'View Details'}
        </Button>
      </Card.Body>
    </Card>
  );
}
