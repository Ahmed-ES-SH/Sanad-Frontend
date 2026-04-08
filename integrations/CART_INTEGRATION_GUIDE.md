# Cart Integration Guide

## Overview

This cart system provides:
- **Backend-synced cart** for authenticated users
- **Local storage guest cart** for unauthenticated users
- **Automatic merge** after login
- **Optimistic UI updates** for better UX
- **Full CRUD operations** with error handling

---

## Architecture

```
Frontend:
├── app/context/CartContext.tsx          # React Context for state
├── app/actions/cartActions.ts           # Server Actions
├── lib/api/cart/index.ts                # API client functions
├── lib/hooks/useCartIntegration.ts      # Integration hooks
└── app/constants/endpoints.ts           # API endpoints

Backend (NestJS):
├── GET    /api/cart                     # Fetch user's cart
├── POST   /api/cart/items               # Add item to cart
├── PUT    /api/cart/items/:itemId       # Update item quantity
├── DELETE /api/cart/items/:itemId       # Remove item from cart
├── DELETE /api/cart                     # Clear cart
└── POST   /api/cart/merge               # Merge guest cart after login
```

---

## Setup

### 1. Wrap your app with CartProvider

```tsx
// app/layout.tsx or your root layout
import { CartProvider } from '@/app/context/CartContext';
import { AuthProvider } from '@/app/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
```

### 2. Auto-merge guest cart on login

```tsx
// Your login page or component
import { useGuestCartMerge } from '@/lib/hooks/useCartIntegration';

function LoginPage() {
  useGuestCartMerge(); // Automatically merges guest cart after login
  
  // Your login logic
}
```

---

## Usage Examples

### Basic Cart Usage

```tsx
'use client';

import { useCart } from '@/app/context/CartContext';

function CartIcon() {
  const { totalItems, totalAmount } = useCart();
  
  return (
    <div>
      <span>🛒 Cart ({totalItems})</span>
      <span>${totalAmount.toFixed(2)}</span>
    </div>
  );
}
```

### Add to Cart Button

```tsx
'use client';

import { useCart } from '@/app/context/CartContext';

function AddToCartButton({ serviceId }: { serviceId: string }) {
  const { addItem, isServiceInCart, getItemQuantity, isLoading } = useCart();
  const isInCart = isServiceInCart(serviceId);
  const quantity = getItemQuantity(serviceId);
  
  const handleAdd = async () => {
    try {
      await addItem(serviceId, 1);
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };
  
  return (
    <button 
      onClick={handleAdd}
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : isInCart ? `In Cart (${quantity})` : 'Add to Cart'}
    </button>
  );
}
```

### Cart Page

```tsx
'use client';

import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { 
    items, 
    totalItems, 
    totalAmount,
    updateItemQuantity,
    removeItem,
    clearCart,
    isLoading 
  } = useCart();
  
  if (isLoading) {
    return <div>Loading cart...</div>;
  }
  
  if (items.length === 0) {
    return (
      <div>
        <h2>Your cart is empty</h2>
        <a href="/services">Browse Services</a>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Shopping Cart ({totalItems} items)</h2>
      
      <div>
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.serviceIconUrl || '/default-icon.svg'} alt={item.serviceTitle} />
            <div>
              <h3>{item.serviceTitle}</h3>
              <p>${item.unitPrice.toFixed(2)} each</p>
            </div>
            
            <div>
              <button 
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            
            <p>${item.subtotal.toFixed(2)}</p>
            
            <button onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        <button onClick={clearCart}>Clear Cart</button>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
}
```

### Service Card with Cart Integration

```tsx
'use client';

import { useCart } from '@/app/context/CartContext';

function ServiceCard({ service }: { service: any }) {
  const { 
    addItem, 
    isServiceInCart, 
    getItemQuantity,
    incrementItemQuantity,
    decrementItemQuantity 
  } = useCart();
  
  const isInCart = isServiceInCart(service.id);
  const quantity = getItemQuantity(service.id);
  
  const handleAdd = async () => {
    try {
      await addItem(service.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };
  
  if (!isInCart) {
    return (
      <div className="service-card">
        <h3>{service.title}</h3>
        <p>${service.basePrice}</p>
        <button onClick={handleAdd}>Add to Cart</button>
      </div>
    );
  }
  
  return (
    <div className="service-card in-cart">
      <h3>{service.title}</h3>
      <p>${service.basePrice}</p>
      
      <div className="quantity-controls">
        <button onClick={() => decrementItemQuantity(service.id)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => incrementItemQuantity(service.id)}>+</button>
      </div>
    </div>
  );
}
```

