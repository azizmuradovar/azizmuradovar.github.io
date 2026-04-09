import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onLucky: () => void;
  onAddReview: () => void;
}

export function SearchBar({ value, onChange, onLucky, onAddReview }: Props) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Поиск кофе..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      <button className={styles.luckyBtn} onClick={onLucky}>
        🎰 Мне повезёт
      </button>
      <button className={styles.addBtn} onClick={onAddReview}>
        + отзыв
      </button>
    </div>
  );
}
