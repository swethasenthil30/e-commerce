import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ApiDocsModal } from './components/ApiDocsModal.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { Products } from './pages/Products.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { Cart } from './pages/Cart.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { MyOrders } from './pages/MyOrders.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';

export function MainLayout() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [initialCategory, setInitialCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'product-detail' && param) {
      setSelectedProductId(param);
      setCurrentView('product-detail');
      return;
    }

    if (view === 'products') {
      if (param) {
        setInitialCategory(param);
      }
      setCurrentView('products');
      return;
    }

    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'products':
        return (
          <Products
            initialCategory={initialCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
          />
        );
      case 'product-detail':
        return <ProductDetail productId={selectedProductId} onNavigate={handleNavigate} />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'orders':
        return <MyOrders onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} onOpenDocs={() => setIsDocsOpen(true)} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDocs={() => setIsDocsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderContent()}
      </main>

      <Footer onNavigate={handleNavigate} onOpenDocs={() => setIsDocsOpen(true)} />

      <ApiDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}
