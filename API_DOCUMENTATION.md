# SliceMaster Pizza API Documentation

## Base URL
```
http://localhost:8081/api/v1
```

## Authentication

All endpoints (except auth endpoints) require JWT token in header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Pizza Endpoints

### Get All Pizzas
```http
GET /pizzas
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Margherita",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 12.99,
    "imageUrl": "/images/margherita.jpg",
    "isAvailable": true,
    "isVegetarian": true,
    "calories": 800,
    "rating": 4.5
  }
]
```

### Get Pizza by ID
```http
GET /pizzas/{id}
```

### Create Pizza (Admin Only)
```http
POST /pizzas
```

**Request Body:**
```json
{
  "name": "Supreme Pizza",
  "description": "Loaded with toppings",
  "price": 15.99,
  "imageUrl": "/images/supreme.jpg",
  "isVegetarian": false,
  "calories": 1200
}
```

## Cart Endpoints

### Get User Cart
```http
GET /cart
```

**Response:**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "pizza": {
        "id": 1,
        "name": "Margherita",
        "price": 12.99
      },
      "quantity": 2,
      "size": "MEDIUM"
    }
  ],
  "totalAmount": 25.98
}
```

### Add Item to Cart
```http
POST /cart/add
```

**Request Body:**
```json
{
  "pizzaId": 1,
  "quantity": 2,
  "size": "LARGE"
}
```

### Update Cart Item
```http
PUT /cart/items/{itemId}
```

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
```http
DELETE /cart/items/{itemId}
```

### Clear Cart
```http
DELETE /cart/clear
```

## Order Endpoints

### Create Order
```http
POST /orders
```

**Request Body:**
```json
{
  "deliveryAddressId": 1,
  "paymentMethod": "CASH_ON_DELIVERY",
  "customerNote": "Ring doorbell twice"
}
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-20260106-0001",
  "status": "PENDING",
  "total": 25.98,
  "estimatedDeliveryTime": "2026-01-06T14:30:00",
  "items": [...]
}
```

### Get User Orders
```http
GET /orders
```

### Get Order by ID
```http
GET /orders/{id}
```

### Cancel Order
```http
PUT /orders/{id}/cancel
```

## Address Endpoints

### Get User Addresses
```http
GET /addresses
```

### Add Address
```http
POST /addresses
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "streetAddress": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "type": "HOME",
  "isDefault": true
}
```

### Update Address
```http
PUT /addresses/{id}
```

### Delete Address
```http
DELETE /addresses/{id}
```

## Admin Endpoints

### Get All Orders (Admin)
```http
GET /admin/orders
```

### Update Order Status (Admin)
```http
PUT /admin/orders/{id}/status
```

**Request Body:**
```json
{
  "status": "PREPARING"
}
```

**Order Statuses:**
- PENDING
- CONFIRMED
- PREPARING
- BAKING
- READY_FOR_PICKUP
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
- REFUNDED

### Get All Users (Admin)
```http
GET /admin/users
```

## Payment Methods

- `CASH_ON_DELIVERY`
- `PAYPAL`
- `CRYPTO_MATIC`
- `CRYPTO_USDT`
- `CRYPTO_USDC`
- `CRYPTO_ETH`

## WebSocket Endpoints

### Order Status Updates
```
ws://localhost:8081/ws
```

**Subscribe to order updates:**
```javascript
const stompClient = new StompJs.Client({
  brokerURL: 'ws://localhost:8081/ws'
});

stompClient.onConnect = () => {
  stompClient.subscribe('/topic/orders/{orderId}', (message) => {
    const update = JSON.parse(message.body);
    console.log('Order update:', update);
  });
};
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data",
  "errors": ["Email is required", "Password must be at least 8 characters"]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials or token expired"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin privileges required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Testing

Use the provided Postman collection or curl commands:

```bash
# Login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@slicemaster.com","password":"admin123"}'

# Get pizzas
curl http://localhost:8081/api/v1/pizzas \
  -H "Authorization: Bearer YOUR_TOKEN"
```
