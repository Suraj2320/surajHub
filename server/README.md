# ShopHub Backend - Node.js + Express + PostgreSQL

## Project Overview
ShopHub backend is a production-grade REST API built with Express.js and PostgreSQL. It handles all e-commerce operations including user authentication, product management, shopping cart, orders, payments, and admin/seller operations.

## Architecture

```
server/
├── app.ts                          # Express app setup (middleware, routes, error handling)
├── routes.ts                       # All API route definitions and handlers
├── storage.ts                      # Database/storage interface (CRUD operations)
├── vite.ts                         # Vite dev server configuration (frontend serving)
└── README.md                       # This file
```

## Key Technologies
- **Express.js** - HTTP server framework
- **PostgreSQL** - Relational database (via Neon)
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Runtime type validation
- **express-session** - Session management
- **connect-pg-simple** - Session store in PostgreSQL
- **Stripe** - Payment processing
- **passport.js** - Authentication (planned for OAuth)

## API Architecture

### Request Flow
```
Client Request
    ↓
Router (routes.ts) - Parse request & validate with Zod schemas
    ↓
Storage Interface (storage.ts) - Database operations via Drizzle ORM
    ↓
PostgreSQL Database - Persistent data storage
    ↓
Response - JSON serialized result
```

## API Endpoints

### Authentication Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | User login (session-based) | No |
| POST | `/api/auth/logout` | End user session | Yes |
| GET | `/api/auth/me` | Get current logged-in user | Yes |
| POST | `/api/auth/refresh` | Refresh session (if expired) | Yes |

**Request/Response Examples:**
```javascript
// POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
// Response: { user: { id, email, firstName, lastName }, message: "Account created" }

// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
// Response: { user: { id, email, firstName, lastName }, message: "Logged in" }
```

### Product Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/products` | List all products with filters | No |
| GET | `/api/products/:id` | Get single product details | No |
| GET | `/api/products/search?q=term` | Search products | No |
| GET | `/api/categories` | List all categories | No |
| GET | `/api/categories/:id/products` | Get products in category | No |

**Query Parameters:**
```
GET /api/products?category=electronics&minPrice=1000&maxPrice=50000&page=1&limit=20&sort=price
GET /api/products/search?q=iphone&page=1&limit=10
```

### Cart Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/cart` | Get current user's cart | Yes |
| POST | `/api/cart/items` | Add product to cart | Yes |
| PATCH | `/api/cart/items/:itemId` | Update cart item quantity | Yes |
| DELETE | `/api/cart/items/:itemId` | Remove item from cart | Yes |
| POST | `/api/cart/clear` | Clear entire cart | Yes |

**Request Examples:**
```javascript
// POST /api/cart/items
{
  "productId": 123,
  "quantity": 2
}

// PATCH /api/cart/items/456
{
  "quantity": 3
}
```

### Order Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders` | Get user's order history | Yes |
| GET | `/api/orders/:orderId` | Get order details | Yes |
| PATCH | `/api/orders/:orderId` | Update order status | Yes (Admin only) |
| POST | `/api/orders/:orderId/cancel` | Cancel order | Yes |

**Request Example:**
```javascript
// POST /api/orders
{
  "addressId": 789,
  "paymentMethodId": "pm_123",
  "couponCode": "SAVE10"
}
```

### Payment Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | `/api/payments/intent` | Create payment intent (Stripe) | Yes |
| POST | `/api/payments/confirm` | Confirm payment | Yes |
| POST | `/api/payments/webhook` | Stripe webhook (IPN) | No (Signature verified) |

### Address Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/addresses` | List user's addresses | Yes |
| POST | `/api/addresses` | Add new address | Yes |
| PATCH | `/api/addresses/:addressId` | Update address | Yes |
| DELETE | `/api/addresses/:addressId` | Delete address | Yes |

### User Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/users/:userId` | Get user profile | Yes |
| PATCH | `/api/users/:userId` | Update user profile | Yes |
| POST | `/api/users/avatar` | Upload profile picture | Yes |
| GET | `/api/users/:userId/wishlist` | Get user's wishlist | Yes |
| POST | `/api/users/:userId/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/users/:userId/wishlist/:productId` | Remove from wishlist | Yes |

### Review Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/products/:productId/reviews` | Get product reviews | No |
| POST | `/api/products/:productId/reviews` | Add review (must have ordered) | Yes |
| PATCH | `/api/reviews/:reviewId` | Edit own review | Yes |
| DELETE | `/api/reviews/:reviewId` | Delete own review | Yes |

### Seller Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | `/api/sellers/register` | Register as seller | Yes |
| GET | `/api/sellers/dashboard` | Seller metrics & dashboard | Yes (Seller only) |
| POST | `/api/sellers/products` | Upload new product | Yes (Seller only) |
| PATCH | `/api/sellers/products/:productId` | Edit product | Yes (Seller only) |
| DELETE | `/api/sellers/products/:productId` | Delete product | Yes (Seller only) |
| GET | `/api/sellers/orders` | Seller's incoming orders | Yes (Seller only) |
| PATCH | `/api/sellers/orders/:orderId` | Update fulfillment status | Yes (Seller only) |

