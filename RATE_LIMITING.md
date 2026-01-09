# API Rate Limiting Guide

## Overview
This document outlines the rate limiting strategy for the SliceMaster Pizza API to ensure fair usage and system stability.

## Rate Limiting Strategy

### Endpoints and Limits

#### Authentication Endpoints
- **POST /api/auth/register**: 5 requests per 15 minutes per IP
- **POST /api/auth/login**: 10 requests per 15 minutes per IP
- **POST /api/auth/refresh**: 20 requests per hour per user

#### Menu & Product Endpoints
- **GET /api/menu**: 100 requests per minute per IP
- **GET /api/products**: 100 requests per minute per IP

#### Order Endpoints
- **POST /api/orders**: 20 requests per hour per user
- **GET /api/orders**: 60 requests per minute per user
- **GET /api/orders/{id}**: 100 requests per minute per user

#### Cart Endpoints
- **POST /api/cart/add**: 30 requests per minute per user
- **PUT /api/cart/update**: 30 requests per minute per user
- **DELETE /api/cart/remove**: 30 requests per minute per user

## Implementation

### HTTP Headers
All responses include rate limit information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641024000
```

### Rate Limit Exceeded Response
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```
HTTP Status: `429 Too Many Requests`

## Client-Side Best Practices

### 1. Implement Exponential Backoff
```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 2. Cache Responses
- Cache menu data for 5 minutes
- Cache product information for 10 minutes
- Implement browser localStorage for frequently accessed data

### 3. Batch Requests
- Group multiple cart operations when possible
- Use bulk endpoints where available

## Monitoring

### Metrics to Track
- Number of rate limit violations per endpoint
- Average API response times
- Peak usage periods
- User behavior patterns

### Alerts
Set up alerts for:
- Sustained high rate of 429 responses
- Individual IPs hitting limits repeatedly
- Unusual traffic patterns

## Future Enhancements
- Implement tiered rate limiting for premium users
- Add API key support for third-party integrations
- Dynamic rate limits based on server load
