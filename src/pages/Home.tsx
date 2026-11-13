import React, { useEffect, useState } from 'react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Headphones, ChevronRight, Star } from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
}

export const Home: React.FC<Props> = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await api.products.getAll();
        if (res.success) {
          // Take top products
          setFeaturedProducts(res.products.slice(0, 8));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white rounded-3xl border border-indigo-100/60 p-6 sm:p-12 lg:p-16 my-4 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Autumn 2026 Premium Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-['Space_Grotesk']">
              Modern Lifestyle, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Exceptional Quality.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Explore curated audio, electronics, designer accessories, and home goods.
              Guaranteed genuine products delivered straight to your door with <strong>Cash on Delivery</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products', 'Electronics')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                Shop Electronics
              </button>
            </div>

            {/* Quick Stats / Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/70 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Authentic Gear</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">$0</p>
                <p className="text-xs text-slate-500 font-medium">Shipping Over $50</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">COD</p>
                <p className="text-xs text-slate-500 font-medium">Pay on Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Feature Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] lg:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                alt="Sony Wireless Headphones"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Featured Product
                </span>
                <h3 className="text-lg font-bold">Sony WH-1000XM5 Wireless</h3>
                <p className="text-xs text-slate-200 mt-1">Noise Canceling • 30h Battery • $399.99</p>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Verified Cash on Delivery</p>
                <p className="text-[11px] text-slate-500">Inspect before paying</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Navigation */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a department to explore curated premium items
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('products', 'Electronics')}
            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200"
          >
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
              alt="Electronics"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-semibold text-indigo-300">Cutting Edge</span>
              <h3 className="text-xl font-bold">Electronics & Audio</h3>
              <p className="text-xs text-slate-300 mt-1">Headphones, smartwatches, cameras</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('products', 'Fashion')}
            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200"
          >
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
              alt="Fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-semibold text-amber-300">Signature Style</span>
              <h3 className="text-xl font-bold">Fashion & Apparel</h3>
              <p className="text-xs text-slate-300 mt-1">Bags, knitwear, footwear</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('products', 'Home & Kitchen')}
            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200"
          >
            <img
              src="https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80"
              alt="Home & Kitchen"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-semibold text-emerald-300">Modern Living</span>
              <h3 className="text-xl font-bold">Home & Kitchen</h3>
              <p className="text-xs text-slate-300 mt-1">Coffee grinders, lamps, ergonomics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
              Featured Trending Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>See All Products ({featuredProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading best-selling catalog..." />
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
            <p className="text-sm text-rose-700 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={id => onNavigate('product-detail', id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cash on Delivery Feature Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
            Risk-Free Guarantee
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
            Order Today, Pay Only When It Arrives
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            With NovaMart's genuine <strong>Cash on Delivery (COD)</strong> policy, you inspect your package upon delivery before handing payment to the courier. No advance online charges required.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
            >
              Start Shopping Now
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-600/30 to-transparent pointer-events-none" />
      </section>
    </div>
  );
};
