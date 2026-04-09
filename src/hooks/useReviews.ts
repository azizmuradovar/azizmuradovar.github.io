import { useState, useEffect } from "react";
import type { ReviewsData, Review } from "../types";

const STORAGE_KEY = "reviews";

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewsData>({});

  useEffect(() => {
    const load = () => {
      setReviews(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const persist = (data: ReviewsData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setReviews(data);
  };

  const getAverageRating = (coffeeId: number): number | null => {
    const list = reviews[String(coffeeId)];
    if (!list?.length) return null;
    const avg = list.reduce((acc, r) => acc + r.rating, 0) / list.length;
    return Math.round(avg * 10) / 10;
  };

  const getCoffeeReviews = (coffeeId: number): Review[] => {
    const list = reviews[String(coffeeId)] ?? [];
    return [...list].sort((a, b) => {
      const tA = parseInt(a.id.split("-")[0]) || 0;
      const tB = parseInt(b.id.split("-")[0]) || 0;
      return tB - tA;
    });
  };

  const addReview = (coffeeId: number, rating: number, comment: string) => {
    const data: ReviewsData = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const key = String(coffeeId);
    if (!data[key]) data[key] = [];
    data[key].push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rating,
      comment: comment.trim(),
    });
    persist(data);
  };

  const deleteReview = (reviewId: string, coffeeId: number) => {
    const data: ReviewsData = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const key = String(coffeeId);
    if (!data[key]) return;
    data[key] = data[key].filter((r) => r.id !== reviewId);
    if (!data[key].length) delete data[key];
    persist(data);
  };

  return { getAverageRating, getCoffeeReviews, addReview, deleteReview };
}
