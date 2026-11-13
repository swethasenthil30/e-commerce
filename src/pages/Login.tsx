import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { AlertBanner } from '../components/AlertBanner.tsx';
import { ShoppingBag, Lock, Mail, Eye, EyeOff, ShieldAlert, UserCheck, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (view: string, param?: string) => void;
}

export const Login: React.FC<Props> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@novamart.com');
    setPassword('admin123');
    setError('');
  };

  const fillCustomer = () => {
    setEmail('user@novamart.com');
    setPassword('user123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-12 pb-16">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your saved orders, cart, and dashboard.
          </p>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        {/* Demo Credentials Quick-Fill helper */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
            ⚡ Quick-Fill Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Fill Admin</span>
            </button>
            <button
              type="button"
              onClick={fillCustomer}
              className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Fill Customer</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
