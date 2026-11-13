import mongoose, { Schema, Document } from 'mongoose';
import { localDb, IProduct } from '../config/db.js';

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be positive']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide a product image URL']
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', productSchema);

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'name';
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export const ProductRepo = {
  async find(params: ProductQueryParams = {}): Promise<IProduct[]> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (params.search) {
        filter.$or = [
          { name: { $regex: params.search, $options: 'i' } },
          { description: { $regex: params.search, $options: 'i' } }
        ];
      }
      if (params.category && params.category !== 'All') {
        filter.category = params.category;
      }
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        filter.price = {};
        if (params.minPrice !== undefined) filter.price.$gte = params.minPrice;
        if (params.maxPrice !== undefined) filter.price.$lte = params.maxPrice;
      }
      if (params.inStockOnly) {
        filter.stockQuantity = { $gt: 0 };
      }

      let query = ProductModel.find(filter);
      if (params.sort === 'price_asc') query = query.sort({ price: 1 });
      else if (params.sort === 'price_desc') query = query.sort({ price: -1 });
      else if (params.sort === 'rating') query = query.sort({ rating: -1 });
      else if (params.sort === 'newest') query = query.sort({ createdAt: -1 });
      else query = query.sort({ createdAt: -1 });

      const docs = await query.exec();
      return docs.map(d => d.toObject() as unknown as IProduct);
    }

    // LocalStore query engine
    let items = [...localDb.products];

    if (params.search) {
      const queryLower = params.search.toLowerCase().trim();
      items = items.filter(
        p =>
          p.name.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
      );
    }

    if (params.category && params.category !== 'All') {
      items = items.filter(
        p => p.category.toLowerCase() === params.category?.toLowerCase()
      );
    }

    if (params.minPrice !== undefined) {
      items = items.filter(p => p.price >= (params.minPrice || 0));
    }

    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      items = items.filter(p => p.price <= (params.maxPrice || Infinity));
    }

    if (params.inStockOnly) {
      items = items.filter(p => p.stockQuantity > 0);
    }

    if (params.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (params.sort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // newest
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  },

  async findById(id: string): Promise<IProduct | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const d = await ProductModel.findById(id);
      return d ? (d.toObject() as unknown as IProduct) : null;
    }
    const found = localDb.products.find(p => p._id === id);
    return found ? { ...found } : null;
  },

  async create(data: Partial<IProduct>): Promise<IProduct> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const d = await ProductModel.create(data);
      return d.toObject() as unknown as IProduct;
    }
    const now = new Date().toISOString();
    const newProduct: IProduct = {
      _id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: data.name || 'Unnamed Product',
      description: data.description || '',
      price: Number(data.price) || 0,
      category: data.category || 'General',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      stockQuantity: Number(data.stockQuantity) || 0,
      rating: Number(data.rating) || 5.0,
      numReviews: Number(data.numReviews) || 1,
      isFeatured: !!data.isFeatured,
      createdAt: now,
      updatedAt: now
    };
    localDb.products.unshift(newProduct);
    localDb.save();
    return { ...newProduct };
  },

  async update(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const updated = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
      return updated ? (updated.toObject() as unknown as IProduct) : null;
    }
    const index = localDb.products.findIndex(p => p._id === id);
    if (index === -1) return null;
    localDb.products[index] = {
      ...localDb.products[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : localDb.products[index].price,
      stockQuantity: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : localDb.products[index].stockQuantity,
      updatedAt: new Date().toISOString()
    };
    localDb.save();
    return { ...localDb.products[index] };
  },

  async delete(id: string): Promise<boolean> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const res = await ProductModel.findByIdAndDelete(id);
      return !!res;
    }
    const index = localDb.products.findIndex(p => p._id === id);
    if (index === -1) return false;
    localDb.products.splice(index, 1);
    localDb.save();
    return true;
  },

  async count(): Promise<number> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      return await ProductModel.countDocuments();
    }
    return localDb.products.length;
  },

  async getCategories(): Promise<string[]> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      return await ProductModel.distinct('category');
    }
    const set = new Set<string>();
    localDb.products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }
};
