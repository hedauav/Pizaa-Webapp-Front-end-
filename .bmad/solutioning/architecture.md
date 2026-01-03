# Technical Architecture Document
# SliceMaster Pizza - E2E Integration

## Document Information
- **Version**: 1.0
- **Date**: January 2, 2026
- **Status**: Approved

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SLICEMASTER E2E ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Browser)                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   index.html │  │  styles.css  │  │  script.js   │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                              │                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    api.js (API Service Layer)                │   │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │   │
│  │  │  │  Auth   │  │  Menu   │  │  Cart   │  │  Orders/Payment │ │   │   │
│  │  │  │ Service │  │ Service │  │ Service │  │    Services     │ │   │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                              │                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │              app.js (Main Application Controller)            │   │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │   │
│  │  │  │  Auth   │  │  Menu   │  │  Cart   │  │  Order Tracking │ │   │   │
│  │  │  │   UI    │  │   UI    │  │   UI    │  │       UI        │ │   │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                     HTTP REST + WebSocket                                   │
│                              │                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    BACKEND (Spring Boot - Port 8080)                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                      Controllers Layer                       │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐│   │   │
│  │  │  │   Auth   │ │  Pizza   │ │   Cart   │ │  Order/Payment   ││   │   │
│  │  │  │Controller│ │Controller│ │Controller│ │   Controllers    ││   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘│   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                       Services Layer                         │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐│   │   │
│  │  │  │  Auth    │ │  Pizza   │ │   Cart   │ │  Order/Payment   ││   │   │
│  │  │  │ Service  │ │ Service  │ │ Service  │ │    Services      ││   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘│   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Repository Layer (JPA)                    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                               │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │ Users  │ │ Pizzas │ │ Carts  │ │ Orders │ │Reviews │ │Payments│ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    External Services                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│   │
│  │  │  PayPal  │  │  Twilio  │  │  Email   │  │  Polygon Blockchain  ││   │
│  │  │  (Pay)   │  │  (SMS)   │  │  (SMTP)  │  │   (Crypto Payments)  ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Frontend File Structure

```
Pizaa-Webapp-Front-end-/
├── index.html              # Main HTML (updated with modals)
├── styles.css              # Styles (updated with new components)
├── script.js               # Original UI interactions
├── js/
│   ├── config.js           # API configuration
│   ├── api.js              # API service layer
│   ├── auth.js             # Authentication module
│   ├── menu.js             # Menu/pizza module
│   ├── cart.js             # Shopping cart module
│   ├── checkout.js         # Checkout/order module
│   ├── payment.js          # Payment integration
│   ├── websocket.js        # Real-time updates
│   └── app.js              # Main app initialization
├── css/
│   └── components.css      # Additional component styles
└── images/                 # Existing images
```

---

## API Endpoints Used

### Authentication
| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/v1/auth/register` | POST | `{firstName, lastName, email, phone, password}` | `{token, user}` |
| `/api/v1/auth/login` | POST | `{email, password}` | `{token, user}` |
| `/api/v1/auth/me` | GET | - | `{user}` |

### Menu
| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/v1/pizzas` | GET | - | `[{id, name, price, ...}]` |
| `/api/v1/pizzas/{id}` | GET | - | `{pizza}` |
| `/api/v1/categories` | GET | - | `[{id, name, slug}]` |

### Cart
| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/v1/cart` | GET | - | `{items, total}` |
| `/api/v1/cart/add` | POST | `{pizzaId, quantity, size}` | `{cart}` |
| `/api/v1/cart/update` | PUT | `{itemId, quantity}` | `{cart}` |
| `/api/v1/cart/remove/{id}` | DELETE | - | `{cart}` |
| `/api/v1/cart/clear` | DELETE | - | `{success}` |

### Orders
| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/v1/orders` | GET | - | `[{orders}]` |
| `/api/v1/orders` | POST | `{addressId, paymentMethod, items}` | `{order}` |
| `/api/v1/orders/{id}` | GET | - | `{order}` |

### Payments
| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/api/v1/payments/paypal/create` | POST | `{orderId}` | `{paypalOrderId}` |
| `/api/v1/payments/paypal/capture` | POST | `{paypalOrderId}` | `{confirmation}` |
| `/api/v1/payments/crypto/initiate` | POST | `{orderId, currency}` | `{walletAddress, amount}` |
| `/api/v1/payments/crypto/verify` | POST | `{txHash}` | `{verified}` |

### WebSocket
| Endpoint | Purpose |
|----------|---------|
| `/ws/orders` | Real-time order status updates |

---

## Data Flow Diagrams

### Authentication Flow
```
User                   Frontend                  Backend                    DB
 │                        │                         │                        │
 │──Enter credentials────>│                         │                        │
 │                        │──POST /auth/login──────>│                        │
 │                        │                         │──Verify credentials───>│
 │                        │                         │<──User data────────────│
 │                        │                         │──Generate JWT──────────│
 │                        │<──{token, user}─────────│                        │
 │                        │──Store in localStorage──│                        │
 │<──Show logged in state─│                         │                        │
```

### Order Flow
```
User                   Frontend                  Backend                    PayPal
 │                        │                         │                          │
 │──Click Checkout───────>│                         │                          │
 │                        │──POST /orders───────────>│                         │
 │                        │<──{orderId, total}──────│                          │
 │                        │──POST /payments/paypal──>│                         │
 │                        │                         │──Create PayPal order────>│
 │                        │<──{paypalOrderId}───────│<─────────────────────────│
 │<──Show PayPal button───│                         │                          │
 │──Approve payment──────>│                         │                          │
 │                        │──POST /paypal/capture──>│                          │
 │                        │                         │──Capture payment────────>│
 │                        │<──{confirmation}────────│<─────────────────────────│
 │<──Order confirmed──────│                         │                          │
```

---

## Security Considerations

1. **JWT Tokens**: Stored in localStorage, included in Authorization header
2. **CORS**: Backend configured to accept requests from frontend origin
3. **Input Validation**: All user inputs validated on both frontend and backend
4. **HTTPS**: Production deployment must use HTTPS
5. **XSS Prevention**: Sanitize all user-generated content before display

---

## State Management

### LocalStorage Keys
| Key | Purpose | Type |
|-----|---------|------|
| `jwt_token` | Authentication token | String |
| `user` | Current user info | JSON |
| `cart` | Cart items (guest) | JSON |
| `pending_cart` | Cart before login | JSON |

### Application State
```javascript
const AppState = {
    isAuthenticated: false,
    user: null,
    cart: { items: [], total: 0 },
    currentOrder: null,
    wsConnected: false
};
```

---

## Error Handling Strategy

```javascript
// Error codes and user messages
const ERROR_MESSAGES = {
    'AUTH_INVALID': 'Invalid email or password',
    'AUTH_EXPIRED': 'Session expired. Please login again',
    'CART_EMPTY': 'Your cart is empty',
    'ORDER_FAILED': 'Failed to create order. Please try again',
    'PAYMENT_FAILED': 'Payment failed. Please try again',
    'NETWORK_ERROR': 'Connection error. Please check your internet',
    'SERVER_ERROR': 'Server error. Please try again later'
};
```

---

## Performance Optimizations

1. **Lazy Loading**: Load non-critical JS modules on demand
2. **Caching**: Cache menu data for 5 minutes
3. **Debouncing**: Debounce search and filter inputs
4. **Image Optimization**: Use appropriate image sizes
5. **Minification**: Minify JS/CSS for production

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)
