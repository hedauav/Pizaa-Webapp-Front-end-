# 🍕 SliceMaster Pizza - Full Stack Web Application

A modern, feature-rich pizza ordering platform built with Spring Boot and vanilla JavaScript, featuring real-time order tracking, secure payments, and comprehensive testing.

## 🚀 Features

- **User Authentication** - JWT-based secure login/registration
- **Pizza Menu** - Browse and filter pizzas by category
- **Shopping Cart** - Add, update, and remove items
- **Order Management** - Place orders with multiple payment methods
- **Real-time Updates** - WebSocket integration for order tracking
- **Admin Dashboard** - Manage pizzas, orders, and users
- **Payment Integration** - PayPal and Crypto payment support
- **H2 Database** - In-memory database for development
- **E2E Testing** - Comprehensive Playwright test suite

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.2.1
- Spring Security (JWT)
- Spring Data JPA
- H2 Database
- WebSocket Support
- Maven

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Responsive Design
- Real-time WebSocket
- REST API Integration

### Testing
- Playwright E2E Tests
- JUnit (Backend)
- Automated Test Reports

## 📋 Prerequisites

- Java JDK 21+
- Maven 3.9+
- Node.js & npm
- Modern web browser

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hedauav/Pizaa-Webapp-Front-end-.git
cd Pizza
```

### 2. Build Backend
```bash
cd SliceMaster-Backend
mvn clean package -DskipTests
```

### 3. Start Backend Server
```bash
java -jar target/pizzeria-backend-1.0.0.jar
```
Backend runs on: `http://localhost:8081`

### 4. Start Frontend Server
```bash
cd Pizaa-Webapp-Front-end-
npx http-server -p 5500 --cors
```
Frontend runs on: `http://localhost:5500`

## 🎮 Quick Start Scripts

### Windows PowerShell
```powershell
# Start both servers
.\RUN-FULL-SYSTEM.ps1

# Or use Maven for backend
.\START-ALL.ps1
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Pizzas
- `GET /api/v1/pizzas` - Get all pizzas
- `GET /api/v1/pizzas/{id}` - Get pizza by ID
- `POST /api/v1/pizzas` - Create pizza (Admin)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `DELETE /api/v1/cart/items/{id}` - Remove item

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/{id}` - Get order details

## 🗄️ Database Access

H2 Console: `http://localhost:8081/h2-console`

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:slicemaster_db`
- Username: `sa`
- Password: (leave empty)

## 🧪 Running Tests

### E2E Tests (Playwright)
```bash
npx playwright test
```

### View Test Report
```bash
npx playwright show-report
```

### Run Specific Test
```bash
npx playwright test tests/auth.spec.js
```

## 📁 Project Structure

```
Pizza/
├── SliceMaster-Backend/          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/slicemaster/pizzeria/
│   │   │   │   ├── controller/   # REST Controllers
│   │   │   │   ├── service/      # Business Logic
│   │   │   │   ├── model/        # JPA Entities
│   │   │   │   ├── repository/   # Data Access
│   │   │   │   ├── security/     # JWT & Security
│   │   │   │   └── config/       # Configuration
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── data.sql      # Sample Data
│   ├── pom.xml
│   └── target/
├── Pizaa-Webapp-Front-end-/      # Frontend
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── js/
│   │   ├── api.js                # API Service
│   │   ├── auth.js               # Authentication
│   │   ├── cart.js               # Cart Management
│   │   ├── checkout.js           # Checkout Flow
│   │   ├── menu.js               # Menu Display
│   │   ├── order.js              # Order Management
│   │   ├── websocket.js          # Real-time Updates
│   │   └── config.js             # Configuration
│   └── css/
│       └── components.css
├── tests/                         # E2E Tests
│   ├── auth.spec.js
│   ├── cart.spec.js
│   ├── menu.spec.js
│   ├── e2e-flow.spec.js
│   └── e2e/
│       └── slicemaster.spec.js
├── playwright.config.js
└── package.json
```

## 🎯 Default Credentials

### Admin User
- Email: `admin@slicemaster.com`
- Password: `admin123`

### Test User
- Email: `john.doe@example.com`
- Password: `password123`

## 🔒 Security Features

- JWT Token Authentication
- Password Encryption (BCrypt)
- CORS Configuration
- SQL Injection Prevention
- XSS Protection

## 🌟 Payment Methods

- Cash on Delivery (COD)
- PayPal Integration
- Cryptocurrency (MATIC, USDT, USDC, ETH)

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Development Team** - SliceMaster Pizza

## 🙏 Acknowledgments

- Spring Boot Team
- Playwright Testing Framework
- All contributors and testers

## 📞 Support

For support, email support@slicemaster.com or open an issue.

---

**Made with ❤️ by the SliceMaster Team**
