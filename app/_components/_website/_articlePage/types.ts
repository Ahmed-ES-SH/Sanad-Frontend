export interface Article {
  id: number;
  title: string;
  excerpt: string;
  body?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  featured: boolean;
}
