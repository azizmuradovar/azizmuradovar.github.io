import { useState, useRef } from "react";
import { coffeeList } from "../data/coffeeData";
import type { Coffee } from "../types";

const TOTAL_SPINS = 4;
const REPEATS = 15;

export type CarouselItem = Coffee & { key: string };

export function useLucky() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [luckyWinnerId, setLuckyWinnerId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const carouselItems: CarouselItem[] = Array.from({ length: REPEATS }, (_, i) =>
    coffeeList.map((coffee) => ({ ...coffee, key: `${i}-${coffee.id}` }))
  ).flat();

  const luckyWinnerCoffee: Coffee | null = luckyWinnerId
    ? (coffeeList.find((c) => c.id === luckyWinnerId) ?? null)
    : null;

  const startSpin = () => {
    if (isSpinning || !carouselRef.current) return;

    setIsSpinning(true);
    setLuckyWinnerId(null);

    const track = carouselRef.current;
    const cards = track.querySelectorAll("[data-carousel-card]");
    if (cards.length < 2) return;

    const card0 = cards[0].getBoundingClientRect();
    const card1 = cards[1].getBoundingClientRect();
    const cardStep = card1.left - card0.left;

    const winnerIndex = Math.floor(Math.random() * coffeeList.length);
    const finalOffset = (TOTAL_SPINS * coffeeList.length + winnerIndex) * cardStep;

    track.style.transition = "none";
    track.style.transform = "translateX(0)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = "transform 5s cubic-bezier(0.15, 0.85, 0.3, 1)";
        track.style.transform = `translateX(-${finalOffset}px)`;
      });
    });

    setTimeout(() => {
      setIsSpinning(false);
      setLuckyWinnerId(coffeeList[winnerIndex].id);
    }, 5000);
  };

  return { isSpinning, luckyWinnerId, luckyWinnerCoffee, carouselRef, carouselItems, startSpin };
}
