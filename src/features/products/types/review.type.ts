export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListProps {
  reviews: Review[];
}

export interface ReviewCreateRequest {
  rating: number;
  comment: string;
}