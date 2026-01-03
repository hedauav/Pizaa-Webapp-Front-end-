# Epic & Stories - E2E Integration

## Epic 1: API Integration Foundation

### Story 1.1: Create API Configuration Module
**As a** developer  
**I want** a centralized API configuration  
**So that** all API calls use consistent settings

**Acceptance Criteria:**
- [ ] Base URL configurable
- [ ] Default headers setup
- [ ] JWT token management
- [ ] Error handling utilities

**Story Points:** 3

---

### Story 1.2: Create API Service Layer
**As a** developer  
**I want** reusable API methods  
**So that** I can make consistent backend calls

**Acceptance Criteria:**
- [ ] GET, POST, PUT, DELETE methods
- [ ] Automatic token inclusion
- [ ] Response parsing
- [ ] Error handling with user messages

**Story Points:** 5

---

## Epic 2: User Authentication

### Story 2.1: Create Auth Modal UI
**As a** user  
**I want** login and register forms  
**So that** I can create an account or sign in

**Acceptance Criteria:**
- [ ] Modal with login form
- [ ] Register form toggle
- [ ] Form validation
- [ ] Loading states
- [ ] Error display

**Story Points:** 5

---

### Story 2.2: Implement Login Functionality
**As a** user  
**I want** to login with email/password  
**So that** I can access my account

**Acceptance Criteria:**
- [ ] Call login API
- [ ] Store JWT token
- [ ] Update UI to logged-in state
- [ ] Handle invalid credentials

**Story Points:** 3

---

### Story 2.3: Implement Registration Functionality
**As a** user  
**I want** to create a new account  
**So that** I can order pizzas

**Acceptance Criteria:**
- [ ] Validate all fields
- [ ] Call register API
- [ ] Auto-login after registration
- [ ] Handle duplicate email

**Story Points:** 3

---

### Story 2.4: Session Management
**As a** user  
**I want** to stay logged in  
**So that** I don't have to login every time

**Acceptance Criteria:**
- [ ] Check token on page load
- [ ] Validate token with backend
- [ ] Auto-logout on expiration
- [ ] Logout button functionality

**Story Points:** 3

---

## Epic 3: Dynamic Menu

### Story 3.1: Load Menu from Backend
**As a** user  
**I want** to see the current pizza menu  
**So that** I can choose what to order

**Acceptance Criteria:**
- [ ] Fetch pizzas from API
- [ ] Display in existing grid
- [ ] Show loading state
- [ ] Handle API errors

**Story Points:** 5

---

### Story 3.2: Category Filtering
**As a** user  
**I want** to filter pizzas by category  
**So that** I can find what I want quickly

**Acceptance Criteria:**
- [ ] Load categories from backend
- [ ] Filter works with dynamic data
- [ ] Smooth transitions
- [ ] "All" category shows everything

**Story Points:** 3

---

## Epic 4: Shopping Cart

### Story 4.1: Add to Cart Functionality
**As a** user  
**I want** to add pizzas to my cart  
**So that** I can order them

**Acceptance Criteria:**
- [ ] Add button on each pizza
- [ ] Call cart API (if logged in)
- [ ] Store locally (if guest)
- [ ] Show success feedback
- [ ] Update cart count

**Story Points:** 5

---

### Story 4.2: Cart Sidebar/Modal
**As a** user  
**I want** to view my cart  
**So that** I can see what I'm ordering

**Acceptance Criteria:**
- [ ] Cart icon with count badge
- [ ] Slide-out cart panel
- [ ] List all items with images
- [ ] Show totals
- [ ] Checkout button

**Story Points:** 5

---

### Story 4.3: Update Cart Items
**As a** user  
**I want** to change quantities or remove items  
**So that** I can adjust my order

**Acceptance Criteria:**
- [ ] Quantity +/- buttons
- [ ] Remove item button
- [ ] Sync with backend
- [ ] Update totals in real-time

**Story Points:** 3

---

### Story 4.4: Cart Persistence
**As a** user  
**I want** my cart to persist  
**So that** I don't lose my selections

**Acceptance Criteria:**
- [ ] Guest cart in localStorage
- [ ] Merge cart on login
- [ ] Restore cart on page reload

**Story Points:** 3

---

## Epic 5: Checkout & Orders

### Story 5.1: Checkout Page/Modal
**As a** user  
**I want** a checkout form  
**So that** I can complete my order

**Acceptance Criteria:**
- [ ] Delivery address form
- [ ] Order summary display
- [ ] Payment method selection
- [ ] Place order button

**Story Points:** 5

---

### Story 5.2: Address Management
**As a** user  
**I want** to save delivery addresses  
**So that** I don't re-enter them

**Acceptance Criteria:**
- [ ] Add new address
- [ ] Select from saved addresses
- [ ] Set default address
- [ ] Edit/delete addresses

**Story Points:** 5

---

### Story 5.3: Order Creation
**As a** user  
**I want** to create an order  
**So that** my pizza gets made

**Acceptance Criteria:**
- [ ] Validate cart not empty
- [ ] Send order to backend
- [ ] Receive order confirmation
- [ ] Clear cart after order

**Story Points:** 3

---

### Story 5.4: Order History
**As a** user  
**I want** to see my past orders  
**So that** I can reorder or check status

**Acceptance Criteria:**
- [ ] Order history page/modal
- [ ] List orders with status
- [ ] Order details view
- [ ] Reorder functionality

**Story Points:** 5

---

## Epic 6: Payment Integration

### Story 6.1: PayPal Integration
**As a** user  
**I want** to pay with PayPal  
**So that** I can use my preferred payment

**Acceptance Criteria:**
- [ ] PayPal button displays
- [ ] Opens PayPal flow
- [ ] Captures payment
- [ ] Updates order status

**Story Points:** 8

---

### Story 6.2: Crypto Payment (MetaMask)
**As a** user  
**I want** to pay with cryptocurrency  
**So that** I can use my crypto wallet

**Acceptance Criteria:**
- [ ] Connect wallet button
- [ ] Show crypto amount
- [ ] Process transaction
- [ ] Verify on blockchain

**Story Points:** 8

---

## Epic 7: Real-time Features

### Story 7.1: WebSocket Connection
**As a** user  
**I want** real-time updates  
**So that** I know my order status

**Acceptance Criteria:**
- [ ] Connect to WebSocket
- [ ] Handle reconnection
- [ ] Parse status messages

**Story Points:** 5

---

### Story 7.2: Order Tracking UI
**As a** user  
**I want** to track my order  
**So that** I know when it's arriving

**Acceptance Criteria:**
- [ ] Order status display
- [ ] Progress indicators
- [ ] Estimated time
- [ ] Notifications

**Story Points:** 5

---

## Sprint Plan

### Sprint 1 (Stories: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4)
- API Foundation
- Authentication
- **Total Points:** 22

### Sprint 2 (Stories: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4)
- Dynamic Menu
- Shopping Cart
- **Total Points:** 24

### Sprint 3 (Stories: 5.1, 5.2, 5.3, 5.4, 6.1)
- Checkout
- Orders
- PayPal Payment
- **Total Points:** 26

### Sprint 4 (Stories: 6.2, 7.1, 7.2)
- Crypto Payment
- Real-time Features
- **Total Points:** 18
