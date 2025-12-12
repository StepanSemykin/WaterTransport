import { Spinner } from "react-bootstrap";

import styles from "./ShipReviews.module.css";

export default function ShipReviews({ shipReviews = [], shipReviewsLoading = false }) {
  
  return (
    <div className={styles["reviews-section"]}>
      <p>Отзывы ({shipReviews.length})</p>

      {shipReviewsLoading ? (
        <Spinner animation="border" size="sm" />
      ) : shipReviews.length > 0 ? (
        <div className={styles["reviews-list"]}>
          {shipReviews.map((review, idx) => (
            <div key={review.id ?? idx} className={styles["review-item"]}>
              <div className={styles["review-header"]}>
                <span className={styles["review-author"]}>
                  {review.authorName || "Аноним"}
                </span>
                <span className={styles["review-rating"]}>
                  {review.rating != null && `${review.rating} / 5`}
                </span>
              </div>
              <p className={styles["review-text"]}>
                {review.comment || review.text || ""}
              </p>
              <span className={styles["review-date"]}>
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString("ru-RU") : ""}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles["no-reviews"]}>Отзывов пока нет</p>
      )}
    </div>
  );
}