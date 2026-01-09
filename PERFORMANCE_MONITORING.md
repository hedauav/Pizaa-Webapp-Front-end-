# Application Performance Monitoring Guide

## Overview
This guide provides comprehensive strategies for monitoring and optimizing the SliceMaster Pizza application performance across frontend, backend, and infrastructure layers.

## Key Performance Indicators (KPIs)

### Frontend Metrics
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **Total Blocking Time (TBT)**: < 200ms

### Backend Metrics
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 50ms (average)
- **Error Rate**: < 0.1%
- **Throughput**: Requests per second
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%

### Business Metrics
- **Order Completion Rate**: > 95%
- **Cart Abandonment Rate**: < 30%
- **User Session Duration**: Track trends
- **Conversion Rate**: Orders / Sessions

## Frontend Performance Monitoring

### 1. Web Vitals Tracking
```javascript
// Performance monitoring utility
const PerformanceMonitor = {
    // Track Core Web Vitals
    trackWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FCP:', entry.startTime);
                this.sendMetric('FCP', entry.startTime);
            }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            this.sendMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const fid = entry.processingStart - entry.startTime;
                console.log('FID:', fid);
                this.sendMetric('FID', fid);
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
            this.sendMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    },

    // Send metrics to backend
    sendMetric(name, value) {
        navigator.sendBeacon('/api/metrics', JSON.stringify({
            metric: name,
            value: value,
            timestamp: Date.now(),
            url: window.location.pathname
        }));
    },

    // Track API call performance
    trackAPICall(endpoint, duration, status) {
        this.sendMetric('API_CALL', {
            endpoint,
            duration,
            status,
            timestamp: Date.now()
        });
    },

    // Track user interactions
    trackInteraction(action, element, duration = 0) {
        this.sendMetric('USER_INTERACTION', {
            action,
            element,
            duration,
            timestamp: Date.now()
        });
    }
};

// Initialize monitoring
if ('PerformanceObserver' in window) {
    PerformanceMonitor.trackWebVitals();
}
```

### 2. Resource Timing
```javascript
// Monitor resource loading
window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach(resource => {
        if (resource.duration > 1000) {
            console.warn('Slow resource:', resource.name, resource.duration);
            PerformanceMonitor.sendMetric('SLOW_RESOURCE', {
                url: resource.name,
                duration: resource.duration,
                type: resource.initiatorType
            });
        }
    });
});
```

### 3. Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
    PerformanceMonitor.sendMetric('JS_ERROR', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
    });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    PerformanceMonitor.sendMetric('PROMISE_REJECTION', {
        reason: event.reason,
        promise: event.promise
    });
});
```

## Backend Performance Monitoring

### 1. Spring Boot Actuator
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=health,metrics,prometheus,info
management.endpoint.health.show-details=always
management.metrics.export.prometheus.enabled=true
management.metrics.tags.application=pizzeria-backend
```

### 2. Custom Metrics
```java
@Component
public class PerformanceMetrics {
    
    private final MeterRegistry meterRegistry;
    private final Counter ordersCreated;
    private final Timer orderProcessingTime;
    
    public PerformanceMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.ordersCreated = Counter.builder("orders.created")
            .description("Total number of orders created")
            .register(meterRegistry);
        this.orderProcessingTime = Timer.builder("orders.processing.time")
            .description("Time taken to process orders")
            .register(meterRegistry);
    }
    
    public void recordOrderCreated() {
        ordersCreated.increment();
    }
    
    public void recordOrderProcessingTime(Duration duration) {
        orderProcessingTime.record(duration);
    }
    
    public void recordDatabaseQueryTime(String query, Duration duration) {
        Timer.builder("database.query.time")
            .tag("query", query)
            .register(meterRegistry)
            .record(duration);
    }
}
```

