import type { Coffee, Review } from "../../../types";
import styles from "./ReviewsModal.module.css";

interface Props {
  coffee: Coffee;
  reviews: Review[];
  onDelete: (reviewId: string, coffeeId: number) => void;
  onClose: () => void;
}

export function ReviewsModal({ coffee, reviews, onDelete, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2>{coffee.name} - {coffee.description}</h2>
        <div className={styles.list}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.card}>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(review.id, coffee.id);
                  }}
                  title="Удалить отзыв"
                >
                  ×
                </button>
                <div className={styles.rating}>
                  <span className={styles.ratingValue}>{review.rating}</span>
                  <span className={styles.ratingMax}>/10</span>
                </div>
                <div className={styles.comment}>{review.comment}</div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>Отзывов пока нет</div>
          )}
        </div>
      </div>
    </div>
  );
}
