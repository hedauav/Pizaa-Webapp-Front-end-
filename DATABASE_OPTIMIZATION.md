# Database Optimization Guide

## Overview
This guide provides strategies and best practices for optimizing the SliceMaster Pizza database performance.

## Indexing Strategy

### Existing Tables and Recommended Indexes

#### Users Table
```sql
-- Primary key index (auto-created)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- For login queries
CREATE INDEX idx_users_email_password ON users(email, password_hash);
```

#### Products/Menu Items Table
```sql
-- Primary key index (auto-created)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_price ON products(price);

-- Composite index for filtering and sorting
CREATE INDEX idx_products_category_available ON products(category, is_available);
```

#### Orders Table
```sql
-- Primary key index (auto-created)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
```

#### Order Items Table
```sql
-- Primary key index (auto-created)
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Foreign key optimization
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);
```

#### Shopping Cart Table
```sql
CREATE INDEX idx_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_cart_product_id ON shopping_cart(product_id);
CREATE INDEX idx_cart_updated_at ON shopping_cart(updated_at DESC);

-- Composite index for user cart queries
CREATE INDEX idx_cart_user_product ON shopping_cart(user_id, product_id);
```

## Query Optimization

### 1. Use EXPLAIN to Analyze Queries
```sql
EXPLAIN ANALYZE
SELECT * FROM orders 
WHERE user_id = 123 
  AND status = 'PENDING'
ORDER BY created_at DESC;
```

### 2. Avoid SELECT *
```sql
-- Bad
SELECT * FROM products WHERE category = 'pizza';

-- Good
SELECT id, name, price, image_url 
FROM products 
WHERE category = 'pizza';
```

### 3. Use Prepared Statements
Always use prepared statements to:
- Prevent SQL injection
- Improve query plan caching
- Better performance for repeated queries

### 4. Optimize JOIN Operations
```sql
-- Ensure indexes on JOIN columns
SELECT o.id, o.total, u.email
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.status = 'COMPLETED'
  AND o.created_at > '2026-01-01';
```

## Connection Pooling

### HikariCP Configuration (Spring Boot)
```properties
# Maximum pool size
spring.datasource.hikari.maximum-pool-size=10

# Minimum idle connections
spring.datasource.hikari.minimum-idle=5

# Connection timeout
spring.datasource.hikari.connection-timeout=20000

# Max lifetime of connection
spring.datasource.hikari.max-lifetime=1800000

# Idle timeout
spring.datasource.hikari.idle-timeout=600000

# Connection test query
spring.datasource.hikari.connection-test-query=SELECT 1
```

## Caching Strategy

### 1. Application-Level Caching
```java
@Cacheable(value = "products", key = "#category")
public List<Product> getProductsByCategory(String category) {
    return productRepository.findByCategory(category);
}

@CacheEvict(value = "products", allEntries = true)
public Product updateProduct(Product product) {
    return productRepository.save(product);
}
```

### 2. Query Result Caching
- Cache frequently accessed menu items
- Cache user session data
- Set appropriate TTL based on data volatility

### 3. Redis Integration (Future Enhancement)
```properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.redis.time-to-live=600000
```

## Database Maintenance

### Regular Tasks

#### 1. Update Statistics
```sql
-- PostgreSQL
ANALYZE users;
ANALYZE products;
ANALYZE orders;

-- MySQL
ANALYZE TABLE users;
ANALYZE TABLE products;
ANALYZE TABLE orders;
```

#### 2. Vacuum and Reindex (PostgreSQL)
```sql
-- Full vacuum
VACUUM FULL users;

-- Analyze and vacuum
VACUUM ANALYZE orders;

-- Reindex
REINDEX TABLE products;
```

#### 3. Check Index Usage
```sql
-- PostgreSQL
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

## Performance Monitoring

### Key Metrics to Track
1. **Query Execution Time**: Monitor slow queries (> 1 second)
2. **Connection Pool Usage**: Ensure connections are available
3. **Cache Hit Ratio**: Aim for > 80%
4. **Index Usage**: Remove unused indexes
5. **Database Size Growth**: Plan for scaling

### Slow Query Log
```properties
# MySQL
slow_query_log=1
long_query_time=1
slow_query_log_file=/var/log/mysql/slow-query.log

# PostgreSQL
log_min_duration_statement=1000
```

## Best Practices

### 1. Pagination
Always paginate large result sets:
```sql
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

### 2. Avoid N+1 Queries
Use JOIN or batch fetching instead:
```java
@EntityGraph(attributePaths = {"orderItems", "user"})
List<Order> findAllWithDetails();
```

### 3. Denormalization (When Needed)
For frequently accessed computed values:
```sql
ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2);
-- Update via triggers or application logic
```

### 4. Partitioning (For Large Tables)
```sql
-- PostgreSQL: Partition orders by date
CREATE TABLE orders_2026_01 PARTITION OF orders
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

## Backup and Recovery

### Automated Backups
- Daily full backups
- Hourly incremental backups
- Retention: 30 days
- Test restoration quarterly

### Backup Script Example
```bash
#!/bin/bash
pg_dump -U postgres -d pizzeria > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Scaling Considerations

### Read Replicas
For read-heavy workloads:
- Configure master-slave replication
- Route read queries to replicas
- Keep write operations on master

### Database Sharding (Future)
When data grows beyond single instance:
- Shard by user_id or region
- Use consistent hashing
- Plan for cross-shard queries
