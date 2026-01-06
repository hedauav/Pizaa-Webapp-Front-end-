# Contributing to SliceMaster Pizza

First off, thank you for considering contributing to SliceMaster Pizza! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Java version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would work**

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

## Development Setup

### Prerequisites
- Java JDK 21+
- Maven 3.9+
- Node.js 16+
- Git

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/hedauav/Pizaa-Webapp-Front-end-.git
cd Pizza
```

2. Build the backend:
```bash
cd SliceMaster-Backend
mvn clean install
```

3. Run tests:
```bash
mvn test
npx playwright test
```

## Coding Standards

### Java/Backend
- Follow standard Java naming conventions
- Use meaningful variable and method names
- Write JavaDoc for public methods
- Keep methods focused and concise
- Use Spring Boot best practices

Example:
```java
/**
 * Creates a new pizza order
 * @param orderRequest The order request details
 * @return Created order response
 * @throws OrderException if order creation fails
 */
public OrderResponse createOrder(OrderRequest orderRequest) {
    // Implementation
}
```

### JavaScript/Frontend
- Use ES6+ features
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await for asynchronous operations

Example:
```javascript
/**
 * Fetches all pizzas from the API
 * @returns {Promise<Array>} Array of pizza objects
 */
async function getAllPizzas() {
    // Implementation
}
```

### CSS
- Use meaningful class names
- Follow BEM naming convention where applicable
- Keep selectors specific but not overly complex
- Group related properties together

## Commit Message Guidelines

Follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: Add pizza size selection to cart
fix: Resolve cart total calculation error
docs: Update API documentation for orders
test: Add E2E tests for checkout flow
```

## Testing Guidelines

### Backend Tests (JUnit)
- Write unit tests for all service methods
- Use meaningful test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

### Frontend Tests (Playwright)
- Write E2E tests for critical user flows
- Test both success and error scenarios
- Use descriptive test names
- Clean up test data after tests

Example:
```javascript
test('should add pizza to cart successfully', async ({ page }) => {
    // Arrange
    await page.goto('/');
    
    // Act
    await page.click('.add-to-cart-btn');
    
    // Assert
    await expect(page.locator('.cart-badge')).toHaveText('1');
});
```

## Documentation

- Update README.md for new features
- Update API_DOCUMENTATION.md for API changes
- Add inline code comments for complex logic
- Keep documentation clear and concise

## Review Process

1. All submissions require review
2. Reviewers will check:
   - Code quality and standards
   - Test coverage
   - Documentation
   - Performance impact
3. Address review feedback promptly
4. Squash commits before merging if needed

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Examples:
```
feature/add-payment-gateway
fix/cart-calculation-bug
docs/update-api-endpoints
```

## Testing Checklist

Before submitting a PR, ensure:
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested in multiple browsers (if frontend)
- [ ] No breaking changes (or documented if unavoidable)

## Getting Help

- Check existing issues and documentation
- Join our discussions
- Tag maintainers in your issue/PR if needed

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SliceMaster Pizza! 🍕
