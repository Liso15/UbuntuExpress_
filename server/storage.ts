import { 
  categories, suppliers, products, productPrices, priceAlerts, users,
  type Category, type InsertCategory,
  type Supplier, type InsertSupplier,
  type Product, type InsertProduct,
  type ProductPrice, type InsertProductPrice,
  type PriceAlert, type InsertPriceAlert,
  type User, type InsertUser,
  type ProductWithCategory,
  type ProductWithPrices,
  type SupplierComparison
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;

  // Products
  getProducts(categorySlug?: string): Promise<ProductWithPrices[]>;
  getProductById(id: number): Promise<ProductWithCategory | undefined>;
  getProductsByCategory(categoryId: number): Promise<ProductWithPrices[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<ProductWithPrices[]>;

  // Product Prices
  getProductPrices(productId: number): Promise<(ProductPrice & { supplier: Supplier })[]>;
  createProductPrice(price: InsertProductPrice): Promise<ProductPrice>;
  updateProductPrice(id: number, price: Partial<InsertProductPrice>): Promise<ProductPrice>;

  // Price Alerts
  getActivePriceAlerts(): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplierById(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async getProducts(categorySlug?: string): Promise<ProductWithPrices[]> {
    const productsData = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      image: products.image,
      categoryId: products.categoryId,
      createdAt: products.createdAt,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

    const result: ProductWithPrices[] = [];
    for (const product of productsData) {
      if (!product.category) continue;
      const prices = await this.getProductPrices(product.id);
      result.push({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        category: product.category,
        prices,
        lowestPrice: prices.length > 0 ? prices.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min) : undefined,
        priceChange: this.calculatePriceChange(prices)
      });
    }
    return result;
  }

  async getProductById(id: number): Promise<ProductWithCategory | undefined> {
    const [productData] = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      image: products.image,
      categoryId: products.categoryId,
      createdAt: products.createdAt,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));

    if (!productData || !productData.category) return undefined;

    return {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      image: productData.image,
      categoryId: productData.categoryId,
      createdAt: productData.createdAt,
      category: productData.category
    };
  }

  async getProductsByCategory(categoryId: number): Promise<ProductWithPrices[]> {
    return this.getProducts();
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async searchProducts(query: string): Promise<ProductWithPrices[]> {
    return this.getProducts();
  }

  async getProductPrices(productId: number): Promise<(ProductPrice & { supplier: Supplier })[]> {
    const pricesData = await db.select({
      id: productPrices.id,
      productId: productPrices.productId,
      supplierId: productPrices.supplierId,
      price: productPrices.price,
      inStock: productPrices.inStock,
      lastUpdated: productPrices.lastUpdated,
      supplier: suppliers
    })
    .from(productPrices)
    .leftJoin(suppliers, eq(productPrices.supplierId, suppliers.id))
    .where(eq(productPrices.productId, productId));

    return pricesData.filter(p => p.supplier).map(p => ({
      id: p.id,
      productId: p.productId,
      supplierId: p.supplierId,
      price: p.price,
      inStock: p.inStock,
      lastUpdated: p.lastUpdated,
      supplier: p.supplier!
    }));
  }

  async createProductPrice(price: InsertProductPrice): Promise<ProductPrice> {
    const [newPrice] = await db.insert(productPrices).values(price).returning();
    return newPrice;
  }

  async updateProductPrice(id: number, price: Partial<InsertProductPrice>): Promise<ProductPrice> {
    const [updatedPrice] = await db.update(productPrices)
      .set(price)
      .where(eq(productPrices.id, id))
      .returning();
    return updatedPrice;
  }

  async getActivePriceAlerts(): Promise<PriceAlert[]> {
    return await db.select().from(priceAlerts).where(eq(priceAlerts.isActive, true));
  }

  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    const [newAlert] = await db.insert(priceAlerts).values(alert).returning();
    return newAlert;
  }

  private calculatePriceChange(prices: (ProductPrice & { supplier: Supplier })[]): string {
    if (prices.length < 2) return "0%";
    const sorted = prices.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
    const oldPrice = parseFloat(sorted[0].price);
    const newPrice = parseFloat(sorted[sorted.length - 1].price);
    const change = ((newPrice - oldPrice) / oldPrice) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  }
}

export const storage = new DatabaseStorage();