---

## API Functions

### Direct API Calls (for server components)

```tsx
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  mergeCart 
} from '@/lib/api/cart';

// In server component or action
async function serverAction() {
  const cart = await getCart();
  // ...
}
```

### Server Actions (for client components)

```tsx
import { 
  addToCartAction,
  removeFromCartAction,
  updateCartItemAction,
  clearCartAction,
  mergeCartAction
} from '@/app/actions/cartActions';

// In client component
async function handleSubmit() {
  await addToCartAction(serviceId, quantity);
}
```

---

## Key Features

### 1. Guest Cart (Unauthenticated Users)

- Cart items are stored in localStorage
- Automatically syncs with backend after login
- No backend API calls until authentication

### 2. Authenticated Cart

- All operations sync with backend immediately
- JWT token included automatically
- One cart per user (enforced by backend)

### 3. Cart Merge Flow

```
1. User adds items as guest → stored in localStorage
2. User logs in
3. useGuestCartMerge() detects authentication
4. Calls POST /api/cart/merge with guest items
5. Backend merges items (handles duplicates)
6. Frontend updates with merged cart
7. Guest cart cleared from localStorage
```

### 4. Quantity Limits

- Minimum: 1 (below this removes the item)
- Maximum: 99 per item (enforced in context)

### 5. Error Handling

- All operations wrapped in try/catch
- Error state available in context
- Console logging for debugging

---

## Context API Reference

### State

| Property     | Type        | Description                    |
|-------------|-------------|--------------------------------|
| `cart`      | Cart \| null | Full cart object from backend  |
| `items`     | CartItem[]   | Array of cart items            |
| `isLoading` | boolean      | Loading state                  |
| `error`     | string \| null | Last error message            |

### Computed Values

| Property       | Type    | Description                    |
|---------------|---------|--------------------------------|
| `totalItems`  | number  | Total quantity of all items    |
| `totalAmount` | number  | Total price (from backend)     |

### Operations

| Method                      | Description                        | Async |
|----------------------------|------------------------------------|-------|
| `fetchCart()`              | Fetch cart from backend            | Yes   |
| `addItem(serviceId, qty)`  | Add service to cart                | Yes   |
| `removeItem(itemId)`       | Remove item from cart              | Yes   |
| `updateItemQuantity(id, qty)` | Set item quantity              | Yes   |
| `incrementItemQuantity(id)` | Increase quantity by 1           | Yes   |
| `decrementItemQuantity(id)` | Decrease quantity by 1           | Yes   |
| `clearCart()`              | Remove all items                   | Yes   |
| `mergeGuestCartAfterLogin()` | Merge guest cart after login     | Yes   |

### Utility Functions

| Method                        | Description                    |
|------------------------------|--------------------------------|
| `isServiceInCart(serviceId)` | Check if service is in cart    |
| `getItemByServiceId(id)`     | Get item by service ID         |
| `getItemQuantity(serviceId)` | Get quantity of a service      |

---

## Data Types

### Cart

```typescript
interface Cart {
  id: string;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
```

### CartItem

```typescript
interface CartItem {
  id: string;
  cartId: string;
  serviceId: string;
  serviceTitle: string;
  serviceSlug: string;
  serviceIconUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Best Practices

1. **Always use try/catch** when calling async cart operations
2. **Show loading states** during cart operations
3. **Provide user feedback** (toasts, notifications)
4. **Use `isServiceInCart`** to update button states
5. **Call `useGuestCartMerge()`** in your login flow
6. **Don't trust client prices** - backend validates on merge
7. **Handle partial merges** - check `failedItems` in merge response

---

## Troubleshooting

### Cart not syncing with backend

- Check authentication status
- Verify JWT token is valid
- Check network requests in dev tools
- Review console for error messages

### Guest cart not merging after login

- Ensure `useGuestCartMerge()` is called
- Check localStorage for `sanad_guest_cart` key
- Verify backend merge endpoint is working

### Items showing quantity 0

- Backend enforces minimum quantity of 1
- Items with quantity 0 are automatically removed

---

## Next Steps

- [ ] Add toast notifications for cart actions
- [ ] Implement cart persistence across sessions
- [ ] Add cart expiration logic
- [ ] Integrate with checkout flow
- [ ] Add wishlist functionality
- [ ] Implement cart sharing
