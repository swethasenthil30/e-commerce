import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
  onOpenDocs: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenDocs }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pay only when you receive</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Easy Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Always here to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                Nova<span className="text-indigo-400">Mart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with modern full-stack technologies: React 19, Node.js Express, Mongoose, and JWT authentication. Clean design, secure order fulfillment, and resilient data storage.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenDocs}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                View System Specs & Windows Setup
              </button>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white mb-4">Shop Categories</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('products', 'Electronics')}
                  className="hover:text-white transition-colors"
                >
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'Fashion')}
                  className="hover:text-white transition-colors"
                >
                  Fashion & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', 'Home & Kitchen')}
                  className="hover:text-white transition-colors"
                >
                  Home & Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors"
                >
                  View All Products
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-white transition-colors">
                  View Shopping Cart
                </button>
              </li>
              <li>
                <span className="text-slate-400">Shipping Policy (Free over $50)</span>
              </li>
              <li>
                <span className="text-slate-400">Cash on Delivery Verification</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white mb-3">Stay Connected</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for exclusive flash sales and newly launched collection drops.
            </p>
            <form onSubmit={e => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NovaMart E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision & high reliability</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
