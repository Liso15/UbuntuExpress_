import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertProductPriceSchema, insertPriceAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplierById(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let products;
      if (search && typeof search === "string") {
        products = await storage.searchProducts(search);
      } else {
        products = await storage.getProducts(category as string);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Product prices routes
  app.get("/api/products/:id/prices", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const prices = await storage.getProductPrices(productId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product prices" });
    }
  });

  app.post("/api/prices", async (req, res) => {
    try {
      const validatedData = insertProductPriceSchema.parse(req.body);
      const price = await storage.createProductPrice(validatedData);
      res.status(201).json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data" });
    }
  });

  app.put("/api/prices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductPriceSchema.partial().parse(req.body);
      const price = await storage.updateProductPrice(id, validatedData);
      res.json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data" });
    }
  });

  // Price alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActivePriceAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertPriceAlertSchema.parse(req.body);
      const alert = await storage.createPriceAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // Return default user for demo purposes
      const user = await storage.getUserByUsername("John S.");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
