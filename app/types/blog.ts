// Blog Type Definitions

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  categoryId: string | null;
  category: Category | null;
  isPublished: boolean;
  publishedAt: string | null;
  readTimeMinutes: number;
  viewsCount: number;
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