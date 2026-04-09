# Notifications Integration Work Plan

> **Project:** Sanad Frontend - Notification System  
> **Status:** Planned - Awaiting Approval  
> **Created:** 2026-04-09  
> **Source Document:** `NOTIFICATIONS_INTEGRATION.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Implementation Phases](#3-implementation-phases)
4. [File Structure Recommendations](#4-file-structure-recommendations)
5. [Component Breakdown](#5-component-breakdown)
6. [State Management Strategy](#6-state-management-strategy)
7. [API Integration Strategy](#7-api-integration-strategy)
8. [WebSocket Integration Strategy](#8-websocket-integration-strategy)
9. [Testing Strategy](#9-testing-strategy)
10. [Success Criteria](#10-success-criteria)
11. [Risk Assessment & Mitigation](#11-risk-assessment--mitigation)

---

## 1. Executive Summary

This document outlines the step-by-step plan for integrating a real-time notification system into the Sanad frontend application. The system combines **WebSocket-based real-time updates** (Socket.IO v4) with **REST API endpoints** for data management.

### Key Features
- Real-time notification delivery via WebSocket
- Paginated notification list with read/unread states
- Unread count badge for navbar
- Mark single/all notifications as read
- Delete notifications (soft delete)
- Notification preferences management
- Admin notification broadcasting
- Toast/in-app notification popups

### Technical Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Real-time | Socket.IO Client v4 |
| State | React Context + useState/useReducer |
| HTTP | Fetch API / existing HTTP client |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Notification │  │ Notification │  │ Notification  │  │
│  │   Provider   │  │   Components │  │    Hook       │  │
│  │  (Context)   │  │  (UI Layer)  │  │  (Logic)      │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                  │                   │          │
│  ┌──────┴──────────────────┴───────────────────┴──────┐  │
│  │           Notification Service Layer                │  │
│  │  ┌────────────────────┐  ┌───────────────────────┐  │  │
│  │  │   REST API Client  │  │  WebSocket (Socket.IO)│  │  │
│  │  └────────────────────┘  └───────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                                │
         ▼                                ▼
┌─────────────────┐            ┌─────────────────────┐
│   REST API      │            │  WebSocket Server   │
│  /api/notifications         │  Real-time Events   │
└─────────────────┘            └─────────────────────┘
```

---

## 3. Implementation Phases

### Phase 1: Foundation & Types
**Goal:** Establish type definitions, constants, and base configuration.

#### Tasks:
1. **Define TypeScript types** (`app/types/notification.ts`)
   - `Notification` interface
   - `NotificationType` enum
   - `NotificationPreferences` interface
   - API response types (paginated, count, etc.)
   - Socket.IO event type definitions

2. **Define API constants** (`app/constants/notifications.ts`)
   - API endpoint URLs
   - Notification type labels/descriptions
   - Default pagination values
   - Socket.IO connection configuration

3. **Setup Socket.IO configuration** (`app/helpers/socket.ts`)
   - Socket.IO connection factory function
   - Authentication token handling
   - Reconnection strategy

**Complexity:** Low  
**Dependencies:** None

---

### Phase 2: API Service Layer
**Goal:** Create reusable API functions for all REST endpoints.

#### Tasks:
1. **Create notification API service** (`app/actions/notificationApi.ts`)
   - `fetchNotifications(page, limit)` - Get paginated notifications
   - `fetchUnreadCount()` - Get unread notification count
   - `markAsRead(id)` - Mark single notification as read
   - `markAllAsRead()` - Mark all notifications as read
   - `deleteNotification(id)` - Soft delete notification
   - `fetchPreferences()` - Get notification preferences
   - `updatePreferences(prefs)` - Update notification preferences
   - Admin functions: `sendNotification()`, `broadcastNotification()`, `adminFetchNotifications()`

2. **Error handling wrapper**
   - Centralized error handling for API calls
   - Token expiration detection & redirect
   - Retry logic for failed requests

**Complexity:** Low-Medium  
**Dependencies:** Phase 1 (Types & Constants)

---

### Phase 3: Context & State Management
**Goal:** Create React Context provider for notification state.

