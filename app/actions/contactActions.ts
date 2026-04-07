'use server';

import { revalidatePath } from 'next/cache';
import { CONTACT_ENDPOINTS } from '@/app/constants/endpoints';
import { protectedRequest, publicRequest, ApiError } from '@/lib/api-client';
import {
  ContactMessage,
  ContactFormData,
  ContactListResponse,
  ContactSubmitResponse,
  MarkReadResponse,
  MarkRepliedResponse,
  DeleteResponse,
  ContactQueryParams,
} from '@/app/types/contact';

// Public: Submit a new contact message
export async function submitContact(
  formData: ContactFormData
): Promise<{ success: boolean; message: string }> {
  try {
    await publicRequest<ContactSubmitResponse>(
      CONTACT_ENDPOINTS.SUBMIT,
      'POST',
      formData as unknown as Record<string, unknown>
    );

    return {
      success: true,
      message: 'Your message has been sent successfully',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 429) {
        return {
          success: false,
          message: error.message || 'Too many requests. Please try again later.',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
    };
  }
}

// Admin: Fetch all contact messages with pagination and filtering
export async function fetchContactMessages(
  params: ContactQueryParams = {}
): Promise<{
  success: boolean;
  data?: ContactMessage[];
  meta?: ContactListResponse['meta'];
  message?: string;
}> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.order) searchParams.set('order', params.order);
    if (params.isRead !== undefined) searchParams.set('isRead', params.isRead.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${CONTACT_ENDPOINTS.ADMIN_LIST}?${queryString}`
      : CONTACT_ENDPOINTS.ADMIN_LIST;

    const response = await protectedRequest<ContactListResponse>(endpoint, 'GET');
    return {
      success: true,
      data: response.data,
      meta: response.meta,
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
      message: 'Failed to fetch contact messages',
    };
  }
}

// Admin: Get a single contact message detail
export async function fetchContactDetail(id: string): Promise<{
  success: boolean;
  data?: ContactMessage;
  message?: string;
}> {
  try {
    const response = await protectedRequest<ContactMessage>(
      CONTACT_ENDPOINTS.ADMIN_GET(id),
      'GET'
    );
    return {
      success: true,
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
      message: 'Failed to fetch contact message',
    };
  }
}

// Admin: Mark a message as read
export async function markAsRead(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await protectedRequest<MarkReadResponse>(
      CONTACT_ENDPOINTS.ADMIN_MARK_READ(id),
      'PATCH',
      {}
    );

    revalidatePath('/dashboard/contactus');
    return {
      success: true,
      message: 'Message marked as read',
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
      message: 'Failed to mark message as read',
    };
  }
}

// Admin: Mark a message as replied
export async function markAsReplied(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await protectedRequest<MarkRepliedResponse>(
      CONTACT_ENDPOINTS.ADMIN_MARK_REPLIED(id),
      'PATCH',
      {}
    );

    revalidatePath('/dashboard/contactus');
    return {
      success: true,
      message: 'Message marked as replied',
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
      message: 'Failed to mark message as replied',
    };
  }
}

// Admin: Delete a contact message
export async function deleteContactMessage(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await protectedRequest<DeleteResponse>(
      CONTACT_ENDPOINTS.ADMIN_DELETE(id),
      'DELETE',
      {}
    );

    revalidatePath('/dashboard/contactus');
    return {
      success: true,
      message: 'Contact message deleted successfully',
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
      message: 'Failed to delete contact message',
    };
  }
}
