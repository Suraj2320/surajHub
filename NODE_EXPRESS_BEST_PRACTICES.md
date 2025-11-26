# Node.js & Express Best Practices for SurajHub

## Project Structure

```
server/
├── routes.ts          # All API endpoints
├── storage.ts         # Data persistence layer
├── middleware/        # Express middleware
├── utils/            # Utility functions
└── vite.ts           # Vite dev server config
```

## Error Handling

```typescript
// ❌ DON'T: Crash on unhandled error
async function getProduct(id) {
  const product = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return product; // May return undefined
}

// ✅ DO: Handle errors gracefully
async function getProduct(id) {
  try {
    const product = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
    if (!product) {
      return { error: 'Product not found', status: 404 };
    }
    return { data: product, status: 200 };
  } catch (err) {
    console.error('Database error:', err);
    return { error: 'Internal server error', status: 500 };
  }
}
```

## Authentication

```typescript
// ✅ DO: Validate session on protected routes
app.get('/api/user-profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Return user profile
});

// ✅ DO: Hash passwords
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ DON'T: Store plain text passwords
const user = await db.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, 
  [email, plainTextPassword]); // DANGEROUS!
```

## Database Operations

```typescript
// ❌ DON'T: Concatenate SQL queries
const users = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ DO: Use parameterized queries
const users = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

// ❌ DON'T: Fetch all data
const allProducts = await db.query(`SELECT * FROM products`);

// ✅ DO: Use pagination
const page = req.query.page || 1;
const limit = 10;
const offset = (page - 1) * limit;
const products = await db.query(
  `SELECT * FROM products LIMIT $1 OFFSET $2`, 
  [limit, offset]
);
```

## API Design

```typescript
// ✅ DO: Use consistent response format
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed"
}

// ✅ DO: Use proper HTTP status codes
app.get('/api/products/:id', (req, res) => {
  if (!id) return res.status(400).json({ error: 'ID required' }); // 400 Bad Request
  const product = findProduct(id);
  if (!product) return res.status(404).json({ error: 'Not found' }); // 404 Not Found
  res.status(200).json(product); // 200 OK
});

// ✅ DO: Validate input
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ error: 'Email and password required' });
}
```

## Middleware

```typescript
// ✅ DO: Create reusable middleware
function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/protected', authenticateUser, (req, res) => {
  // Only runs if authenticated
});

// ✅ DO: Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ✅ DO: Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Async/Await

```typescript
// ✅ DO: Use async/await for readability
async function getProductWithReviews(productId) {
  try {
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    const reviews = await db.query('SELECT * FROM reviews WHERE product_id = $1', [productId]);
    return { product, reviews };
  } catch (err) {
    throw new Error('Failed to fetch product');
  }
}

// ❌ DON'T: Use callback hell
db.query('SELECT * FROM products', (err, product) => {
  if (err) throw err;
  db.query('SELECT * FROM reviews', (err, reviews) => {
    if (err) throw err;
    // Deeply nested callbacks
  });
});
```

## Environment Variables

```typescript
// ✅ DO: Load from .env
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
const stripKey = process.env.STRIPE_SECRET_KEY;

// ✅ DO: Validate required variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// ❌ DON'T: Hardcode sensitive values
const dbUrl = 'postgresql://user:password@localhost/db';
```

## Performance

```typescript
// ✅ DO: Cache frequently accessed data
const cache = new Map();

app.get('/api/categories', (req, res) => {
  if (cache.has('categories')) {
    return res.json(cache.get('categories'));
  }
  const categories = fetchCategories();
  cache.set('categories', categories);
  res.json(categories);
});

// ✅ DO: Use connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ DO: Limit query results
app.get('/api/products', (req, res) => {
  const limit = Math.min(req.query.limit || 10, 100); // Cap at 100
  const offset = (req.query.page - 1) * limit;
  // Fetch limited results
});
```

## Logging

```typescript
// ✅ DO: Log important events
app.post('/api/checkout', async (req, res) => {
  console.log(`User ${req.session.userId} initiating checkout`);
  try {
    const order = await createOrder(req.body);
    console.log(`Order ${order.id} created successfully`);
    res.json(order);
  } catch (err) {
    console.error(`Checkout failed for user ${req.session.userId}:`, err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// ✅ DO: Use log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};
```

## Testing

```typescript
// ✅ DO: Write tests for critical paths
test('POST /api/auth/login should return 401 for invalid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'wrong' });
  
  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
});

// ✅ DO: Test error cases
test('GET /api/products/:id should return 404 if product not found', async () => {
  const res = await request(app).get('/api/products/999999');
  expect(res.status).toBe(404);
});
```

## Security

```typescript
// ✅ DO: Use helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// ✅ DO: Rate limit API endpoints
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// ✅ DO: Sanitize user input
const sanitize = (str) => str.trim().replace(/[^a-z0-9]/gi, '');

// ✅ DO: Use HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

## Deployment

```typescript
// ✅ DO: Graceful shutdown
const server = app.listen(PORT);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// ✅ DO: Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});
```