#### Tasks:
1. **Create Notification Context** (`app/context/NotificationContext.tsx`)
   - State: notifications list, unread count, loading states, socket connection status
   - Actions: fetch, mark read, delete, refresh
   - Provider component with initialization logic

2. **Create `useNotification` hook** (`app/context/NotificationContext.tsx`)
   - Typed hook for accessing notification context
   - Convenience methods for common operations
   - Optimistic UI update support

3. **WebSocket integration in Context**
   - Initialize Socket.IO connection on mount
   - Listen to all server events
   - Update state in response to real-time events
   - Handle reconnection on disconnect
   - Clean up on unmount

**Complexity:** High  
**Dependencies:** Phase 1, Phase 2

---

### Phase 4: UI Components - Core
**Goal:** Build the notification UI components.

#### Tasks:
1. **Notification Bell/Badge** (`app/_components/_global/NotificationBell.tsx`)
   - Icon with unread count badge
   - Click to open notification panel/dropdown
   - Pulse animation for new notifications
   - Accessible (ARIA labels, keyboard navigation)

2. **Notification Panel/Dropdown** (`app/_components/_global/NotificationPanel.tsx`)
   - Dropdown/popover triggered by bell
   - List of recent notifications
   - "Mark all as read" button
   - Loading & empty states
   - Scroll to load more (pagination)

3. **Notification Item** (`app/_components/_global/NotificationItem.tsx`)
   - Single notification display
   - Read/unread visual distinction
   - Click to mark as read & navigate
   - Delete action
   - Type-specific icons/colors
   - Timestamp formatting

4. **Notification Page** (`app/[local]/notifications/page.tsx` - or appropriate route)
   - Full-page notification list
   - Pagination controls
   - Filter by type/read status
   - Bulk actions

**Complexity:** Medium-High  
**Dependencies:** Phase 3

---

### Phase 5: UI Components - Preferences & Admin
**Goal:** Build preference management and admin interfaces.

#### Tasks:
1. **Notification Preferences** (`app/[local]/settings/notificationsations/page.tsx` - or appropriate route)
   - Toggle switches for notification types
   - Email/Push notification toggles
   - Save & loading states
   - Validation feedback

2. **Admin Notification Panel** (`app/[local]/admin/notifications/page.tsx` - admin route)
   - Send notification to specific user
   - Broadcast notification form
   - View all notifications (admin)
   - Notification type selector

3. **Toast Notification System** (`app/_components/_global/ToastProvider.tsx`)
   - Real-time toast popups for incoming notifications
   - Auto-dismiss with timeout
   - Click toast to navigate to notification
   - Stack multiple toasts gracefully
   - Use existing toast library if available

**Complexity:** Medium  
**Dependencies:** Phase 4

---

### Phase 6: Integration & Wiring
**Goal:** Connect all components and integrate into the app.

#### Tasks:
1. **Wrap app with NotificationProvider** (`app/layout.tsx`)
   - Add NotificationProvider to root layout
   - Ensure token is available for authentication
   - Conditional rendering based on auth state

2. **Add NotificationBell to Navbar/Header**
   - Integrate bell component into existing header
   - Ensure it appears on all authenticated pages

3. **Wire up real-time events**
   - Test all WebSocket event handlers
   - Verify state updates on each event type
   - Test reconnection behavior

4. **Optimistic UI updates**
   - Update UI immediately on user actions
   - Rollback on API failure
   - Loading states for async operations

**Complexity:** Medium  
**Dependencies:** Phase 4, Phase 5

---

### Phase 7: Polish & Testing
**Goal:** Refine UX, test thoroughly, fix edge cases.

#### Tasks:
1. **Error handling & edge cases**
   - Network failure handling
   - Token expiration during WebSocket session
   - Empty states with helpful messaging
   - Rate limiting responses
   - Socket disconnection fallback

2. **Performance optimization**
   - Virtualize long notification lists
   - Debounce mark-as-read actions
   - Memoize components to prevent re-renders
   - Optimize WebSocket message handling

3. **Accessibility audit**
   - Keyboard navigation for all components
   - Screen reader announcements for new notifications
   - ARIA labels and roles
   - Focus management in dropdowns/modals

