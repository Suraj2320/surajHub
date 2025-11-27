import { db } from "./db.js";
import { users, products, categories, orders, reviews, addresses } from "../shared/schema.js";
import { eq, and } from "drizzle-orm";
import { verifyPassword } from "./password.utils.js";

export class DatabaseStorage {
  async getUser(id) {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    // Never return password hash
    if (user) {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async getUserByEmail(email) {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  // Verify user login
  async verifyUserLogin(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null; // User not found
    }
    
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null; // Invalid password
    }

    // Return safe user data without password hash
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    const user = result[0];
    // Don't return password hash
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id, data) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getProduct(id) {
    return db.query.products.findFirst({ where: eq(products.id, id) });
  }

  async getProducts() {
    return db.query.products.findMany({ where: eq(products.isActive, true) });
  }

  async getProductsByCategory(categoryId) {
    return db.query.products.findMany({ 
      where: and(eq(products.categoryId, categoryId), eq(products.isActive, true))
    });
  }

  async createOrder(order) {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(id) {
    return db.query.orders.findFirst({ where: eq(orders.id, id) });
  }

  async getUserOrders(userId) {
    return db.query.orders.findMany({ where: eq(orders.userId, userId) });
  }

  async getUserAddresses(userId) {
    return db.query.addresses.findMany({ where: eq(addresses.userId, userId) });
  }

  async createAddress(address) {
    const result = await db.insert(addresses).values(address).returning();
    return result[0];
  }

  async updateAddress(id, data) {
    const result = await db.update(addresses).set(data).where(eq(addresses.id, id)).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
