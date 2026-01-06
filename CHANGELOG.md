# Changelog

All notable changes to SliceMaster Pizza will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- User profile management with avatar upload
- Real-time order tracking with map integration
- Email notifications for order status
- Loyalty points and rewards system
- Advanced pizza customization
- Admin analytics dashboard
- Mobile app development

## [1.0.0] - 2026-01-06

### Added
- Complete full-stack pizza ordering platform
- User authentication with JWT
- Pizza menu browsing and filtering
- Shopping cart functionality
- Order management system
- Multiple payment methods (COD, PayPal, Crypto)
- Real-time order updates via WebSocket
- Admin dashboard for managing pizzas and orders
- H2 in-memory database for development
- Comprehensive E2E testing with Playwright
- RESTful API with Spring Boot
- Responsive frontend design
- Security features (CORS, XSS protection, CSRF tokens)
- API documentation
- Deployment guides
- Contributing guidelines
- Security policy

### Backend Features
- Spring Boot 3.2.1 framework
- Spring Security with JWT authentication
- Spring Data JPA for database operations
- WebSocket support for real-time updates
- BCrypt password encryption
- Role-based access control (USER, ADMIN, DELIVERY_PERSON)
- Comprehensive error handling
- RESTful API endpoints
- Database seeding with sample data

### Frontend Features
- Vanilla JavaScript (ES6+)
- Responsive CSS design
- Real-time cart updates
- User authentication UI
- Pizza filtering by category
- Order history view
- Checkout flow with address management
- Payment method selection
- WebSocket integration for live updates

### Testing
- Playwright E2E test suite
- 43 comprehensive test scenarios
- Authentication tests
- Cart functionality tests
- Menu display tests
- Complete user journey tests
- Test reports and screenshots

### Documentation
- README with setup instructions
- API documentation with all endpoints
- Deployment guide for multiple platforms
- Contributing guidelines
- Security policy
- Environment configuration template
- Comprehensive code comments

### Security
- JWT token authentication
- Password hashing with BCrypt
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure session management

## [0.9.0] - 2026-01-05 (Beta)

### Added
- Beta release for testing
- Core pizza ordering functionality
- Basic user authentication
- Shopping cart implementation
- Initial database schema

### Fixed
- Cart calculation errors
- Authentication token refresh issues
- CORS configuration problems

## [0.5.0] - 2026-01-03 (Alpha)

### Added
- Initial project setup
- Basic Spring Boot backend
- Simple frontend interface
- User registration and login
- Pizza listing functionality

### Known Issues
- Payment integration incomplete
- Limited error handling
- Basic UI design

## Version Naming Convention

- **Major version** (x.0.0): Incompatible API changes or major features
- **Minor version** (1.x.0): New features, backward compatible
- **Patch version** (1.0.x): Bug fixes, backward compatible

## Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Migration Guides

### From 0.9.0 to 1.0.0

No breaking changes. Simply update dependencies and restart application.

```bash
cd SliceMaster-Backend
mvn clean install
java -jar target/pizzeria-backend-1.0.0.jar
```

## Support

For questions about releases or upgrades, contact:
- Email: support@slicemaster.com
- GitHub Issues: https://github.com/hedauav/Pizaa-Webapp-Front-end-/issues

---

**Maintained by**: SliceMaster Development Team
**Last Updated**: January 6, 2026