4. **Visual polish**
   - Consistent spacing and alignment
   - Smooth animations for new notifications
   - Hover/focus states
   - Responsive design for mobile

**Complexity:** Medium  
**Dependencies:** Phase 6

---

## 4. File Structure Recommendations

```
app/
├── types/
│   └── notification.ts              # TypeScript interfaces & enums
├── constants/
│   └── notifications.ts             # API URLs, config, labels
├── helpers/
│   └── socket.ts                    # Socket.IO connection factory
├── actions/
│   └── notificationApi.ts           # REST API service functions
├── context/
│   └── NotificationContext.tsx      # Context provider + useNotification hook
├── _components/
│   └── _global/
│       ├── NotificationBell.tsx     # Bell icon with unread badge
│       ├── NotificationPanel.tsx    # Dropdown notification list
│       ├── NotificationItem.tsx     # Single notification card
│       └── ToastProvider.tsx        # Real-time toast notifications
├── [local]/
│   ├── notifications/
│   │   └── page.tsx                 # Full notification list page
│   ├── settings/
│   │   └── notifications/page.tsx   # Notification preferences
│   └── admin/
│       └── notifications/
│           └── page.tsx             # Admin notification management
└── layout.tsx                       # Root layout (add NotificationProvider)
```

---

## 5. Component Breakdown

### NotificationBell
| Aspect | Details |
|--------|---------|
| **Props** | `onClick?: () => void`, `showCount?: boolean` |
| **State** | Unread count from context |
| **Behavior** | Opens NotificationPanel on click, shows badge with unread count |
| **Accessibility** | ARIA label "Notifications", role="button", keyboard accessible |

### NotificationPanel
| Aspect | Details |
|--------|---------|
| **Props** | `isOpen: boolean`, `onClose: () => void` |
| **State** | Internal scroll position, loading more state |
| **Behavior** | Fetches notifications on open, infinite scroll, mark all as read |
| **Accessibility** | role="dialog", focus trap, escape to close |

### NotificationItem
| Aspect | Details |
|--------|---------|
| **Props** | `notification: Notification`, `onRead?: (id) => void`, `onDelete?: (id) => void` |
| **State** | Hover state, optimistic read state |
| **Behavior** | Click marks as read, delete button with confirmation |
| **Accessibility** | role="listitem", aria-read status, keyboard actions |

### ToastProvider
| Aspect | Details |
|--------|---------|
| **Props** | `children: ReactNode` |
| **State** | Active toasts array from context |
| **Behavior** | Shows toast on `notification:new`, auto-dismiss, click to navigate |
| **Accessibility** | role="alert", aria-live="polite", auto-announce |

---

## 6. State Management Strategy

### Approach: React Context + useReducer

```
NotificationState {
  notifications: Notification[]        // Current page of notifications
  unreadCount: number                  // Unread count for badge
  preferences: NotificationPreferences | null
  isLoading: boolean                   // Loading state for fetch
  isSocketConnected: boolean           // WebSocket connection status
  error: string | null                 // Last error message
  pagination: { page: number, limit: number, total: number }
}
```

### Actions:
- `SET_NOTIFICATIONS` - Replace notification list
- `ADD_NOTIFICATION` - Prepend new notification (from WebSocket)
- `MARK_AS_READ` - Update single notification read status
- `MARK_ALL_AS_READ` - Update all to read
- `DELETE_NOTIFICATION` - Remove from list
- `SET_UNREAD_COUNT` - Update badge count
- `SET_PREFERENCES` - Update preferences
- `SET_LOADING` - Toggle loading state
- `SET_SOCKET_STATUS` - Update connection status
- `SET_ERROR` - Record error

### Optimistic Updates:
- Mark as read: Update UI immediately, rollback on API failure
- Delete: Remove immediately, restore on failure
- New notification: Add to list immediately when received via WebSocket

---

## 7. API Integration Strategy

### REST Client Pattern:
```
Service Function → API Call → Response Parser → State Update
```

### Error Handling:
| Status Code | Action |
|-------------|--------|
| 401 | Redirect to login, clear token |
| 403 | Show permission denied message |
| 404 | Show not found, clear from list |
| 500 | Show retry option, log error |
| Network Error | Show offline message, retry on reconnect |

