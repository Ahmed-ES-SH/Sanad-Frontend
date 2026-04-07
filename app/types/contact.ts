// Contact Message Type Definitions

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactListResponse {
  data: ContactMessage[];
  meta: PaginationMeta;
}

export interface ContactSubmitResponse {
  message: string;
  id: string;
}

export interface MarkReadResponse {
  id: string;
  isRead: boolean;
  message: string;
}

export interface MarkRepliedResponse {
  id: string;
  isRead: boolean;
  repliedAt: string;
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  isRead?: boolean;
}

export interface ContactStats {
  total: number;
  unread: number;
  replied: number;
}
