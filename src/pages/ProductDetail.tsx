import React, { useEffect, useState } from 'react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import {
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle
} from 'lucide-react';

interface Props {
  productId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetail: React.FC<Props> = ({ productId, onNavigate }) => {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');
        const res = await api.products.getById(productId);
        if (res.success && res.product) {
          setProduct(res.product);
          setQuantity(1);

          // Load related products in same category
          const allRes = await api.products.getAll({ category: res.product.category });
          if (allRes.success) {
            setRelatedProducts(allRes.products.filter(p => p._id !== res.product._id).slice(0, 4));
          }
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return <LoadingSpinner message="Loading product details..." fullHeight />;
  }

  if (error || !product) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          {error || "The product you're looking for doesn't exist or has been removed."}
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addItem(product, quantity);
    if (res.success) {
      setJustAdded(true);
      setActionMessage(`Added ${quantity} item(s) to your shopping cart.`);
      setTimeout(() => setJustAdded(false), 2000);
      setTimeout(() => setActionMessage(''), 3000);
    } else {
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    onNavigate('checkout');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumb / Back button */}
      <div>
        <button
          onClick={() => onNavigate('products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>
      </div>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Product Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs border border-white/80">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({product.numReviews} customer reviews)</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk'] leading-snug">
                {product.name}
              </h1>

              {/* Price & Stock Badge */}
              <div className="flex items-baseline gap-4 pt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  ${product.price.toFixed(2)}
                </span>

                <div>
                  {isOutOfStock ? (
                    <span className="px-3 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                      Low Stock: {product.stockQuantity} remaining
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Product Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Picker & Add To Cart */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= product.stockQuantity}
                      onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                      className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Max: {product.stockQuantity} units
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : justAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-200'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Instant Checkout
                  </button>
                </div>

                {actionMessage && (
                  <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                    {actionMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Cash on Delivery</span>
                <span className="text-[10px] text-slate-400">Pay when delivered</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Free Shipping</span>
                <span className="text-[10px] text-slate-400">On orders over $50</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">30-Day Returns</span>
                <span className="text-[10px] text-slate-400">100% money back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
            More in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel._id}
                product={rel}
                onSelect={id => onNavigate('product-detail', id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
