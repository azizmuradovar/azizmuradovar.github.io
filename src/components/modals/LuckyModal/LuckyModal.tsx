import { useLucky } from "../../../hooks/useLucky";
import { getCountryFlag } from "../../../utils/countryFlags";
import styles from "./LuckyModal.module.css";

interface Props {
  onClose: () => void;
}

export function LuckyModal({ onClose }: Props) {
  const {
    isSpinning,
    luckyWinnerId,
    luckyWinnerCoffee,
    carouselRef,
    carouselItems,
    startSpin,
  } = useLucky();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h2 className={styles.title}>🎰 Мне повезёт!</h2>

        <div className={styles.carouselContainer}>
          <div className={styles.pointer} />
          <div className={styles.viewport}>
            <div className={styles.track} ref={carouselRef}>
              {carouselItems.map((coffee) => (
                <div
                  key={coffee.key}
                  data-carousel-card="true"
                  className={`${styles.card} ${luckyWinnerId === coffee.id ? styles.winner : ""}`}
                >
                  <div className={styles.cardFlag}>{getCountryFlag(coffee.country)}</div>
                  <div className={styles.cardName}>{coffee.name}</div>
                  <div className={styles.cardDesc}>{coffee.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isSpinning && !luckyWinnerId && (
          <button className={styles.spinBtn} onClick={startSpin}>
            🎲 Крутить!
          </button>
        )}

        {isSpinning && (
          <div className={styles.spinningText}>Выбираем кофе...</div>
        )}

        {luckyWinnerId && luckyWinnerCoffee && (
          <div className={styles.winnerResult}>
            <h3 className={styles.winnerTitle}>🎉 Ваш кофе сегодня:</h3>
            <div className={styles.winnerCard}>
              <div className={styles.winnerFlag}>{getCountryFlag(luckyWinnerCoffee.country)}</div>
              <div className={styles.winnerName}>{luckyWinnerCoffee.name}</div>
              <div className={styles.winnerDesc}>{luckyWinnerCoffee.description}</div>
            </div>
            <div className={styles.winnerActions}>
              <button className={styles.spinAgainBtn} onClick={startSpin}>
                🔄 Ещё раз
              </button>
              <button className={styles.closeLuckyBtn} onClick={onClose}>
                ✓ Отлично!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
