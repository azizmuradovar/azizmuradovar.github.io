import type { Coffee } from "../../types";
import { getCountryFlag } from "../../utils/countryFlags";
import styles from "./CoffeeCard.module.css";

interface Props {
  coffee: Coffee;
  averageRating: number | null;
  onClick: (id: number) => void;
}

export function CoffeeCard({ coffee, averageRating, onClick }: Props) {
  return (
    <div className={styles.card} onClick={() => onClick(coffee.id)}>
      {averageRating !== null && (
        <div className={styles.ratingCircle}>{averageRating}</div>
      )}
      <div className={styles.flag}>{getCountryFlag(coffee.country)}</div>
      <h3>{coffee.name}</h3>
      <p>{coffee.description}</p>
    </div>
  );
}