### Admin Routes
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| GET | `/api/admin/users` | List all users | Yes (Admin only) |
| GET | `/api/admin/sellers` | List all sellers | Yes (Admin only) |
| PATCH | `/api/admin/sellers/:sellerId/approve` | Approve seller | Yes (Admin only) |
| GET | `/api/admin/orders` | All orders (system-wide) | Yes (Admin only) |
| GET | `/api/admin/analytics` | Platform analytics | Yes (Admin only) |
| POST | `/api/admin/coupon` | Create coupon/promo | Yes (Admin only) |
| DELETE | `/api/admin/users/:userId` | Suspend/delete user | Yes (Admin only) |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(10),
  profileImageUrl TEXT,
  role ENUM('user', 'seller', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  discountPrice DECIMAL(10, 2),
  images TEXT[],
  stock INTEGER,
  specifications JSONB,
  ratingAvg DECIMAL(3, 2),
  reviewCount INTEGER DEFAULT 0,
  sellerId INTEGER REFERENCES sellers(id),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  orderNumber VARCHAR(255) UNIQUE,
  userId INTEGER REFERENCES users(id),
  items JSONB NOT NULL,
  shippingAddress JSONB NOT NULL,
  subtotal DECIMAL(10, 2),
  shippingCost DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  paymentStatus ENUM('pending', 'completed', 'failed', 'refunded'),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Other Tables
- **cart_items** - Temporary shopping cart storage
- **addresses** - User shipping addresses
- **reviews** - Product reviews and ratings
- **wishlist** - User's saved products
- **sellers** - Seller business information
- **coupons** - Discount codes

## Authentication & Security

### Session-Based Auth
1. User logs in with email + password
2. Server creates session in PostgreSQL (via connect-pg-simple)
3. Session ID stored in secure HTTP-only cookie
4. All subsequent requests include session cookie
5. User info retrieved from session on each request

### Password Security
- Passwords hashed with bcryptjs (12 salt rounds)
- Never stored in plain text
- Never logged or exposed in errors

### CORS & Security Headers
```javascript
// All endpoints are same-origin (frontend and backend on same port)
// No CORS needed
// Security headers (HSTS, CSP, etc) set in app.ts
```

### Payment Security
- Stripe handles all credit card data (PCI-DSS compliant)
- We never store card details
- Webhook signature verification prevents spoofing
- Idempotency keys prevent duplicate charges

## Error Handling

### Response Format
```javascript
// Success
{ success: true, data: {...}, message: "Operation successful" }

// Error
{ success: false, error: "error_code", message: "Human-readable error", details: {...} }
```

### HTTP Status Codes
- **200** - OK / Successful operation
- **201** - Created / Resource created
- **400** - Bad Request / Invalid input
- **401** - Unauthorized / Not logged in
- **403** - Forbidden / Insufficient permissions
- **404** - Not Found / Resource doesn't exist
- **409** - Conflict / Duplicate/conflicting data
- **422** - Unprocessable Entity / Validation failed
- **500** - Internal Server Error

## Validation

### Zod Schemas (runtime type safety)
All request bodies validated with Zod schemas before processing:
```javascript
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});
```

### Common Errors
- Invalid email format → 400 Bad Request
- Password too weak → 422 Unprocessable Entity
- Email already exists → 409 Conflict
- Missing required fields → 400 Bad Request

## Rate Limiting
- 100 requests per minute per IP
- 10 requests per second for login/signup
- Stripe webhook retries handled automatically

## Environment Variables
```
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=random-secure-string-min-32-chars
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
NODE_ENV=development|production
PORT=3000
```

## Database Migrations

### Running Migrations
```bash
npm run db:push         # Safe sync with schema
npm run db:push --force # Force sync (drops/recreates tables if needed)
npm run db:studio      # Open visual database editor
```

### Schema Changes
1. Update `shared/schema.ts` with new/modified table structure
2. Run `npm run db:push`
3. Drizzle automatically handles migrations

## Performance Optimization

### Database
- Indexes on frequently queried columns (email, userId, productId)
- Pagination for large result sets (default limit: 20)
- Query result caching via TanStack Query (frontend)

### API
- Gzip compression for responses
- Connection pooling for database (via Neon)
- Request/response logging (development)
- Slow query monitoring

### Caching
- Session data cached in PostgreSQL
- Product catalog can be cached (rarely changes)
- Stripe responses cached briefly

## Deployment

### Environment Setup
```bash
# .env production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod-user:password@prod-host/prod-db
SESSION_SECRET=strong-random-secret-here
STRIPE_SECRET_KEY=sk_live_...
```

### Pre-deployment Checklist
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] SSL certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Error logging configured
- [ ] Backups scheduled

## Monitoring & Logging

### Logs Include
- Request method, path, status, response time
- Errors with full stack traces
- Database query execution time
- Payment/webhook events

### Log Levels
- **error** - Critical issues
- **warn** - Non-critical issues
- **info** - Important events (login, order creation)
- **debug** - Detailed debugging info (queries, requests)

## Testing API Locally

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get products
curl http://localhost:3000/api/products?category=electronics&limit=10
```

### Using Postman
1. Import API collection
2. Set environment variables (BASE_URL, SESSION_ID, etc)
3. Run requests sequentially
4. Observe responses and status codes

## Common Issues & Solutions

### Database Connection Fails
- Check `DATABASE_URL` environment variable
- Verify PostgreSQL is running
- Check firewall/network access to database

### Session Not Persisting
- Verify `SESSION_SECRET` is set (min 32 characters)
- Check cookies are enabled
- Verify `connect-pg-simple` is configured

### Stripe Payment Fails
- Verify Stripe keys are correct (test vs live)
- Check webhook URL is correct in Stripe dashboard
- Verify webhook secret is set

## Contact & Support
- Email: support@shophub.com
- Phone: 1800-123-4567
- Docs: https://api.shophub.com/docs

## License
All rights reserved © ShopHub 2025
