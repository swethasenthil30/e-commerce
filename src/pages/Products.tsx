import React, { useEffect, useState, useMemo } from 'react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { Search, SlidersHorizontal, ArrowUpDown, X, PackageOpen, RotateCcw } from 'lucide-react';

interface Props {
  initialCategory?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const Products: React.FC<Props> = ({
  initialCategory = 'All',
  searchQuery,
  onSearchChange,
  onNavigate
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Sync category if initialCategory changes from outside
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.products.getCategories();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Load products based on query params
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');
        const res = await api.products.getAll({
          search: searchQuery || undefined,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          sort: sortBy,
          inStockOnly
        });
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, inStockOnly]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    onSearchChange('');
    setSortBy('newest');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery !== '' || sortBy !== 'newest' || inStockOnly;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
            All Products & Collections
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Discover quality goods engineered for durability, comfort, and style. All items in stock and dispatched via Cash on Delivery.
          </p>
        </div>

        {/* Filter and Control Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Stock Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-transparent border-none text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest Arrival</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Active Search Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
        <span>
          Showing <strong className="text-slate-800">{products.length}</strong> items
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </span>
      </div>

      {/* Products Content */}
      {loading ? (
        <LoadingSpinner message="Searching inventory..." fullHeight />
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-lg mx-auto">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={() => clearAllFilters()}
            className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            We couldn't find any items matching your selected criteria. Try adjusting your search term or clearing active filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onSelect={id => onNavigate('product-detail', id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
