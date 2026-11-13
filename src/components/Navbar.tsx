import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Package,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenDocs: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  onOpenDocs,
  searchQuery,
  onSearchChange
}) => {
  const { user, isAuthenticated, isAdmin, logout, quickLoginAs } = useAuth();
  const { totalItems } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('products');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
            Exclusive
          </span>
          <span>Free Express Shipping on all orders over $50 | 100% Cash on Delivery</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <button
            onClick={onOpenDocs}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>API Docs & Windows Setup</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Space_Grotesk']">
                Nova<span className="text-indigo-600">Mart</span>
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                Full-Stack
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products, headphones, fashion, cameras..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </form>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('products')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentView === 'products'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Shop All
            </button>

            {isAuthenticated && (
              <button
                onClick={() => onNavigate('orders')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === 'orders'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                My Orders
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'text-purple-700 bg-purple-50 border border-purple-200'
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50/50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[11px] rounded-full h-5 w-5 flex items-center justify-center shadow-xs animate-in zoom-in-75">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          Role: {user?.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => onNavigate('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders & Tracking
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-semibold"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-500" />
                          Admin Dashboard
                        </button>
                      )}
                    </div>

                    {/* Quick Demo Switcher helper */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50/70">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Quick Role Switcher
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => quickLoginAs('admin')}
                          className={`text-[11px] font-semibold py-1 px-2 rounded-lg border transition-colors ${
                            isAdmin
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => quickLoginAs('user')}
                          className={`text-[11px] font-semibold py-1 px-2 rounded-lg border transition-colors ${
                            !isAdmin
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Customer
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('products');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Shop All Products
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  onNavigate('orders');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                My Orders & Tracking
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 rounded-lg"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              API Docs & Windows Setup Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
