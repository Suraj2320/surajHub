import { createServer } from "http";
import { storage } from "./storage.js";
import { db } from "./db.js";
import { reviews } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export async function registerRoutes(app) {
  // Auth Routes
  app.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(200).json(null);
      }
      const user = await storage.getUser(req.user.id);
      res.json(user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const newUser = await storage.createUser({
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        role: "user",
        isApproved: true,
      });
      if (req.session) {
        req.session.userId = newUser.id;
      }
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (req.session) {
        req.session.userId = user.id;
      }
      res.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Logout failed" });
          }
          res.json({ message: "Logged out successfully" });
        });
      } else {
        res.json({ message: "Logged out successfully" });
      }
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.patch("/api/auth/user", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { firstName, lastName, profileImageUrl, phone } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, {
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
