import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Product, Order, AdminStats, OrderStatus } from '../types/index.ts';
import { api } from '../services/api.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { AlertBanner } from '../components/AlertBanner.tsx';
import { Modal } from '../components/Modal.tsx';
import {
  ShieldAlert,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
  onOpenDocs: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onNavigate, onOpenDocs }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'system'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    imageUrl: '',
    stockQuantity: '15',
    isFeatured: false
  });

  // Order status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [statusNote, setStatusNote] = useState('');

  // Delete product confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.stats.getDashboard(),
        api.products.getAll(),
        api.orders.getAll()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (productsRes.success) setProducts(productsRes.products);
      if (ordersRes.success) setOrders(ordersRes.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Administrator Access Only
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
          You must be logged in as an Administrator to view metrics, manage products, and update customer order dispatch states.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Sign In as Admin (admin@novamart.com)
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Handle open Add/Edit product modal
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        description: prod.description,
        price: String(prod.price),
        category: prod.category,
        imageUrl: prod.imageUrl,
        stockQuantity: String(prod.stockQuantity),
        isFeatured: !!prod.isFeatured
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        stockQuantity: '20',
        isFeatured: false
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        const res = await api.products.update(editingProduct._id, {
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          category: productForm.category,
          imageUrl: productForm.imageUrl,
          stockQuantity: Number(productForm.stockQuantity),
          isFeatured: productForm.isFeatured
        });
        if (res.success) {
          setSuccessMsg(`Product "${productForm.name}" updated successfully!`);
          setProductModalOpen(false);
          loadDashboardData();
        }
      } else {
        // Create
        const res = await api.products.create({
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          category: productForm.category,
          imageUrl: productForm.imageUrl,
          stockQuantity: Number(productForm.stockQuantity),
          isFeatured: productForm.isFeatured
        });
        if (res.success) {
          setSuccessMsg(`New product "${productForm.name}" added to catalog!`);
          setProductModalOpen(false);
          loadDashboardData();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await api.products.delete(productToDelete._id);
      if (res.success) {
        setSuccessMsg(`Product "${productToDelete.name}" deleted from store.`);
        setDeleteModalOpen(false);
        setProductToDelete(null);
        loadDashboardData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await api.orders.updateStatus(selectedOrder._id, newStatus, statusNote);
      if (res.success) {
        setSuccessMsg(`Order ${selectedOrder.orderId} status set to ${newStatus}`);
        setStatusModalOpen(false);
        setSelectedOrder(null);
        setStatusNote('');
        loadDashboardData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('Are you sure you want to restore the database to original demo seeds?')) return;
    try {
      const res = await api.stats.resetSeed();
      if (res.success) {
        setSuccessMsg('Database refreshed with initial sample data and accounts.');
        loadDashboardData();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset seed');
    }
  };

  const filteredOrders =
    orderFilterStatus === 'All'
      ? orders
      : orders.filter(o => o.orderStatus === orderFilterStatus);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-[11px] font-bold border border-purple-400/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administrator Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
              NovaMart Operations Hub
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as <strong className="text-white">{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={onOpenDocs}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              API Docs & Windows Setup
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-purple-800/60 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
              activeTab === 'products'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
              activeTab === 'system'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Database & Seed Controls
          </button>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {successMsg && <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      {loading ? (
        <LoadingSpinner message="Loading live operational metrics..." fullHeight />
      ) : (
        <>
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales Volume</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                    ${stats.totalRevenue.toFixed(2)}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>From confirmed Cash on Delivery</span>
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                    {stats.totalOrders}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">Across all order lifecycle stages</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                    {stats.totalProducts}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stats.lowStockCount > 0 ? (
                      <span className="text-amber-600 font-semibold">
                        {stats.lowStockCount} items low in stock
                      </span>
                    ) : (
                      'All items healthy'
                    )}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
                    {stats.totalUsers}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">Verified customer & admin accounts</p>
                </div>
              </div>

              {/* Order Status Breakdown Grid */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Orders by Pipeline Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(st => (
                    <div
                      key={st}
                      onClick={() => {
                        setOrderFilterStatus(st);
                        setActiveTab('orders');
                      }}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer text-center"
                    >
                      <span className="text-2xl font-extrabold text-slate-900 block font-['Space_Grotesk']">
                        {stats.statusCounts[st] || 0}
                      </span>
                      <span className="mt-1 block">
                        <StatusBadge status={st} size="sm" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning Section */}
              {stats.lowStockItems.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-amber-950">
                      Inventory Warning: {stats.lowStockItems.length} Products Low in Stock
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stats.lowStockItems.map(item => (
                      <div
                        key={item._id}
                        className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <span className="text-slate-400">{item.category}</span>
                        </div>
                        <span className="px-2.5 py-1 font-bold text-amber-800 bg-amber-100 rounded-full text-xs">
                          {item.stockQuantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search product inventory..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Inventory Stock</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredProducts.map(prod => (
                        <tr key={prod._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block line-clamp-1">{prod.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{prod._id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-medium text-slate-700">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-900">${prod.price.toFixed(2)}</td>
                          <td className="p-4">
                            {prod.stockQuantity <= 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                                0 (Out of stock)
                              </span>
                            ) : prod.stockQuantity <= 5 ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                                {prod.stockQuantity} (Low stock)
                              </span>
                            ) : (
                              <span className="font-semibold text-emerald-700">
                                {prod.stockQuantity} in stock
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            ⭐ {prod.rating.toFixed(1)} ({prod.numReviews})
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(prod)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setDeleteModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Orders Management */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order filter buttons */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Filter:</span>
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
                      orderFilterStatus === st
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st} {st !== 'All' && `(${orders.filter(o => o.orderStatus === st).length})`}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Delivery City</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total (COD)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredOrders.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 font-mono font-extrabold text-indigo-700">
                            {order.orderId}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900 block">{order.user.name}</span>
                            <span className="text-[11px] text-slate-400">{order.user.email}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800">{order.shippingAddress.city}</span>
                            <span className="text-[11px] text-slate-400 block">{order.shippingAddress.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-slate-800">
                              {order.orderItems.length} item(s)
                            </span>
                          </td>
                          <td className="p-4 font-extrabold text-slate-900">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={order.orderStatus} size="sm" />
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.orderStatus);
                                setStatusModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Database & Seed Controls */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Database Engine & Connection Info</h3>
                    <p className="text-xs text-slate-500">
                      View current active database mode and test data restoration options.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase block mb-1">Active Storage Engine</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {stats?.database.storageType}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase block mb-1">Connection State</span>
                    <span className="text-base font-extrabold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Connected & Ready
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase block mb-1">Payment Method</span>
                    <span className="text-base font-extrabold text-slate-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                </div>

                {/* Seed reset */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Restore Sample Catalog & Accounts</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Resets store inventory to 12 realistic products and creates standard test accounts.
                    </p>
                  </div>
                  <button
                    onClick={handleResetSeed}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Seed Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <Modal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          title={editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={productForm.description}
                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Detailed specifications, features, and materials..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={productForm.price}
                  onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="299.99"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inventory Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={productForm.stockQuantity}
                  onChange={e => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                  placeholder="15"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={productForm.category}
                  onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Audio">Audio</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Image URL *</label>
              <input
                type="url"
                required
                value={productForm.imageUrl}
                onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={productForm.isFeatured}
                onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Highlight as Featured on Homepage
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Update Order Status Modal */}
      {statusModalOpen && selectedOrder && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Order Status: ${selectedOrder.orderId}`}
          maxWidth="md"
        >
          <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Set New Pipeline Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="Pending">Pending (Awaiting fulfillment)</option>
                <option value="Confirmed">Confirmed (Verified & packing)</option>
                <option value="Shipped">Shipped (Dispatched with courier)</option>
                <option value="Delivered">Delivered (Handed over & cash collected)</option>
                <option value="Cancelled">Cancelled (Restore inventory stock)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Internal Tracking Note / Message
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="e.g. Courier tracking #FX-8942 assigned"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Update Order Status
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Product Modal */}
      {deleteModalOpen && productToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={`Delete Product`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">"{productToDelete.name}"</strong>? This will remove it from the catalog.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Delete Product
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
