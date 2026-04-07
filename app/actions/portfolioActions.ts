'use server';

import { revalidateTag } from 'next/cache';
import { PORTFOLIO_ENDPOINTS } from '@/app/constants/endpoints';
import { protectedRequest, publicRequest, ApiError } from '@/lib/api-client';
import {
  Project,
  ProjectFormData,
  PublicProjectListResponse,
  ProjectListResponse,
  PublishToggleResponse,
  FeatureToggleResponse,
  ReorderItem,
  DeleteResponse,
  PortfolioQueryParams,
  AdminPortfolioQueryParams,
} from '@/app/types/project';

// ============================================================
// Public Actions
// ============================================================

// Public: Get all published projects with optional filtering
export async function getPublishedProjects(
  params: PortfolioQueryParams = {}
): Promise<{ data: Project[] }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.techStack) searchParams.set('techStack', params.techStack);
    if (params.featured !== undefined)
      searchParams.set('featured', params.featured.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${PORTFOLIO_ENDPOINTS.LIST_PUBLISHED}?${queryString}`
      : PORTFOLIO_ENDPOINTS.LIST_PUBLISHED;

    const response = await publicRequest<PublicProjectListResponse>(
      endpoint,
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch projects');
  }
}

// Public: Get a single published project by slug
export async function getProjectBySlug(slug: string): Promise<Project> {
  try {
    const response = await publicRequest<Project>(
      PORTFOLIO_ENDPOINTS.GET_BY_SLUG(slug),
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch project');
  }
}

// ============================================================
// Admin Actions
// ============================================================

// Admin: Get all projects (including drafts) with pagination
export async function getAdminProjects(
  params: AdminPortfolioQueryParams = {}
): Promise<{ data: Project[]; meta: ProjectListResponse['meta'] }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.order) searchParams.set('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${PORTFOLIO_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : PORTFOLIO_ENDPOINTS.ADMIN_LIST;

    const response = await protectedRequest<ProjectListResponse>(endpoint, 'GET');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch admin projects');
  }
}

// Admin: Get a single project by ID (for edit page prefill)
export async function getAdminProjectById(id: string): Promise<Project> {
  try {
    const response = await protectedRequest<ProjectListResponse>(
      PORTFOLIO_ENDPOINTS.ADMIN_LIST,
      'GET'
    );
    // Backend doesn't have a single GET by ID for admin, so we filter from list
    const project = response.data.find((p: Project) => p.id === id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch project');
  }
}

// Admin: Create a new project (draft by default)
export async function createProject(
  formData: ProjectFormData
): Promise<{ success: boolean; message: string; data?: Project }> {
  try {
    const response = await protectedRequest<Project>(
      PORTFOLIO_ENDPOINTS.ADMIN_CREATE,
      'POST',
      formData as unknown as Record<string, unknown>
    );

    revalidateTag('portfolio', 'default');

    return {
      success: true,
      message: 'Project created successfully',
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
      message: 'Failed to create project',
    };
  }
}

// Admin: Update an existing project
export async function updateProject(
  id: string,
  formData: Partial<ProjectFormData>
): Promise<{ success: boolean; message: string; data?: Project }> {
  try {
    const response = await protectedRequest<Project>(
      PORTFOLIO_ENDPOINTS.ADMIN_UPDATE(id),
      'PATCH',
      formData as unknown as Record<string, unknown>
    );

    revalidateTag('portfolio', 'default');

    return {
      success: true,
      message: 'Project updated successfully',
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
      message: 'Failed to update project',
    };
  }
}

// Admin: Toggle publish status
export async function togglePublishStatus(
  id: string
): Promise<{ success: boolean; message: string; data?: PublishToggleResponse }> {
  try {
    const response = await protectedRequest<PublishToggleResponse>(
      PORTFOLIO_ENDPOINTS.ADMIN_PUBLISH(id),
      'PATCH'
    );

    revalidateTag('portfolio', 'default');

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
      message: 'Failed to toggle publish status',
    };
  }
}

// Admin: Toggle featured status
export async function toggleFeatureStatus(
  id: string
): Promise<{ success: boolean; message: string; data?: FeatureToggleResponse }> {
  try {
    const response = await protectedRequest<FeatureToggleResponse>(
      PORTFOLIO_ENDPOINTS.ADMIN_FEATURE(id),
      'PATCH'
    );

    revalidateTag('portfolio', 'default');

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
      message: 'Failed to toggle feature status',
    };
  }
}

// Admin: Delete a project
export async function deleteProject(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await protectedRequest<DeleteResponse>(
      PORTFOLIO_ENDPOINTS.ADMIN_DELETE(id),
      'DELETE'
    );

    revalidateTag('portfolio', 'default');

    return {
      success: true,
      message: 'Project deleted successfully',
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
      message: 'Failed to delete project',
    };
  }
}

// Admin: Reorder multiple projects
export async function reorderProjects(
  items: ReorderItem[]
): Promise<{ success: boolean; message: string }> {
  try {
    await protectedRequest(
      PORTFOLIO_ENDPOINTS.ADMIN_REORDER,
      'PATCH',
      { items } as unknown as Record<string, unknown>
    );

    revalidateTag('portfolio', 'default');

    return {
      success: true,
      message: 'Projects reordered successfully',
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
      message: 'Failed to reorder projects',
    };
  }
}
