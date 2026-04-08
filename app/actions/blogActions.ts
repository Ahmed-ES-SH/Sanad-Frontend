"use server";

import { revalidateTag } from "next/cache";
import { BLOG_ENDPOINTS } from "@/app/constants/endpoints";
import { protectedRequest, publicRequest, ApiError } from "@/lib/api-client";
import {
  Article,
  ArticleFormData,
  BlogListResponse,
  PublishToggleResponse,
  DeleteResponse,
  Category,
} from "@/app/types/blog";

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  categoryId?: string;
  tag?: string;
}

// Public: Get published articles with pagination and filtering
export async function getArticles(
  params: BlogQueryParams = {},
): Promise<{ data: Article[]; meta: BlogListResponse["meta"] }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.order) searchParams.set("order", params.order);
    if (params.categoryId) searchParams.set("categoryId", params.categoryId);
    if (params.tag) searchParams.set("tag", params.tag);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${BLOG_ENDPOINTS.LIST_PUBLISHED}?${queryString}`
      : BLOG_ENDPOINTS.LIST_PUBLISHED;

    const response = await publicRequest<BlogListResponse>(endpoint, "GET");
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch articles");
  }
}

export async function getCategories() {
  try {
    const response = await publicRequest<Category[]>(
      BLOG_ENDPOINTS.CATEGORIES,
      "GET",
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch categories");
  }
}

// Public: Get a single article by slug
export async function getArticleBySlug(slug: string): Promise<Article> {
  try {
    const response = await publicRequest<Article>(
      BLOG_ENDPOINTS.GET_BY_SLUG(slug),
      "GET",
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch article");
  }
}

// Admin: Get all articles (including drafts)
export async function getAdminArticles(
  params: BlogQueryParams = {},
): Promise<{ data: Article[]; meta: BlogListResponse["meta"] }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.order) searchParams.set("order", params.order);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${BLOG_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : BLOG_ENDPOINTS.ADMIN_LIST;

    const response = await protectedRequest<BlogListResponse>(endpoint, "GET");
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch admin articles");
  }
}

// Admin: Create a new article (draft by default)
export async function createArticle(
  formData: ArticleFormData,
): Promise<{ success: boolean; message: string; data?: Article }> {
  try {
    const response = await protectedRequest<Article>(
      BLOG_ENDPOINTS.ADMIN_CREATE,
      "POST",
      formData as unknown as Record<string, unknown>,
    );

    revalidateTag("blog", "default");

    return {
      success: true,
      message: "Article created successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to create article",
    };
  }
}

// Admin: Update an existing article
export async function updateArticle(
  id: string,
  formData: Partial<ArticleFormData>,
): Promise<{ success: boolean; message: string; data?: Article }> {
  try {
    const response = await protectedRequest<Article>(
      BLOG_ENDPOINTS.ADMIN_UPDATE(id),
      "PATCH",
      formData as unknown as Record<string, unknown>,
    );

    revalidateTag("blog", "default");

    return {
      success: true,
      message: "Article updated successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to update article",
    };
  }
}

// Admin: Toggle publish status
export async function togglePublishStatus(
  id: string,
): Promise<{
  success: boolean;
  message: string;
  data?: PublishToggleResponse;
}> {
  try {
    const response = await protectedRequest<PublishToggleResponse>(
      BLOG_ENDPOINTS.ADMIN_PUBLISH(id),
      "PATCH",
    );

    revalidateTag("blog", "default");

    return {
      success: true,
      message: response.message,
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to toggle publish status",
    };
  }
}

// Admin: Delete an article
export async function deleteArticle(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await protectedRequest<DeleteResponse>(
      BLOG_ENDPOINTS.ADMIN_DELETE(id),
      "DELETE",
    );

    revalidateTag("blog", "default");

    return {
      success: true,
      message: "Article deleted successfully",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to delete article",
    };
  }
}
