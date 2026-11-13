import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { AlertBanner } from '../components/AlertBanner.tsx';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  ShoppingBag,
  CreditCard
} from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
}

export const Checkout: React.FC<Props> = ({ onNavigate }) => {
  const { items, subtotal, shippingPrice, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!address && user.address?.street) setAddress(user.address.street);
      if (!city && user.address?.city) setCity(user.address.city);
      if (!postalCode && user.address?.postalCode) setPostalCode(user.address.postalCode);
    }
  }, [user]);

  if (placedOrderId) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-sm animate-in fade-in-50">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Confirmed
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-3 font-['Space_Grotesk']">
          Thank you for your order!
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Your unique Order Reference number is:
        </p>
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-indigo-700 tracking-wider">
          {placedOrderId}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          We are preparing your items for shipment. You will pay{' '}
          <strong className="text-slate-900 font-bold">${totalPrice.toFixed(2)}</strong> via{' '}
          <strong>Cash on Delivery</strong> when the courier arrives at your address.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => onNavigate('orders')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track My Order</span>
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12">
        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Your cart is empty</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Add items before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
        >
          View Products
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please log in or register before completing your order.');
      onNavigate('login');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setError('Please fill in all delivery details: Name, Phone, Address, City, and Postal Code.');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        orderItems: items.map(i => ({
          productId: i.product._id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          imageUrl: i.product.imageUrl
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim()
        },
        paymentMethod: 'Cash on Delivery' as const
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.order) {
        setPlacedOrderId(res.order.orderId);
        clearCart();
      } else {
        setError(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout. Please check stock availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
          Checkout & Shipping Details
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your delivery address and confirm your Cash on Delivery order.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Sign in required to save and track your order</p>
              <p className="text-[11px] text-amber-700">You can also use one-click demo credentials.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0 transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Delivery Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Delivery Address
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contact Phone Number (For Courier) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Street Address & Apartment / Suite *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Springfield"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder="e.g. 97477"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Payment Method
            </h3>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border-2 border-indigo-500 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked={true}
                  readOnly
                  className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="cod" className="cursor-pointer">
                  <span className="font-bold text-slate-900 block text-xs">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                    Pay in exact cash directly to the dispatch agent when your parcel arrives. No cards or online pre-payments needed.
                  </span>
                </label>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full shrink-0 border border-emerald-200">
                100% Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          {/* Items thumbnail list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {items.map(i => (
              <div key={i.product._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={i.product.imageUrl}
                    alt={i.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800 line-clamp-1">{i.product.name}</h4>
                    <span className="text-slate-500 text-[11px]">
                      Qty: {i.quantity} × ${i.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ${(i.product.price * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    FREE SHIPPING
                  </span>
                ) : (
                  <span className="font-bold text-slate-900">${shippingPrice.toFixed(2)}</span>
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base">
              <span className="font-extrabold text-slate-900">Total Due (COD)</span>
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Verifying Stock & Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Order via Cash on Delivery</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            By confirming, you agree to inspect and pay upon delivery.
          </p>
        </div>
      </form>
    </div>
  );
};
