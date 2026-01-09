# Security Headers Configuration Guide

## Overview
This document outlines the security headers implementation for the SliceMaster Pizza application to protect against common web vulnerabilities.

## Essential Security Headers

### 1. Content Security Policy (CSP)
Prevents XSS attacks by controlling resource loading.

#### Recommended Configuration
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' ws://localhost:8080 wss://localhost:8080;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

#### Spring Boot Implementation
```java
@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   Object handler) {
                response.setHeader("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "img-src 'self' data: https:; " +
                    "connect-src 'self' ws://localhost:8080 wss://localhost:8080; " +
                    "frame-ancestors 'none'; " +
                    "base-uri 'self'; " +
                    "form-action 'self'");
                return true;
            }
        });
    }
}
```

### 2. X-Content-Type-Options
Prevents MIME type sniffing.

```
X-Content-Type-Options: nosniff
```

### 3. X-Frame-Options
Protects against clickjacking attacks.

```
X-Frame-Options: DENY
```

### 4. X-XSS-Protection
Enables browser's XSS filtering (legacy support).

```
X-XSS-Protection: 1; mode=block
```

### 5. Strict-Transport-Security (HSTS)
Forces HTTPS connections.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 6. Referrer-Policy
Controls referrer information.

```
Referrer-Policy: strict-origin-when-cross-origin
```

### 7. Permissions-Policy
Controls browser features and APIs.

```
Permissions-Policy: 
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(self),
  usb=(),
  magnetometer=(),
  gyroscope=(),
  accelerometer=()
```

## Complete Spring Boot Configuration

### Using Spring Security
```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives(
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                        "font-src 'self' https://fonts.gstatic.com; " +
                        "img-src 'self' data: https:; " +
                        "connect-src 'self' ws://localhost:8080; " +
                        "frame-ancestors 'none'; " +
                        "base-uri 'self'; " +
                        "form-action 'self'"
                    )
                )
                .xssProtection(xss -> xss
                    .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                )
                .contentTypeOptions(contentType -> contentType.disable())
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                    .preload(true)
                )
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
                .permissionsPolicy(permissions -> permissions
                    .policy("geolocation=(), microphone=(), camera=(), payment=(self)")
                )
            );
        
        return http.build();
    }
}
```

### Using application.properties
```properties
# Security Headers
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=strict
```

## CORS Configuration

### Spring Boot CORS Setup
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5500", "https://yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Cookie Security

### Secure Cookie Settings
```java
@Bean
public CookieSerializer cookieSerializer() {
    DefaultCookieSerializer serializer = new DefaultCookieSerializer();
    serializer.setCookieName("SESSIONID");
    serializer.setUseSecureCookie(true);
    serializer.setUseHttpOnlyCookie(true);
    serializer.setSameSite("Strict");
    serializer.setCookiePath("/");
    serializer.setCookieMaxAge(1800); // 30 minutes
    return serializer;
}
```

### JWT Token Security
```java
// Store JWT in httpOnly cookie instead of localStorage
response.addCookie(createSecureCookie("jwt", token, 3600));

private Cookie createSecureCookie(String name, String value, int maxAge) {
    Cookie cookie = new Cookie(name, value);
    cookie.setHttpOnly(true);
    cookie.setSecure(true); // Only over HTTPS
    cookie.setPath("/");
    cookie.setMaxAge(maxAge);
    cookie.setAttribute("SameSite", "Strict");
    return cookie;
}
```

## Testing Security Headers

### Using curl
```bash
curl -I https://localhost:8080/api/menu

# Check for headers:
# - Content-Security-Policy
# - X-Content-Type-Options
# - X-Frame-Options
# - Strict-Transport-Security
```

### Using Online Tools
- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Automated Testing
```javascript
// Playwright test example
test('should have security headers', async ({ page }) => {
    const response = await page.goto('http://localhost:5500');
    const headers = response.headers();
    
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
});
```

## Security Checklist

- [ ] Content-Security-Policy configured and tested
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-Frame-Options set to DENY
- [ ] HSTS enabled with appropriate max-age
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy restricts unnecessary features
- [ ] CORS configured with specific origins (no wildcards in production)
- [ ] Cookies have Secure, HttpOnly, and SameSite flags
- [ ] HTTPS enforced in production
- [ ] Security headers tested with online tools
- [ ] CSP violations monitored and logged

## Common Pitfalls to Avoid

### 1. Don't Use 'unsafe-inline' in Production CSP
```javascript
// Development only - remove for production
script-src 'self' 'unsafe-inline';

// Production - use nonces or hashes
script-src 'self' 'nonce-{random}';
```

### 2. Don't Allow All Origins in CORS
```java
// Bad
.allowedOrigins("*")

// Good
.allowedOrigins("https://yourdomain.com", "https://app.yourdomain.com")
```

### 3. Don't Skip HTTPS in Production
Always enforce HTTPS:
```java
if (!request.isSecure() && isProduction()) {
    response.sendRedirect("https://" + request.getServerName() + request.getRequestURI());
}
```

## Monitoring and Logging

### CSP Violation Reporting
```
Content-Security-Policy: 
  default-src 'self';
  report-uri /api/csp-violations;
```

```java
@PostMapping("/api/csp-violations")
public ResponseEntity<Void> handleCspViolation(@RequestBody String report) {
    logger.warn("CSP Violation: {}", report);
    // Store in database or send to monitoring service
    return ResponseEntity.ok().build();
}
```

## Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
