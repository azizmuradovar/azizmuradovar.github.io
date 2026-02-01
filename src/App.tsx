import { useState, useEffect, useRef } from "react";
import "./App.css";
import { coffeeList } from "./coffeeData";

// Функция для получения флага страны
const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    Thailand: "🇹🇭",
    Brazil: "🇧🇷",
    Colombia: "🇨🇴",
    Guatemala: "🇬🇹",
    Ethiopia: "🇪🇹",
    Honduras: "🇭🇳",
    "Papua New Guinea": "🇵🇬",
    "Costa Rica": "🇨🇷",
    Peru: "🇵🇪",
    Panama: "🇵🇦",
  };
  return countryFlags[country] || "🏳️";
};

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface ReviewsData {
  [coffeeId: string]: Review[];
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<number | "">("");
  const [viewingCoffeeId, setViewingCoffeeId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [coffeeSearchTerm, setCoffeeSearchTerm] = useState("");
  const [isCoffeeSelectOpen, setIsCoffeeSelectOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewsData>({});
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Состояния для "Мне повезёт"
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [luckyWinner, setLuckyWinner] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Загрузка отзывов из localStorage
  useEffect(() => {
    const loadReviews = () => {
      const reviewsData: ReviewsData = JSON.parse(
        localStorage.getItem("reviews") || "{}",
      );
      setReviews(reviewsData);
    };
    loadReviews();
    // Слушаем изменения в localStorage (если отзыв сохранен в другом окне)
    window.addEventListener("storage", loadReviews);
    return () => window.removeEventListener("storage", loadReviews);
  }, []);

  // Функция для получения средней оценки
  const getAverageRating = (coffeeId: number): number | null => {
    const coffeeIdString = String(coffeeId);
    const coffeeReviews = reviews[coffeeIdString];
    if (!coffeeReviews || coffeeReviews.length === 0) {
      return null;
    }
    const sum = coffeeReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / coffeeReviews.length;
    return Math.round(average * 10) / 10; // Округление до 1 цифры после запятой
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsCoffeeSelectOpen(false);
      }
    };

    if (isCoffeeSelectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCoffeeSelectOpen]);

  const filteredCoffee = coffeeList.filter(
    (coffee) =>
      coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCoffeeForSelect = coffeeList.filter(
    (coffee) =>
      coffee.name.toLowerCase().includes(coffeeSearchTerm.toLowerCase()) ||
      coffee.description.toLowerCase().includes(coffeeSearchTerm.toLowerCase()),
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoffeeId("");
    setRating(5);
    setComment("");
    setCoffeeSearchTerm("");
    setIsCoffeeSelectOpen(false);
  };

  const handleSubmitReview = () => {
    if (!selectedCoffeeId || !comment.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const reviewsData: ReviewsData = JSON.parse(
      localStorage.getItem("reviews") || "{}",
    );

    const coffeeIdString = String(selectedCoffeeId);
    if (!reviewsData[coffeeIdString]) {
      reviewsData[coffeeIdString] = [];
    }

    reviewsData[coffeeIdString].push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rating,
      comment: comment.trim(),
    });

    localStorage.setItem("reviews", JSON.stringify(reviewsData));
    setReviews(reviewsData); // Обновляем состояние
    
    // Сохраняем ID кофе перед закрытием модалки
    const savedCoffeeId = selectedCoffeeId;
    
    handleCloseModal();
    
    // Открываем модалку с отзывами для созданного кофе
    setTimeout(() => {
      setViewingCoffeeId(savedCoffeeId as number);
      setIsReviewsModalOpen(true);
    }, 0);
  };

  const selectedCoffee = coffeeList.find(
    (coffee) => coffee.id === selectedCoffeeId,
  );

  const handleCoffeeCardClick = (coffeeId: number) => {
    setViewingCoffeeId(coffeeId);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviewsModal = () => {
    setIsReviewsModalOpen(false);
    setViewingCoffeeId(null);
  };

  const getCoffeeReviews = (coffeeId: number): Review[] => {
    const coffeeIdString = String(coffeeId);
    const coffeeReviews = reviews[coffeeIdString] || [];
    // Сортируем отзывы: самые последние наверху
    // Извлекаем timestamp из id (формат: "timestamp-randomstring")
    return [...coffeeReviews].sort((a, b) => {
      const timestampA = parseInt(a.id.split('-')[0]) || 0;
      const timestampB = parseInt(b.id.split('-')[0]) || 0;
      return timestampB - timestampA; // Сортировка по убыванию (новые первыми)
    });
  };

  const handleDeleteReview = (reviewId: string, coffeeId: number) => {
    const reviewsData: ReviewsData = JSON.parse(
      localStorage.getItem("reviews") || "{}",
    );
    const coffeeIdString = String(coffeeId);
    
    if (reviewsData[coffeeIdString]) {
      reviewsData[coffeeIdString] = reviewsData[coffeeIdString].filter(
        (review) => review.id !== reviewId
      );
      
      // Если отзывов не осталось, можно удалить ключ или оставить пустой массив
      if (reviewsData[coffeeIdString].length === 0) {
        delete reviewsData[coffeeIdString];
      }
      
      localStorage.setItem("reviews", JSON.stringify(reviewsData));
      setReviews(reviewsData);
    }
  };

  const viewingCoffee = viewingCoffeeId
    ? coffeeList.find((coffee) => coffee.id === viewingCoffeeId)
    : null;
  const coffeeReviews = viewingCoffeeId
    ? getCoffeeReviews(viewingCoffeeId)
    : [];

  // Логика "Мне повезёт"
  const handleOpenLuckyModal = () => {
    setIsLuckyModalOpen(true);
    setLuckyWinner(null);
    setIsSpinning(false);
  };

  const handleCloseLuckyModal = () => {
    setIsLuckyModalOpen(false);
    setIsSpinning(false);
    setLuckyWinner(null);
  };

  const handleStartSpin = () => {
    if (isSpinning || !carouselRef.current) return;
    
    setIsSpinning(true);
    setLuckyWinner(null);

    const track = carouselRef.current;
    const cards = track.querySelectorAll('.carousel-card');
    if (cards.length < 2) return;
    
    // Получаем реальный шаг между карточками из DOM
    const card0 = cards[0].getBoundingClientRect();
    const card1 = cards[1].getBoundingClientRect();
    const cardStep = card1.left - card0.left;
    
    const totalSpins = 4;
    
    // Выбираем случайный индекс победителя
    const winnerIndex = Math.floor(Math.random() * coffeeList.length);
    
    // Индекс карточки в carouselItems (после нескольких полных оборотов)
    const targetIndex = totalSpins * coffeeList.length + winnerIndex;
    
    // Простое смещение: index * шаг
    const finalOffset = targetIndex * cardStep;

    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = 'transform 5s cubic-bezier(0.15, 0.85, 0.3, 1)';
        track.style.transform = `translateX(-${finalOffset}px)`;
      });
    });

    // Победитель — карточка под указателем
    const winnerCoffee = coffeeList[winnerIndex];
    
    setTimeout(() => {
      setIsSpinning(false);
      setLuckyWinner(winnerCoffee.id);
    }, 5000);
  };

  // Генерируем карточки для карусели (много повторений)
  const generateCarouselItems = () => {
    const items = [];
    const repeats = 15; // Достаточно для длинной анимации
    for (let i = 0; i < repeats; i++) {
      for (const coffee of coffeeList) {
        items.push({ ...coffee, key: `${i}-${coffee.id}` });
      }
    }
    return items;
  };

  const carouselItems = generateCarouselItems();
  const luckyWinnerCoffee = luckyWinner 
    ? coffeeList.find(c => c.id === luckyWinner) 
    : null;

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск кофе..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="lucky-btn" onClick={handleOpenLuckyModal}>
          🎰 Мне повезёт
        </button>
        <button className="add-review-btn" onClick={handleOpenModal}>
          + отзыв
        </button>
      </div>
      <div className="cards-container">
        {filteredCoffee.length > 0 ? (
          filteredCoffee.map((coffee) => {
            const averageRating = getAverageRating(coffee.id);
            return (
              <div
                key={coffee.id}
                className="coffee-card"
                onClick={() => handleCoffeeCardClick(coffee.id)}
              >
                {averageRating !== null && (
                  <div className="rating-circle">{averageRating}</div>
                )}
                <div className="flag-icon">{getCountryFlag(coffee.country)}</div>
                <h3>{coffee.name}</h3>
                <p>{coffee.description}</p>
              </div>
            );
          })
        ) : (
          <div className="no-results">Ничего не найдено</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h2>Оставить отзыв</h2>

            <div className="form-group">
              <label>Выберите кофе *</label>
              <div className="select-wrapper" ref={selectRef}>
                <input
                  type="text"
                  placeholder="Поиск кофе..."
                  value={
                    selectedCoffee
                      ? `${selectedCoffee.name} - ${selectedCoffee.description}`
                      : coffeeSearchTerm
                  }
                  onChange={(e) => {
                    setCoffeeSearchTerm(e.target.value);
                    setIsCoffeeSelectOpen(true);
                    if (selectedCoffeeId) {
                      setSelectedCoffeeId("");
                    }
                  }}
                  onFocus={() => setIsCoffeeSelectOpen(true)}
                  className="coffee-select-input"
                />
                {isCoffeeSelectOpen && (
                  <div className="coffee-select-dropdown">
                    {filteredCoffeeForSelect.length > 0 ? (
                      filteredCoffeeForSelect.map((coffee) => (
                        <div
                          key={coffee.id}
                          className="coffee-select-option"
                          onClick={() => {
                            setSelectedCoffeeId(coffee.id);
                            setCoffeeSearchTerm("");
                            setIsCoffeeSelectOpen(false);
                          }}
                        >
                          <strong>{coffee.name}</strong> - {coffee.description}
                        </div>
                      ))
                    ) : (
                      <div className="coffee-select-option">Не найдено</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                Оценка: {rating}/10 *
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="rating-slider"
              />
            </div>

            <div className="form-group">
              <label>Комментарий *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Напишите ваш отзыв..."
                className="comment-textarea"
                rows={5}
              />
            </div>

            <button
              className="submit-review-btn"
              onClick={handleSubmitReview}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      )}

      {isReviewsModalOpen && viewingCoffee && (
        <div className="modal-overlay" onClick={handleCloseReviewsModal}>
          <div className="modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseReviewsModal}>
              ×
            </button>
            <h2>
              {viewingCoffee.name} - {viewingCoffee.description}
            </h2>
            <div className="reviews-container">
              {coffeeReviews.length > 0 ? (
                coffeeReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <button
                      className="review-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (viewingCoffeeId) {
                          handleDeleteReview(review.id, viewingCoffeeId);
                        }
                      }}
                      title="Удалить отзыв"
                    >
                      ×
                    </button>
                    <div className="review-rating">
                      <span className="rating-value">{review.rating}</span>
                      <span className="rating-max">/10</span>
                    </div>
                    <div className="review-comment">{review.comment}</div>
                  </div>
                ))
              ) : (
                <div className="no-reviews">Отзывов пока нет</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно "Мне повезёт" */}
      {isLuckyModalOpen && (
        <div className="modal-overlay lucky-overlay" onClick={handleCloseLuckyModal}>
          <div className="lucky-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseLuckyModal}>
              ×
            </button>
            <h2>🎰 Мне повезёт!</h2>
            
            <div className="carousel-container">
              {/* Указатель */}
              <div className="carousel-pointer"></div>
              
              {/* Карусель */}
              <div className="carousel-viewport">
                <div className="carousel-track" ref={carouselRef}>
                  {carouselItems.map((coffee) => (
                    <div 
                      key={coffee.key} 
                      className={`carousel-card ${luckyWinner === coffee.id ? 'winner' : ''}`}
                    >
                      <div className="carousel-card-flag">{getCountryFlag(coffee.country)}</div>
                      <div className="carousel-card-name">{coffee.name}</div>
                      <div className="carousel-card-desc">{coffee.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!isSpinning && !luckyWinner && (
              <button className="spin-btn" onClick={handleStartSpin}>
                🎲 Крутить!
              </button>
            )}

            {isSpinning && (
              <div className="spinning-text">Выбираем кофе...</div>
            )}

            {luckyWinner && luckyWinnerCoffee && (
              <div className="winner-result">
                <h3>🎉 Ваш кофе сегодня:</h3>
                <div className="winner-card">
                  <div className="winner-flag">{getCountryFlag(luckyWinnerCoffee.country)}</div>
                  <div className="winner-name">{luckyWinnerCoffee.name}</div>
                  <div className="winner-desc">{luckyWinnerCoffee.description}</div>
                </div>
                <div className="winner-actions">
                  <button className="spin-again-btn" onClick={handleStartSpin}>
                    🔄 Ещё раз
                  </button>
                  <button className="close-lucky-btn" onClick={handleCloseLuckyModal}>
                    ✓ Отлично!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
