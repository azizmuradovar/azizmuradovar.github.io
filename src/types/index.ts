export interface Coffee {
  id: number;
  name: string;
  country: string;
  description: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
}

export type ReviewsData = Record<string, Review[]>;
