interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  author: string;
  coverColor: string;
  coverUrl: string;
  description: string;
  genre: string;
  rating: number;
  summary: string;
  title: string;
  totalCopies: number;
  videoUrl: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
