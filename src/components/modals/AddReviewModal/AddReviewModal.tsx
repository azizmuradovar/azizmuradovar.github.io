import { useState, useRef, useEffect } from "react";
import { coffeeList } from "../../../data/coffeeData";
import styles from "./AddReviewModal.module.css";

interface Props {
  onSubmit: (coffeeId: number, rating: number, comment: string) => void;
  onClose: () => void;
}

export function AddReviewModal({ onSubmit, onClose }: Props) {
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<number | "">("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedCoffee = coffeeList.find((c) => c.id === selectedCoffeeId);
  const filtered = coffeeList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleSubmit = () => {
    if (!selectedCoffeeId || !comment.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    onSubmit(selectedCoffeeId as number, rating, comment);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2>Оставить отзыв</h2>

        <div className={styles.formGroup}>
          <label>Выберите кофе *</label>
          <div className={styles.selectWrapper} ref={selectRef}>
            <input
              type="text"
              placeholder="Поиск кофе..."
              value={
                selectedCoffee
                  ? `${selectedCoffee.name} - ${selectedCoffee.description}`
                  : searchTerm
              }
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                if (selectedCoffeeId) setSelectedCoffeeId("");
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className={styles.selectInput}
            />
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                {filtered.length > 0 ? (
                  filtered.map((coffee) => (
                    <div
                      key={coffee.id}
                      className={styles.option}
                      onClick={() => {
                        setSelectedCoffeeId(coffee.id);
                        setSearchTerm("");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <strong>{coffee.name}</strong> - {coffee.description}
                    </div>
                  ))
                ) : (
                  <div className={styles.option}>Не найдено</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Оценка: {rating}/10 *</label>
          <input
            type="range"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Комментарий *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Напишите ваш отзыв..."
            className={styles.textarea}
            rows={5}
          />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          Оставить отзыв
        </button>
      </div>
    </div>
  );
}
