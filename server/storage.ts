import { db } from "./db";
import { users, products, categories, orders, orderItems, addresses, reviews, carts, cartItems } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { User, InsertUser, Product, InsertProduct, Order, InsertOrder, Address, InsertAddress } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  
  // Addresses
  getUserAddresses(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, data: Partial<Address>): Promise<Address | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return db.query.products.findFirst({ where: eq(products.id, id) });
  }

  async getProducts(): Promise<Product[]> {
    return db.query.products.findMany({ where: eq(products.isActive, true) });
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.query.products.findMany({ 
      where: and(eq(products.categoryId, categoryId), eq(products.isActive, true))
    });
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return db.query.orders.findFirst({ where: eq(orders.id, id) });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.query.orders.findMany({ where: eq(orders.userId, userId) });
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    return db.query.addresses.findMany({ where: eq(addresses.userId, userId) });
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const result = await db.insert(addresses).values(address).returning();
    return result[0];
  }

  async updateAddress(id: number, data: Partial<Address>): Promise<Address | undefined> {
    const result = await db.update(addresses).set(data).where(eq(addresses.id, id)).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
