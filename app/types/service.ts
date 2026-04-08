import { Category } from "./blog";

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  coverImageUrl: string;
  iconUrl: string;
  basePrice: string;
  isPublished: boolean;
  order: number;
  categoryId: string;
  category: Partial<Category>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicServiceListResponse {
  data: Service[];
}

export interface ServiceListResponse {
  data: Service[];
  meta: PaginationMeta;
}

export interface ReorderItem {
  id: string;
  order: number;
}

export interface ServiceFormData {
  title: string;
  shortDescription: string;
  longDescription?: string;
  iconUrl?: string;
  coverImageUrl?: string;
  categoryId?: string;
}

export interface PublishToggleResponse {
  id: string;
  isPublished: boolean;
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "order";
  order?: "ASC" | "DESC";
}
