# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security@slicemaster.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow up to 48 hours for initial response
4. Work with our team to verify and fix the issue

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30+ days

### Disclosure Policy

- Vulnerabilities will be disclosed after a fix is released
- Credit will be given to reporters (unless anonymity is requested)
- CVE IDs will be assigned for significant vulnerabilities

## Security Best Practices

### For Developers

#### Authentication & Authorization
```java
// Always validate user permissions
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyOperation() {
    // Implementation
}

// Use BCrypt for password hashing
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode(plainPassword);
```

#### Input Validation
```java
// Validate all user inputs
@Valid @RequestBody CreateOrderRequest request
```

#### SQL Injection Prevention
```java
// Always use parameterized queries
@Query("SELECT p FROM Pizza p WHERE p.name = :name")
Pizza findByName(@Param("name") String name);
```

#### XSS Prevention
```javascript
// Sanitize user inputs
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
```

### For Deployment

#### Environment Variables
```bash
# Never commit sensitive data
JWT_SECRET=${JWT_SECRET}  # Use environment variables
DB_PASSWORD=${DB_PASSWORD}
```

#### HTTPS Only
```nginx
# Force HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

#### Security Headers
```java
// Configure security headers
http
    .headers()
    .contentSecurityPolicy("default-src 'self'")
    .and()
    .xssProtection()
    .and()
    .frameOptions().deny();
```

## Known Security Measures

### Implemented Security Features

1. **JWT Authentication**
   - Token-based authentication
   - Configurable expiration
   - Secure token storage

2. **Password Security**
   - BCrypt hashing (strength: 10)
   - Minimum password length: 8 characters
   - Password complexity requirements

3. **CORS Configuration**
   - Restricted to allowed origins
   - Credentials support enabled
   - Configurable allowed methods

4. **SQL Injection Prevention**
   - JPA parameterized queries
   - Input validation
   - ORM protection

5. **XSS Protection**
   - Content Security Policy
   - Input sanitization
   - Output encoding

6. **CSRF Protection**
   - Spring Security CSRF tokens
   - SameSite cookie attribute

7. **Rate Limiting**
   - API rate limiting (planned)
   - Login attempt limiting (planned)

### Security Headers

```http
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Dependency Management

### Regular Updates

- Dependencies are reviewed monthly
- Security patches applied immediately
- Maven dependency check runs on build

### Dependency Scanning

```bash
# Check for vulnerable dependencies
mvn dependency:tree
mvn versions:display-dependency-updates
```

## Security Checklist

### Development
- [ ] All inputs validated
- [ ] Passwords properly hashed
- [ ] No hardcoded secrets
- [ ] Error messages don't leak information
- [ ] Logging doesn't contain sensitive data
- [ ] Dependencies up to date

### Testing
- [ ] Security tests included
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Input validation tested
- [ ] OWASP Top 10 addressed

### Deployment
- [ ] HTTPS enabled
- [ ] Environment variables used
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backups automated

## Common Vulnerabilities

### Prevented Vulnerabilities

1. **SQL Injection** - ✅ Prevented
   - Using JPA with parameterized queries
   - Input validation

2. **XSS (Cross-Site Scripting)** - ✅ Prevented
   - Content Security Policy
   - Input/output sanitization

3. **CSRF (Cross-Site Request Forgery)** - ✅ Prevented
   - CSRF tokens
   - SameSite cookies

4. **Broken Authentication** - ✅ Prevented
   - JWT with expiration
   - Secure password hashing
   - Session management

5. **Sensitive Data Exposure** - ✅ Prevented
   - HTTPS enforcement
   - No logging of sensitive data
   - Environment variables for secrets

6. **Broken Access Control** - ✅ Prevented
   - Role-based access control
   - Method-level security
   - Ownership validation

7. **Security Misconfiguration** - ✅ Prevented
   - Security headers
   - Error handling
   - Minimal exposed endpoints

## Security Testing

### Automated Testing

```bash
# Run security tests
mvn test -Dtest=SecurityTests

# Run dependency check
mvn dependency-check:check

# Run OWASP ZAP scan (if configured)
zap-cli quick-scan http://localhost:8081
```

### Manual Testing

1. **Authentication Testing**
   - Test with invalid credentials
   - Test token expiration
   - Test role-based access

2. **Input Validation**
   - Test with malicious inputs
   - Test boundary conditions
   - Test special characters

3. **API Security**
   - Test without authentication
   - Test with expired tokens
   - Test rate limiting

## Incident Response

### Steps if Breach Occurs

1. **Immediate Actions**
   - Isolate affected systems
   - Assess scope of breach
   - Preserve evidence

2. **Investigation**
   - Review logs
   - Identify vulnerability
   - Document findings

3. **Remediation**
   - Fix vulnerability
   - Deploy patch
   - Reset compromised credentials

4. **Communication**
   - Notify affected users
   - Public disclosure (if required)
   - Report to authorities (if required)

5. **Post-Incident**
   - Review and improve security
   - Update documentation
   - Conduct team training

## Security Contacts

- **Security Issues**: security@slicemaster.com
- **General Support**: support@slicemaster.com
- **Emergency**: emergency@slicemaster.com (24/7)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## Updates

This security policy is reviewed and updated quarterly.

**Last Updated**: January 6, 2026
**Next Review**: April 6, 2026

---

**Remember**: Security is everyone's responsibility. If you see something, say something.
