# Product Requirements Document (PRD)
# SliceMaster Pizza - E2E Website Integration

## Document Information
- **Product Name**: SliceMaster Pizza E2E Website
- **Version**: 1.0
- **Date**: January 2, 2026
- **Author**: BMAD System
- **Status**: Approved

---

## Executive Summary

SliceMaster Pizza requires a complete end-to-end (E2E) integration between the existing frontend (HTML/CSS/JS) and backend (Java Spring Boot) systems. This PRD outlines the requirements for creating a fully functional pizza ordering website with user authentication, real-time menu loading, shopping cart, order processing, and payment integration.

---

## Problem Statement

### Current Situation
- **Frontend**: Static HTML/CSS/JS pizza website with mock data
- **Backend**: Fully functional Spring Boot API (authentication, orders, payments, WebSocket)
- **Gap**: No integration between frontend and backend - they operate independently

### Opportunity
Create a seamless E2E experience where:
1. Users can register/login with JWT authentication
2. Menu loads dynamically from the database
3. Shopping cart persists and syncs with backend
4. Orders are processed with real payment options
5. Real-time order tracking via WebSocket

---

## Goals & Objectives

### Business Goals
1. Enable online pizza ordering with real transactions
2. Support both traditional (PayPal) and crypto payments
3. Provide real-time order status updates
4. Build customer loyalty through user accounts

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2 seconds | Performance monitoring |
| Order Completion Rate | > 85% | Backend analytics |
| User Registration Rate | > 40% of visitors | User metrics |
| Cart Abandonment | < 30% | Funnel analysis |

---

## Target Users

### Primary Personas
1. **Pizza Lovers**
   - Age: 18-45
   - Tech-savvy, expects modern web experience
   - Wants quick ordering with payment flexibility

2. **Crypto Enthusiasts**
   - Prefers cryptocurrency payments
   - Values blockchain transparency
   - Early adopters

---

## Functional Requirements

### FR1: API Integration Layer
- **Priority**: High
- **Description**: Create a centralized API service for all backend communication
- **Acceptance Criteria**:
  - [ ] API configuration with base URL
  - [ ] JWT token management (store, refresh, clear)
  - [ ] Error handling with user-friendly messages
  - [ ] Request/response interceptors

### FR2: User Authentication
- **Priority**: High
- **Description**: Login, register, and session management
- **Acceptance Criteria**:
  - [ ] Login modal with email/password
  - [ ] Registration form with validation
  - [ ] JWT token storage in localStorage
  - [ ] Auto-logout on token expiration
  - [ ] Protected routes for authenticated users

### FR3: Dynamic Menu Loading
- **Priority**: High
- **Description**: Load pizza menu from backend API
- **Acceptance Criteria**:
  - [ ] Fetch pizzas from `/api/v1/pizzas`
  - [ ] Category filtering works with backend data
  - [ ] Loading state while fetching
  - [ ] Error handling if API fails
  - [ ] Image URLs from backend

### FR4: Shopping Cart
- **Priority**: High
- **Description**: Full cart functionality with backend sync
- **Acceptance Criteria**:
  - [ ] Add items to cart (calls `/api/v1/cart/add`)
  - [ ] Update quantities
  - [ ] Remove items
  - [ ] Cart persists across page reloads
  - [ ] Real-time cart total calculation
  - [ ] Cart count badge in header

### FR5: Order Processing
- **Priority**: High
- **Description**: Complete checkout flow
- **Acceptance Criteria**:
  - [ ] Checkout form with delivery address
  - [ ] Order summary before payment
  - [ ] Create order via `/api/v1/orders`
  - [ ] Order confirmation page
  - [ ] Order history for logged-in users

### FR6: Payment Integration
- **Priority**: High
- **Description**: Multiple payment options
- **Acceptance Criteria**:
  - [ ] PayPal button integration
  - [ ] Crypto wallet connection (MetaMask)
  - [ ] Payment status updates
  - [ ] Payment confirmation

### FR7: Real-time Order Tracking
- **Priority**: Medium
- **Description**: WebSocket-based order status updates
- **Acceptance Criteria**:
  - [ ] WebSocket connection to backend
  - [ ] Live order status display
  - [ ] Notifications on status change

### FR8: User Profile
- **Priority**: Medium
- **Description**: User account management
- **Acceptance Criteria**:
  - [ ] View/edit profile
  - [ ] Manage delivery addresses
  - [ ] Order history
  - [ ] Saved payment methods

---

## User Flows

### Flow 1: Guest Browsing → Order
1. User lands on homepage
2. Browses menu (loaded from API)
3. Adds items to cart
4. Clicks checkout → Prompted to login/register
5. Logs in or creates account
6. Enters delivery address
7. Selects payment method
8. Completes payment
9. Receives order confirmation
10. Tracks order in real-time

### Flow 2: Returning Customer
1. User lands on homepage
2. Clicks login (if not auto-logged)
3. Previous cart items restored
4. Continues shopping or checks out
5. Address auto-filled from profile
6. Quick payment with saved method

---

## Technical Architecture

### Frontend Stack
- HTML5, CSS3, JavaScript (ES6+)
- No framework (vanilla JS)
- LocalStorage for client-side state
- WebSocket for real-time features

### Backend Integration Points
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/pizzas` | GET | Fetch menu |
| `/api/v1/cart` | GET/POST/DELETE | Cart operations |
| `/api/v1/orders` | GET/POST | Order operations |
| `/api/v1/payments/*` | POST | Payment processing |
| `/ws/orders` | WebSocket | Real-time updates |

---

## Implementation Phases

### Phase 1: Core Integration (Sprint 1)
- API service layer
- Authentication (login/register)
- Dynamic menu loading

### Phase 2: Cart & Orders (Sprint 2)
- Shopping cart functionality
- Checkout flow
- Order creation

### Phase 3: Payments (Sprint 3)
- PayPal integration
- Crypto payments
- Payment confirmation

### Phase 4: Real-time & Polish (Sprint 4)
- WebSocket order tracking
- User profile
- UI/UX improvements

---

## Dependencies
- Backend must be running on `localhost:8080`
- PostgreSQL database configured
- PayPal sandbox credentials
- Web3 provider (for crypto)

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CORS issues | High | Medium | Configure backend CORS properly |
| JWT expiration | Medium | High | Implement refresh token logic |
| Payment failures | High | Low | Comprehensive error handling |
| WebSocket disconnects | Medium | Medium | Auto-reconnect logic |

---

## Appendix

### API Response Formats
```json
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### JWT Token Structure
```
Authorization: Bearer <token>
```

Stored in: `localStorage.setItem('jwt_token', token)`
