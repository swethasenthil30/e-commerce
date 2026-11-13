import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface Props {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onSelect }) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const res = addItem(product, 1);
    if (res.success) {
      setJustAdded(true);
      setErrorMsg('');
      setTimeout(() => setJustAdded(false), 1600);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div
      onClick={() => onSelect(product._id)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-800 rounded-full shadow-xs border border-white/50">
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-xs font-bold bg-rose-500 text-white rounded-full shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 text-xs font-medium bg-amber-500 text-white rounded-full shadow-xs">
              Only {product.stockQuantity} left
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-500/90 text-white rounded-full backdrop-blur-xs">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.numReviews})</span>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-200 scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-100'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <p className="mt-2 text-[11px] text-rose-600 font-medium">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};
