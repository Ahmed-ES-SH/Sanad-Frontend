'use server';

import { revalidateTag } from 'next/cache';
import { SERVICES_ENDPOINTS } from '@/app/constants/endpoints';
import { protectedRequest, publicRequest, ApiError } from '@/lib/api-client';
import {
  Service,
  ServiceFormData,
  ServiceListResponse,
  PublicServiceListResponse,
  PublishToggleResponse,
  DeleteResponse,
  ReorderItem,
  ServiceQueryParams,
} from '@/app/types/service';

const SERVICE_CACHE_TAG = 'published-services';

export async function getPublishedServices(): Promise<{ data: Service[] }> {
  try {
    const response = await publicRequest<PublicServiceListResponse>(
      SERVICES_ENDPOINTS.LIST_PUBLISHED,
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch published services');
  }
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  try {
    const response = await publicRequest<Service>(
      SERVICES_ENDPOINTS.GET_BY_SLUG(slug),
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch service');
  }
}

export async function getAdminServices(
  params: ServiceQueryParams = {}
): Promise<{ data: Service[]; meta: ServiceListResponse['meta'] }> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.order) searchParams.set('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${SERVICES_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : SERVICES_ENDPOINTS.ADMIN_LIST;

    const response = await protectedRequest<ServiceListResponse>(
      endpoint,
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch admin services');
  }
}

export async function getAdminServiceById(id: string): Promise<Service> {
  try {
    const response = await protectedRequest<Service>(
      SERVICES_ENDPOINTS.ADMIN_UPDATE(id),
      'GET'
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch service');
  }
}

export async function createService(
  formData: ServiceFormData
): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await protectedRequest<Service>(
      SERVICES_ENDPOINTS.ADMIN_CREATE,
      'POST',
      formData as unknown as Record<string, unknown>
    );

    revalidateTag(SERVICE_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Service created successfully',
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
      message: 'Failed to create service',
    };
  }
}

export async function updateService(
  id: string,
  formData: Partial<ServiceFormData>
): Promise<{ success: boolean; message: string; data?: Service }> {
  try {
    const response = await protectedRequest<Service>(
      SERVICES_ENDPOINTS.ADMIN_UPDATE(id),
      'PATCH',
      formData as unknown as Record<string, unknown>
    );

    revalidateTag(SERVICE_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Service updated successfully',
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
      message: 'Failed to update service',
    };
  }
}

export async function togglePublishService(
  id: string
): Promise<{ success: boolean; message: string; data?: PublishToggleResponse }> {
  try {
    const response = await protectedRequest<PublishToggleResponse>(
      SERVICES_ENDPOINTS.ADMIN_PUBLISH(id),
      'PATCH'
    );

    revalidateTag(SERVICE_CACHE_TAG, 'default');

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

export async function deleteService(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await protectedRequest<DeleteResponse>(
      SERVICES_ENDPOINTS.ADMIN_DELETE(id),
      'DELETE'
    );

    revalidateTag(SERVICE_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Service deleted successfully',
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
      message: 'Failed to delete service',
    };
  }
}

export async function reorderServices(
  items: ReorderItem[]
): Promise<{ success: boolean; message: string }> {
  try {
    await protectedRequest(
      SERVICES_ENDPOINTS.ADMIN_REORDER,
      'PATCH',
      { items } as unknown as Record<string, unknown>
    );

    revalidateTag(SERVICE_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Services reordered successfully',
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
      message: 'Failed to reorder services',
    };
  }
}
