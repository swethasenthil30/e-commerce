import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { Terminal, BookOpen, Key, Server, CheckCircle2, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'windows-guide' | 'admin-setup' | 'testing'>('endpoints');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Documentation & Windows Developer Setup Guide" maxWidth="4xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shrink-0 ${
            activeTab === 'endpoints'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          API Endpoints
        </button>

        <button
          onClick={() => setActiveTab('windows-guide')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shrink-0 ${
            activeTab === 'windows-guide'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Windows + VS Code Setup
        </button>

        <button
          onClick={() => setActiveTab('admin-setup')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shrink-0 ${
            activeTab === 'admin-setup'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Key className="w-4 h-4" />
          Admin & MongoDB Setup
        </button>

        <button
          onClick={() => setActiveTab('testing')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shrink-0 ${
            activeTab === 'testing'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Feature Testing Checklist
        </button>
      </div>

      {/* Tab: API Endpoints */}
      {activeTab === 'endpoints' && (
        <div className="space-y-6 text-sm text-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2">REST API Architecture</h4>
            <p className="text-slate-600 mb-4">
              All routes are prefixed with <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono">/api</code>. Authenticated requests must include the <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono">Authorization: Bearer &lt;token&gt;</code> header.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="p-3 border-b border-slate-200">Method</th>
                  <th className="p-3 border-b border-slate-200">Endpoint</th>
                  <th className="p-3 border-b border-slate-200">Access</th>
                  <th className="p-3 border-b border-slate-200">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="p-3 font-mono font-bold text-emerald-600">POST</td>
                  <td className="p-3 font-mono font-semibold">/api/auth/register</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Public</span></td>
                  <td className="p-3">Register new customer account (name, email, password)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-emerald-600">POST</td>
                  <td className="p-3 font-mono font-semibold">/api/auth/login</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Public</span></td>
                  <td className="p-3">Authenticate user & return JWT token</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/auth/profile</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">User</span></td>
                  <td className="p-3">Fetch authenticated user profile</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/products</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Public</span></td>
                  <td className="p-3">Get products with search, category, sort & stock filters</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/products/:id</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Public</span></td>
                  <td className="p-3">Get single product details</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-emerald-600">POST</td>
                  <td className="p-3 font-mono font-semibold">/api/products</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Create new product (name, price, stock, image, category)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-amber-600">PUT</td>
                  <td className="p-3 font-mono font-semibold">/api/products/:id</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Update product details or stock level</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-rose-600">DELETE</td>
                  <td className="p-3 font-mono font-semibold">/api/products/:id</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Delete product from inventory</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-emerald-600">POST</td>
                  <td className="p-3 font-mono font-semibold">/api/orders</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">User</span></td>
                  <td className="p-3">Place order with Cash on Delivery & validate stock</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/orders/myorders</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">User</span></td>
                  <td className="p-3">Get user's order history & status tracking</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/orders</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Get all customer orders for management</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-amber-600">PUT</td>
                  <td className="p-3 font-mono font-semibold">/api/orders/:id/status</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Update status (Pending, Confirmed, Shipped, Delivered, Cancelled)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-600">GET</td>
                  <td className="p-3 font-mono font-semibold">/api/stats/dashboard</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">Admin</span></td>
                  <td className="p-3">Fetch revenue, orders count, low stock alerts, user metrics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Windows + VS Code Setup */}
      {activeTab === 'windows-guide' && (
        <div className="space-y-6 text-sm text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              Windows 10/11 & VS Code Step-by-Step Instructions
            </h4>
            <p className="text-slate-600 text-xs">
              Follow these simple terminal commands to run this complete full-stack e-commerce project locally on your Windows machine.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4">
              <h5 className="font-bold text-slate-900 mb-1">Step 1: Prerequisites</h5>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-600">
                <li>Install <strong>Node.js</strong> (v18 or higher) from <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-indigo-600 underline">nodejs.org</a></li>
                <li>Install <strong>Visual Studio Code</strong></li>
                <li>(Optional) Install <strong>MongoDB Community Server</strong> or create a free MongoDB Atlas URI</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-900">Step 2: Clone or Open Project in VS Code</h5>
                <button
                  onClick={() => copyToClipboard('code .', 'step2')}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-2">Open PowerShell or Command Prompt in the project folder:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                cd path\to\novamart-ecommerce{'\n'}code .
              </pre>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-900">Step 3: Install All Dependencies</h5>
                <button
                  onClick={() => copyToClipboard('npm install', 'step3')}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                npm install
              </pre>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-900">Step 4: Configure .env File</h5>
                <button
                  onClick={() => copyToClipboard('cp .env.example .env', 'step4')}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'step4' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-2">Copy the provided .env.example file:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                copy .env.example .env
              </pre>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-900">Step 5: Start the Full-Stack Application</h5>
                <button
                  onClick={() => copyToClipboard('npm run dev', 'step5')}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                >
                  {copiedKey === 'step5' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                This single command starts Express backend + Vite frontend with hot reload:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                npm run dev
              </pre>
              <p className="mt-2 text-xs text-slate-500">
                Then open your browser at <span className="font-semibold text-indigo-600">http://localhost:3000</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Admin & MongoDB Setup */}
      {activeTab === 'admin-setup' && (
        <div className="space-y-6 text-sm text-slate-700">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <h4 className="font-bold text-purple-900 mb-1">Pre-configured Demo Credentials</h4>
            <p className="text-purple-800 text-xs mb-3">
              You can log in immediately using these pre-seeded accounts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <p className="font-bold text-purple-950 mb-1">Administrator Account</p>
                <p className="font-mono text-slate-600">Email: admin@novamart.com</p>
                <p className="font-mono text-slate-600">Password: admin123</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Full Admin Dashboard Access
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <p className="font-bold text-purple-950 mb-1">Customer Account</p>
                <p className="font-mono text-slate-600">Email: user@novamart.com</p>
                <p className="font-mono text-slate-600">Password: user123</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Customer & Order Tracking
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2">How to Create an Admin Account Securely</h4>
            <p className="text-xs text-slate-600 mb-3">
              There are two ways to securely create an admin user:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
              <li>
                <strong>Using the secure API endpoint:</strong> Send a POST request to <code className="bg-slate-100 px-1 py-0.5 font-mono text-indigo-600">/api/auth/setup-admin</code> with the master setup key:
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs mt-2 overflow-x-auto">
{`curl -X POST http://localhost:3000/api/auth/setup-admin \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Head Admin",
    "email": "myadmin@company.com",
    "password": "MyStrongPassword123!",
    "adminKey": "admin123"
  }'`}
                </pre>
              </li>
              <li>
                <strong>In MongoDB Compass or Shell:</strong> If using MongoDB directly, set <code className="bg-slate-100 px-1 py-0.5 font-mono text-indigo-600">role: "admin"</code> on the user document.
              </li>
            </ol>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2">MongoDB Configuration</h4>
            <p className="text-xs text-slate-600 mb-2">
              NovaMart includes dual-engine architecture:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5">
              <li><strong>Local / In-Container:</strong> When no MongoDB instance is running, NovaMart automatically falls back to its persistent JSON store at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/backend/data/store.json</code> with zero configuration required.</li>
              <li><strong>Real MongoDB Atlas / Local MongoDB:</strong> Set <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/novamart"</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code> file. The server will automatically connect with Mongoose!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Testing Checklist */}
      {activeTab === 'testing' && (
        <div className="space-y-4 text-sm text-slate-700">
          <h4 className="font-bold text-slate-900 text-base">Complete Feature Verification Checklist</h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">1. Authentication & Role-Based Access</p>
                <p className="text-slate-600">Register a new customer account or log in with Admin / Alex Johnson. Verify JWT token persistence and role restrictions.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">2. Product Catalog, Search & Filtering</p>
                <p className="text-slate-600">Search for "Sony" or "Backpack", filter by category (Electronics, Fashion, Home & Kitchen), sort by price low-to-high or rating.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">3. Shopping Cart & Stock Validation</p>
                <p className="text-slate-600">Add products to cart, increment/decrement quantities, check the free shipping threshold calculation, and verify you cannot exceed available stock.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">4. Cash on Delivery Checkout</p>
                <p className="text-slate-600">Fill delivery address and phone number, place order with Cash on Delivery. Receive instant unique Order ID (e.g. ORD-94281).</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">5. Order Tracking & Lifecycle</p>
                <p className="text-slate-600">Open "My Orders" to see timeline tracking (Pending → Confirmed → Shipped → Delivered). Test order cancellation.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">6. Admin Dashboard & Product CRUD</p>
                <p className="text-slate-600">Switch to Admin role, open Admin Dashboard. Add a new product, edit existing product price/stock, delete a product, and update customer order status to "Shipped" or "Delivered".</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
        >
          Close Documentation
        </button>
      </div>
    </Modal>
  );
};
