// Blog Type Definitions

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  isPublished: boolean;
  publishedAt: string;
  readTimeMinutes: number;
  viewsCount: number;
  tags: string[];
  categoryId: string;
  category: Category; // العلاقة المتداخلة
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  data: Article[];
  meta: PaginationMeta;
}

// Form types for creating/updating articles
export interface ArticleFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  tags?: string[];
  categoryId?: string;
}

// API response types
export interface ArticleResponse extends Article {}

export interface PublishToggleResponse {
  id: string;
  isPublished: boolean;
  publishedAt: string | null;
  message: string;
}

export interface DeleteResponse {
  message: string;
}
