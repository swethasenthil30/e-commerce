import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { AlertBanner } from '../components/AlertBanner.tsx';
import { Modal } from '../components/Modal.tsx';
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
}

export const MyOrders: React.FC<Props> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Changed mind');
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.orders.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
        <Package className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk']">
          Track Your Orders
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Please log in to view your placed orders, shipping status, and delivery tracking.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      setCancelling(true);
      const res = await api.orders.cancel(orderToCancel._id, cancelReason);
      if (res.success) {
        setSuccessMsg(`Order ${orderToCancel.orderId} was cancelled successfully. Inventory restored.`);
        setCancelModalOpen(false);
        setOrderToCancel(null);
        fetchOrders();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  // Status step progression helper
  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk']">
          My Order History & Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your previous purchases, track real-time dispatch progress, and view item invoices.
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {successMsg && <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      {loading ? (
        <LoadingSpinner message="Retrieving order history..." fullHeight />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            No Orders Yet
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
            You haven't placed any orders yet. Select from our trending collections with Cash on Delivery guarantee!
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 mx-auto"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const step = getStepProgress(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                        Order Reference
                      </span>
                      <span className="font-mono text-sm font-extrabold text-slate-900">
                        {order.orderId}
                      </span>
                    </div>

                    <div className="hidden sm:block border-l border-slate-200 h-8" />

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                        Date Placed
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="hidden sm:block border-l border-slate-200 h-8" />

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                        Total Due (COD)
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.orderStatus} />
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                {!isCancelled && (
                  <div className="px-6 py-4 border-b border-slate-100 bg-white">
                    <div className="max-w-3xl mx-auto">
                      <div className="grid grid-cols-4 relative text-center">
                        {/* Connecting Line */}
                        <div className="absolute top-3.5 left-0 right-0 h-1 bg-slate-100 -z-0">
                          <div
                            className="h-full bg-indigo-600 transition-all duration-500"
                            style={{
                              width: `${((Math.max(1, step) - 1) / 3) * 100}%`
                            }}
                          />
                        </div>

                        {/* Step 1: Placed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-slate-700">Placed</span>
                        </div>

                        {/* Step 2: Confirmed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {step >= 2 ? '✓' : '2'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-slate-700">Confirmed</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {step >= 3 ? '✓' : '3'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-slate-700">Shipped</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {step >= 4 ? '✓' : '4'}
                          </div>
                          <span className="mt-1 text-[11px] font-semibold text-slate-700">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items in this order */}
                <div className="p-5 sm:p-6 divide-y divide-slate-100">
                  {order.orderItems.map(item => (
                    <div
                      key={item.productId}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Quantity: <strong>{item.quantity}</strong> × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3 sm:px-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Delivering to {order.shippingAddress.city}, {order.shippingAddress.postalCode}</span>
                  </div>

                  {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                    <button
                      onClick={() => {
                        setOrderToCancel(order);
                        setCancelModalOpen(true);
                      }}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-xs transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Breakdown: ${selectedOrder.orderId}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs text-slate-700">
            {/* Header Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status
                </span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.orderStatus} size="lg" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Payment Method
                </span>
                <span className="font-bold text-slate-900 text-sm">Cash on Delivery</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Shipping Destination
              </h4>
              <p className="font-semibold text-slate-800">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-slate-600">{selectedOrder.shippingAddress.address}</p>
              <p className="text-slate-600">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-slate-600 flex items-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {selectedOrder.shippingAddress.phone}
              </p>
            </div>

            {/* Items table */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2">Ordered Items</h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.orderItems.map(item => (
                  <div key={item.productId} className="p-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        <span className="block text-[11px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>
                  {selectedOrder.shippingPrice === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `$${selectedOrder.shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total Amount Due</span>
                <span>${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Status History Timeline */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2">Order Activity Log</h4>
              <div className="space-y-2 border-l-2 border-indigo-200 ml-2 pl-3">
                {selectedOrder.statusHistory.map((h, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{h.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {h.note && <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && orderToCancel && (
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title={`Cancel Order ${orderToCancel.orderId}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to cancel this order? Since this is a Cash on Delivery order, no payment will be collected, and the reserved items will be released back into inventory.
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Changed mind">Changed mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery address incorrect">Delivery address incorrect</option>
                <option value="Found alternative item">Found alternative item</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
