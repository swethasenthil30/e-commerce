import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
}

export const Cart: React.FC<Props> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingPrice,
    totalPrice,
    freeShippingThreshold,
    amountUntilFreeShipping
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6 max-w-xs mx-auto leading-relaxed">
          Looks like you haven't added any products to your shopping bag yet. Explore our curated collections!
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center gap-2 mx-auto"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="space-y-8 pb-16">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
          Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items and continue to seamless Cash on Delivery checkout.
        </p>
      </div>

      {/* Free Shipping Progress Alert */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            {amountUntilFreeShipping > 0 ? (
              <span>
                Add <strong className="text-indigo-600">${amountUntilFreeShipping.toFixed(2)}</strong> more for <strong>FREE Delivery</strong>
              </span>
            ) : (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You unlocked Free Shipping!
              </span>
            )}
          </span>
          <span className="text-slate-400 font-semibold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              amountUntilFreeShipping === 0 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Product Items
            </span>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {items.map(item => {
            const itemTotal = Number((item.product.price * item.quantity).toFixed(2));
            return (
              <div
                key={item.product._id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Product Info */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => onNavigate('product-detail', item.product._id)}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {item.product.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Stock: {item.product.stockQuantity} available
                    </p>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.product.stockQuantity}
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total for this line */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-900">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-slate-900">${shippingPrice.toFixed(2)}</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Payment Option</span>
              <span className="font-bold text-slate-900">Cash on Delivery</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base">
              <span className="font-extrabold text-slate-900">Total Due</span>
              <span className="font-extrabold text-slate-900 tracking-tight text-xl">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cash on Delivery Guarantee Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Cash on Delivery Guaranteed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pay the exact amount of ${totalPrice.toFixed(2)} in cash when your package is handed over.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold text-center block transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