### Authentication:
- Extract JWT token from existing auth context/storage
- Pass token via Socket.IO auth query parameter
- Include token in Authorization header for REST calls
- Handle token refresh/expiration gracefully

---

## 8. WebSocket Integration Strategy

### Connection Lifecycle:
1. **Connect:** On app mount, establish Socket.IO connection with JWT
2. **Listen:** Subscribe to all notification events
3. **Reconnect:** Auto-reconnect with exponential backoff on disconnect
4. **Cleanup:** Disconnect on logout/unmount

### Event Handlers:
| Event | Handler Action |
|-------|----------------|
| `notification:new` | Prepend to list, increment unread count, show toast |
| `notification:read` | Update notification read status, decrement unread count |
| `notification:read_all` | Mark all as read in state, set unread count to 0 |
| `notification:count` | Sync unread count with server value |
| `notification:delete` | Remove from local state |
| `connect` | Update connection status, fetch missed notifications |
| `disconnect` | Update connection status, show reconnecting UI |
| `connect_error` | Log error, show error message to user |

### Reconnection Strategy:
- Socket.IO built-in reconnection with exponential backoff
- Show "Reconnecting..." UI indicator
- Fetch missed notifications after reconnection
- Maximum retry attempts before showing offline state

---

## 9. Testing Strategy

### Unit Tests:
- Type definitions validate correctly
- API service functions return correct data shapes
- Context reducer handles all action types
- Socket event handlers update state correctly

### Integration Tests:
- NotificationProvider initializes correctly with auth
- API calls update context state as expected
- WebSocket events trigger correct state changes
- Components respond to context state changes

### Component Tests:
- NotificationBell shows correct unread count
- NotificationPanel renders list and handles pagination
- NotificationItem displays all fields correctly
- ToastProvider shows and dismisses notifications
- Admin forms validate and submit correctly

### E2E Tests (if applicable):
- User receives real-time notification
- User marks notification as read
- User deletes notification
- Admin broadcasts notification to users
- Preferences save and persist

### Edge Cases:
- No notifications (empty state)
- Network failure during API call
- WebSocket disconnect during session
- Token expiration
- Rapid successive notifications
- Very long notification lists (performance)

---

## 10. Success Criteria

| Criteria | Metric |
|----------|--------|
| **Real-time delivery** | Notifications appear within 1 second of being sent |
| **Accuracy** | Unread count matches server count 100% of the time |
| **Performance** | Notification list renders 100+ items without jank |
| **Reliability** | Auto-reconnects within 5 seconds of disconnect |
| **Accessibility** | WCAG 2.1 AA compliant for all notification components |
| **User Experience** | Toast notifications don't block user interaction |
| **Error Handling** | All error states have user-friendly messages |
| **Mobile** | All components work on screens 320px and up |

---

## 11. Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Token expiration during WebSocket session** | High | Medium | Detect disconnect error, redirect to re-login, restore session after |
| **Socket.IO connection failures** | High | Medium | Fallback to polling for notifications, show offline indicator |
| **State desync with server** | Medium | Medium | Periodic full sync, use server count as source of truth for unread |
| **Memory leaks from WebSocket listeners** | Medium | Low | Proper cleanup in useEffect, limit notification list size |
| **Too many notifications overwhelming UI** | Medium | Low | Pagination, virtual scrolling for large lists |
| **Admin abuse (broadcast spam)** | Low | Low | Rate limiting on backend, UI throttling on frontend |
| **Browser compatibility with Socket.IO** | High | Low | Socket.IO v4 has broad support, test on target browsers |
| **Performance degradation with many open tabs** | Medium | Medium | Use BroadcastChannel API or disable multi-tab notifications |

---

## Next Steps

1. **Review this plan** with team stakeholders
2. **Confirm technical decisions** (Socket.IO version, state management approach)
3. **Prioritize phases** based on business needs
4. **Begin Phase 1** implementation upon approval

---

_Document Version: 1.0_  
_Status: Awaiting Approval_  
_Do not begin implementation until plan is approved._