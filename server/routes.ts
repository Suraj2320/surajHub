import { createServer } from "http";
import { storage } from "./storage.js";
import { db } from "./db.js";
import { reviews } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, validatePasswordStrength } from "./password.utils.js";
import { createToken, authMiddleware, requireRole } from "./auth.middleware.js";

export async function registerRoutes(app) {
  // Auth Routes
  app.get("/api/auth/user", authMiddleware, async (req, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(req.user.userId);
      res.json(user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // SIGNUP - Create user with password hashing
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.error });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = hashPassword(password);

      // Create user
      const newUser = await storage.createUser({
        email,
        passwordHash, // Store hashed password, NOT plain text
        firstName: firstName || "",
        lastName: lastName || "",
        role: "user",
        isApproved: true,
      });

      // Generate JWT token
      const token = createToken(newUser.id, newUser.role);

      res.status(201).json({
        message: "User created successfully",
        token,
        user: newUser,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  // LOGIN - Verify email & password
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Verify credentials (this now checks password hash!)
      const user = await storage.verifyUserLogin(email, password);

      if (!user) {
        // Don't tell if email exists or password wrong - security best practice
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = createToken(user.id, user.role);

      res.json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // LOGOUT - Clear token on frontend
  app.post("/api/auth/logout", authMiddleware, (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // UPDATE USER - Protected route
  app.patch("/api/auth/user", authMiddleware, async (req, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { firstName, lastName, profileImageUrl, phone } = req.body;
      const updatedUser = await storage.updateUser(req.user.userId, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        profileImageUrl: profileImageUrl || undefined,
        phone: phone || undefined,
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // ADMIN-ONLY routes
  app.get("/api/admin/users", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany();
      // Remove password hashes from response
      const safeUsers = allUsers.map(u => {
        const { passwordHash, ...safe } = u;
        return safe;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // SELLER-ONLY routes
  app.post("/api/seller/products", authMiddleware, requireRole("seller", "admin"), async (req, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { name, description, price, categoryId } = req.body;
      // Create product (seller owns it)
      const product = await db.insert(products).values({
        name,
        description,
        price: price.toString(),
        categoryId,
        sellerId: req.user.userId,
        isActive: true,
      }).returning();
      res.status(201).json(product[0]);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Product Routes
  app.get("/api/products", async (req, res) => {
    try {
      const prods = await storage.getProducts();
      res.json(prods);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      res.json(product || null);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/categories/:id/products", async (req, res) => {
    try {
      const prods = await storage.getProductsByCategory(parseInt(req.params.id));
      res.json(prods);
    } catch (error) {
      console.error("Error fetching category products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Orders Routes
  app.get("/api/orders", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userOrders = await storage.getUserOrders(req.user.id);
      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { items, address, subtotal, tax, shipping } = req.body;
      const orderNumber = `ORD${Date.now()}`;
      const order = await storage.createOrder({
        orderNumber,
        userId: req.user.id,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        totalAmount: (subtotal + tax + shipping).toString(),
        paymentStatus: "completed",
        orderStatus: "pending",
        shippingAddress: address,
      });
      res.status(201).json({ message: "Order created", order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Addresses Routes
  app.get("/api/addresses", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const addrs = await storage.getUserAddresses(req.user.id);
      res.json(addrs);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });

  app.post("/api/addresses", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country } = req.body;
      const address = await storage.createAddress({
        userId: req.user.id,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: country || "India",
      });
      res.status(201).json(address);
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  // Reviews Routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const prods = await db.query.reviews.findMany({
        where: eq(reviews.productId, parseInt(req.params.id))
      });
      res.json(prods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { rating, title, comment } = req.body;
      const review = await db.insert(reviews).values({
        productId: parseInt(req.params.id),
        userId: req.user.id,
        rating,
        title,
        comment,
        isVerifiedPurchase: true,
      }).returning();
      res.status(201).json(review[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
