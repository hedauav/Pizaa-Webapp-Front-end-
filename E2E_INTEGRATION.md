# SliceMaster Pizza - E2E Integration Guide

## 🎯 Overview

This document describes the End-to-End (E2E) integration between the SliceMaster Pizza frontend and backend.

## 📁 New Files Created

### JavaScript Modules (`js/` folder)

| File | Purpose |
|------|---------|
| `config.js` | API configuration, token management, error messages |
| `api.js` | REST API service layer with all endpoint methods |
| `auth.js` | Authentication (login/register) modal and session management |
| `menu.js` | Dynamic pizza menu loading from backend |
| `cart.js` | Shopping cart sidebar with backend sync |
| `checkout.js` | 3-step checkout process (address → payment → confirm) |
| `websocket.js` | Real-time order tracking via WebSocket |
| `order.js` | Order history, tracking, and reorder functionality |
| `app.js` | Main app initialization with toast notifications |

### CSS (`css/` folder)

| File | Purpose |
|------|---------|
| `components.css` | Styles for all new UI components |

## 🔧 Configuration

### Backend API URL

Edit `js/config.js` to change the backend URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',  // Change this for production
    // ...
};
```

### WebSocket URL

Also in `js/config.js`:

```javascript
WS_URL: 'ws://localhost:8080/ws',  // Change for production
```

## 🚀 How to Use

### Prerequisites

1. **Start the Backend Server**
   ```bash
   cd SliceMaster-Backend
   mvn spring-boot:run
   ```
   The backend runs on `http://localhost:8080`

2. **Open the Frontend**
   - Open `index.html` in a browser
   - Or use a local server like Live Server extension

### Features

#### 1. User Authentication
- Click "Sign In" in the navbar
- Register a new account or login
- JWT tokens are stored in localStorage

#### 2. Menu
- Pizzas load dynamically from the backend API
- Filter by category (All, Popular, Classics, Specialty, Vegetarian)
- Fallback to static content if API fails

#### 3. Cart
- Click cart icon in navbar to open sidebar
- Add items from menu
- Adjust quantities
- Cart syncs with backend when logged in

#### 4. Checkout
- Click "Proceed to Checkout" from cart
- Step 1: Select/add delivery address
- Step 2: Choose payment method (COD, PayPal, Crypto)
- Step 3: Review and confirm order

#### 5. Order Tracking
- Real-time updates via WebSocket
- Status timeline: Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered

#### 6. Order History
- Click user avatar → "My Orders"
- View past orders
- Track active orders
- Reorder functionality

## 📡 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Menu
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas/category/{category}` - Filter by category
- `GET /api/categories` - Get categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/{id}` - Update cart item
- `DELETE /api/cart/item/{id}` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details

### Addresses
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address

## 🎨 UI Components

### Toast Notifications
```javascript
Toast.success('Order placed successfully!');
Toast.error('Something went wrong');
Toast.warning('Please login first');
Toast.info('Your order is being prepared');
```

### Modals
- **Auth Modal**: Login/Register forms
- **Checkout Modal**: 3-step checkout process
- **Order Modal**: Order history & tracking

### Cart Sidebar
- Slide-in from right
- Item management
- Order summary

## 🔒 Security

- JWT tokens stored in localStorage
- Token included in Authorization header
- Auto-logout on token expiration
- CORS enabled on backend for localhost

## 📱 Responsive Design

All new components are fully responsive:
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly interactions

## 🐛 Debugging

### Console Logs
Enable verbose logging in `js/config.js`:
```javascript
DEBUG: true
```

### Common Issues

1. **CORS Errors**: Ensure backend has CORS enabled for your frontend URL
2. **Connection Refused**: Make sure backend is running on port 8080
3. **401 Unauthorized**: Check if JWT token is valid/expired

## 📋 BMAD Phase Completion

This implementation completes BMAD Phase 4 (Implementation) with:
- ✅ 9 JavaScript modules
- ✅ 1 CSS component file
- ✅ Updated index.html with modals and scripts
- ✅ Full E2E integration with backend APIs
- ✅ Real-time WebSocket support

---

*Generated following BMAD methodology - Breakthrough Method for Agile AI-Driven Development*
