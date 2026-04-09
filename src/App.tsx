import { useState } from "react";
import "./App.css";
import { coffeeList } from "./data/coffeeData";
import { useReviews } from "./hooks/useReviews";
import { CoffeeCard } from "./components/CoffeeCard/CoffeeCard";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { AddReviewModal } from "./components/modals/AddReviewModal/AddReviewModal";
import { ReviewsModal } from "./components/modals/ReviewsModal/ReviewsModal";
import { LuckyModal } from "./components/modals/LuckyModal/LuckyModal";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isLuckyOpen, setIsLuckyOpen] = useState(false);
  const [viewingCoffeeId, setViewingCoffeeId] = useState<number | null>(null);

  const { getAverageRating, getCoffeeReviews, addReview, deleteReview } = useReviews();

  const filteredCoffees = coffeeList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReview = (coffeeId: number, rating: number, comment: string) => {
    addReview(coffeeId, rating, comment);
    setIsAddReviewOpen(false);
    setTimeout(() => {
      setViewingCoffeeId(coffeeId);
      setIsReviewsOpen(true);
    }, 0);
  };

  const viewingCoffee = viewingCoffeeId
    ? (coffeeList.find((c) => c.id === viewingCoffeeId) ?? null)
    : null;

  return (
    <div className="app">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onLucky={() => setIsLuckyOpen(true)}
        onAddReview={() => setIsAddReviewOpen(true)}
      />

      <div className="cards-container">
        {filteredCoffees.length > 0 ? (
          filteredCoffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              averageRating={getAverageRating(coffee.id)}
              onClick={(id) => {
                setViewingCoffeeId(id);
                setIsReviewsOpen(true);
              }}
            />
          ))
        ) : (
          <div className="no-results">Ничего не найдено</div>
        )}
      </div>

      {isAddReviewOpen && (
        <AddReviewModal
          onSubmit={handleAddReview}
          onClose={() => setIsAddReviewOpen(false)}
        />
      )}

      {isReviewsOpen && viewingCoffee && (
        <ReviewsModal
          coffee={viewingCoffee}
          reviews={getCoffeeReviews(viewingCoffee.id)}
          onDelete={deleteReview}
          onClose={() => {
            setIsReviewsOpen(false);
            setViewingCoffeeId(null);
          }}
        />
      )}

      {isLuckyOpen && (
        <LuckyModal onClose={() => setIsLuckyOpen(false)} />
      )}
    </div>
  );
}

export default App;