### 3. Request Logging Interceptor
```java
@Component
public class PerformanceInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(PerformanceInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) {
        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                              HttpServletResponse response, 
                              Object handler, 
                              Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long duration = System.currentTimeMillis() - startTime;
        
        if (duration > 500) {
            logger.warn("Slow request: {} {} - {}ms",
                request.getMethod(),
                request.getRequestURI(),
                duration);
        }
        
        logger.info("Request: {} {} - Status: {} - Duration: {}ms",
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            duration);
    }
}
```

## Database Performance Monitoring

### 1. Query Performance Logging
```properties
# application.properties
# Log slow queries
spring.jpa.properties.hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS=100

# Show SQL
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Statistics
spring.jpa.properties.hibernate.generate_statistics=true
```

### 2. Connection Pool Monitoring
```java
@Component
public class HikariMetrics {
    
    @Scheduled(fixedRate = 60000) // Every minute
    public void logPoolMetrics(HikariDataSource dataSource) {
        HikariPoolMXBean poolBean = dataSource.getHikariPoolMXBean();
        
        logger.info("HikariCP Pool Stats - " +
            "Active: {}, Idle: {}, Waiting: {}, Total: {}",
            poolBean.getActiveConnections(),
            poolBean.getIdleConnections(),
            poolBean.getThreadsAwaitingConnection(),
            poolBean.getTotalConnections());
    }
}
```

## Infrastructure Monitoring

### 1. Health Checks
```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // Check database connectivity
        boolean dbHealthy = checkDatabase();
        
        // Check external services
        boolean servicesHealthy = checkExternalServices();
        
        if (dbHealthy && servicesHealthy) {
            return Health.up()
                .withDetail("database", "Connected")
                .withDetail("services", "Available")
                .build();
        }
        
        return Health.down()
            .withDetail("database", dbHealthy ? "Connected" : "Down")
            .withDetail("services", servicesHealthy ? "Available" : "Down")
            .build();
    }
}
```

### 2. JVM Metrics
Monitor via Spring Boot Actuator:
- Heap memory usage
- Non-heap memory usage
- Thread count
- Garbage collection metrics
- CPU usage

## Alerting Strategy

### Critical Alerts (Immediate Action)
- API error rate > 5%
- Response time p95 > 1000ms
- Database connection pool exhausted
- CPU usage > 90% for 5 minutes
- Memory usage > 95%
- Service health check failures

### Warning Alerts (Review Required)
- API error rate > 1%
- Response time p95 > 500ms
- Slow database queries > 500ms
- Cache hit rate < 70%
- Disk space < 20%

### Alert Configuration Example
```yaml
# Prometheus Alert Rules
groups:
  - name: pizzeria_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: SlowResponses
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow API responses detected"
```

## Monitoring Tools Integration

### 1. Google Analytics (Frontend)
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Application Insights (Azure)
```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-spring-boot-starter</artifactId>
    <version>2.6.4</version>
</dependency>
```

### 3. ELK Stack (Logging)
```properties
# Logback configuration for ELK
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.file.name=logs/application.log
```

## Performance Optimization Workflow

1. **Identify**: Use monitoring tools to identify bottlenecks
2. **Measure**: Establish baseline metrics
3. **Optimize**: Implement improvements
4. **Verify**: Measure impact of changes
5. **Document**: Record what worked
6. **Iterate**: Continuous improvement

## Dashboards

### Key Metrics Dashboard
- Real-time request rate
- Response time percentiles (p50, p95, p99)
- Error rate trending
- Active users
- Database query performance
- Cache hit ratio
- Memory and CPU usage

### Business Dashboard
- Orders per hour
- Revenue trending
- Popular menu items
- User conversion funnel
- Cart abandonment rate

## Regular Reviews

### Daily
- Check error logs
- Review slow query log
- Monitor alert notifications

### Weekly
- Analyze performance trends
- Review capacity metrics
- Check for new performance issues

### Monthly
- Performance optimization planning
- Capacity planning review
- Update performance baselines

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
