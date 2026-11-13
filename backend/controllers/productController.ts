import { Request, Response } from 'express';
import { ProductRepo, ProductQueryParams } from '../models/Product.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort, minPrice, maxPrice, inStockOnly } = req.query;

    const queryParams: ProductQueryParams = {
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      sort: sort as any,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true'
    };

    const products = await ProductRepo.find(queryParams);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductRepo.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await ProductRepo.getCategories();
    res.status(200).json({
      success: true,
      categories: ['All', ...categories]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, imageUrl, stockQuantity, rating, isFeatured } = req.body;

    if (!name || !description || price === undefined || !category) {
      res.status(400).json({ success: false, message: 'Name, description, price, and category are required' });
      return;
    }

    if (Number(price) < 0) {
      res.status(400).json({ success: false, message: 'Price cannot be negative' });
      return;
    }

    const product = await ProductRepo.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 10,
      rating: rating ? Number(rating) : 4.8,
      numReviews: 1,
      isFeatured: !!isFeatured
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await ProductRepo.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updated = await ProductRepo.update(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await ProductRepo.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    await ProductRepo.delete(id);
    res.status(200).json({
      success: true,
      message: `Product "${existing.name}" deleted successfully`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
