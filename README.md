# NovaMart Premium E-Commerce Platform

A complete, modern, responsive full-stack **E-Commerce Web Application** built with **React 19**, **Vite**, **Express.js**, **Node.js**, **Mongoose / MongoDB**, and **JWT Authentication**.

---

## 📁 1. Project Folder Structure

```
├── backend/                        # Complete Express Backend Architecture
│   ├── config/
│   │   └── db.ts                   # Database connection (MongoDB + fallback persistent store)
│   ├── controllers/
│   │   ├── authController.ts       # Register, login, profile, secure admin creation
│   │   ├── productController.ts    # Search, category filter, sorting, admin CRUD
│   │   ├── orderController.ts      # Checkout, stock deduction, my orders, order cancellation
│   │   └── statsController.ts      # Analytics, sales revenue, low-stock warnings, seed reset
│   ├── data/
│   │   ├── seedData.ts             # 12 curated realistic sample products with HD images
│   │   └── store.json              # Persistent local database store
│   ├── middleware/
│   │   └── auth.ts                 # JWT protect middleware & adminOnly authorization
│   ├── models/
│   │   ├── User.ts                 # User Mongoose model + UserRepo
│   │   ├── Product.ts              # Product Mongoose model + ProductRepo
│   │   └── Order.ts                # Order Mongoose model + OrderRepo (with stock management)
│   └── routes/
│       ├── authRoutes.ts           # /api/auth/* endpoints
│       ├── productRoutes.ts        # /api/products/* endpoints
│       ├── orderRoutes.ts          # /api/orders/* endpoints
│       └── statsRoutes.ts          # /api/stats/* endpoints
│
├── src/                            # Modern React 19 Frontend
│   ├── components/
│   │   ├── AlertBanner.tsx         # Dismissible notifications (error, success, info)
│   │   ├── ApiDocsModal.tsx        # Interactive in-app API documentation & setup viewer
│   │   ├── Footer.tsx              # Trust badges, links, Cash on Delivery features
│   │   ├── LoadingSpinner.tsx      # Smooth SVG loaders
│   │   ├── Modal.tsx               # Reusable dialog component
│   │   ├── Navbar.tsx              # Header with search, role switcher, cart badge, menu
│   │   ├── ProductCard.tsx         # Attractive product card with stock badges & Add to Cart
│   │   └── StatusBadge.tsx         # Color-coded badges for order fulfillment stages
│   ├── context/
│   │   ├── AuthContext.tsx         # User authentication, token management, demo switchers
│   │   └── CartContext.tsx         # Cart items, stock checks, free shipping threshold
│   ├── pages/
│   │   ├── AdminDashboard.tsx      # KPI stats, product CRUD modal, order status pipeline
│   │   ├── Cart.tsx                # Cart items, quantity controls, subtotal breakdown
│   │   ├── Checkout.tsx            # Shipping form, Cash on Delivery (COD) confirmation
│   │   ├── Home.tsx                # Hero banner, department shortcuts, featured products
│   │   ├── Login.tsx               # Sign in with password toggle & 1-click demo fillers
│   │   ├── MyOrders.tsx            # Order timeline tracking, status history, cancellations
│   │   ├── ProductDetail.tsx       # HD gallery, stock counter, quantity picker, related items
│   │   ├── Products.tsx            # Full catalog with search, category pills, price sorting
│   │   └── Register.tsx            # New customer account registration
│   ├── services/
│   │   └── api.ts                  # Fetch API client with Bearer token injection
│   ├── types/
│   │   └── index.ts                # Unified TypeScript definitions
│   ├── App.tsx                     # Main layout & router orchestration
│   ├── index.css                   # Tailwind CSS styling
│   └── main.tsx                    # React DOM entry point
│
├── .env.example                    # Environment variable template
├── index.html                      # HTML entry with Plus Jakarta Sans & Space Grotesk fonts
├── package.json                    # Full-stack dependencies & scripts
├── server.ts                       # Unified Express server hosting API & Vite middlewares
├── tsconfig.json                   # Strict TypeScript compiler options
└── vite.config.ts                  # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 2. Windows & VS Code Setup Instructions

Follow these step-by-step instructions to run NovaMart on Windows 10/11 using VS Code.

### Step A: Prerequisites
1. Install **Node.js** (v18 or higher) from [https://nodejs.org](https://nodejs.org).
2. Install **Visual Studio Code** from [https://code.visualstudio.com](https://code.visualstudio.com).
3. *(Optional)* Install **MongoDB Community Server** or create a free database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). If you don't have MongoDB installed, NovaMart automatically falls back to its persistent JSON database engine out of the box!

### Step B: Open in VS Code
Open PowerShell or Command Prompt, navigate to the folder, and launch VS Code:
```powershell
cd path\to\novamart-ecommerce
code .
```

### Step C: Install Dependencies
Open the integrated terminal in VS Code (`Ctrl + ` `~` or **Terminal > New Terminal**) and execute:
```powershell
npm install
```

### Step D: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
Inside `.env`, verify or adjust:
```ini
PORT=3000
MONGODB_URI="mongodb://127.0.0.1:27017/novamart"
JWT_SECRET="novamart_jwt_super_secure_secret_token_key_2026"
NODE_ENV="development"
```
*(If local MongoDB is not running, the application will automatically fall back to its internal persistent store with zero configuration).*

### Step E: Start the Application
Run the full-stack development command:
```powershell
npm run dev
```
Open your browser at:
👉 **`http://localhost:3000`**

---

## 🔑 3. Pre-Configured Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@novamart.com` | `admin123` | Full Admin Dashboard, product CRUD, order status pipeline |
| **Customer** | `user@novamart.com` | `user123` | Shopping cart, COD checkout, order tracking & cancellations |

> **Pro-Tip:** In the top navigation bar or the Login page, use the **1-Click Quick Fill** buttons to switch between Admin and Customer without manual re-typing!

---

## 🛡️ 4. Secure Admin Account Creation

To provision an administrator account securely:

### Option 1: Secure API Endpoint
Send a `POST` request to `/api/auth/setup-admin` with the setup key:
```bash
curl -X POST http://localhost:3000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@novamart.com",
    "password": "StrongPassword123!",
    "adminKey": "admin123"
  }'
```

### Option 2: In MongoDB
If using MongoDB Atlas or Compass, edit the document in the `users` collection and set:
```json
{
  "role": "admin"
}
```

---

## 📡 5. REST API Documentation

All API endpoints are hosted at `/api/*`:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create customer account (`name`, `email`, `password`, `phone`, `address`)
- `POST /api/auth/login` - Authenticate with email & password, returns JWT token
- `GET /api/auth/profile` - Get logged-in user profile (*Requires JWT token*)
- `PUT /api/auth/profile` - Update user address and phone number (*Requires JWT token*)
- `POST /api/auth/setup-admin` - Securely create or promote an admin account using `adminKey`

### Products (`/api/products`)
- `GET /api/products` - List products with query parameters:
  - `?search=query`
  - `?category=Electronics|Fashion|Home & Kitchen`
  - `?sort=price_asc|price_desc|rating|newest|name`
  - `?inStockOnly=true`
- `GET /api/products/categories` - Returns unique product categories
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Add product (*Admin only*)
- `PUT /api/products/:id` - Update product details or stock (*Admin only*)
- `DELETE /api/products/:id` - Remove product from store (*Admin only*)

### Orders & Tracking (`/api/orders`)
- `POST /api/orders` - Place order with **Cash on Delivery**, validates stock and decrements inventory (*User*)
- `GET /api/orders/myorders` - Get current user's order history (*User*)
- `GET /api/orders/:id` - Get order details by ID (*Owner or Admin*)
- `PUT /api/orders/:id/cancel` - Cancel order and restore stock into inventory (*Owner or Admin*)
- `GET /api/orders` - List all orders across all customers (*Admin only*)
- `PUT /api/orders/:id/status` - Advance order status: `Pending` → `Confirmed` → `Shipped` → `Delivered` (*Admin only*)

### Dashboard & Analytics (`/api/stats`)
- `GET /api/stats/dashboard` - Total revenue, orders, products, users, low-stock items (*Admin only*)
- `POST /api/stats/reset-seed` - Restore database to original demo seeds (*Admin only*)

### System Health
- `GET /api/health` - Server health check, active database mode, and connection status

---

## 🧪 6. Testing Major Features

1. **Browsing & Search:**
   - Search for "Sony" or "Backpack" in the top search bar.
   - Click "Electronics" or "Fashion" to filter products by category.
   - Toggle "In Stock Only" or sort by "Price: Low to High".
2. **Product Details:**
   - Click any product to view its high-res image, rating breakdown, stock count, and quantity picker.
   - Add items to your cart.
3. **Cart & Shipping Calculation:**
   - Open Cart via the top shopping bag icon.
   - Adjust quantities with `+` and `-`.
   - Notice the Free Delivery progress bar (unlocked at $50).
4. **Cash on Delivery Checkout:**
   - Click "Proceed to Checkout".
   - Enter your delivery address and phone number.
   - Submit order with Cash on Delivery. An instant unique reference ID (e.g., `ORD-94281`) will be issued.
5. **Order Tracking:**
   - Click "My Orders" to see your order progression (`Placed` → `Confirmed` → `Shipped` → `Delivered`).
   - Click "Details" to view the timestamp activity log.
   - Test canceling an order to verify inventory restoration.
6. **Admin Dashboard:**
   - Switch to the **Admin** role via the top right user menu or demo switcher.
   - Click **Admin Panel** to inspect total revenue, order count, and low-stock alerts.
   - Add a new product or edit an existing product's price and stock.
   - In "Orders & Shipments", update an order status from `Pending` to `Shipped` or `Delivered`.
   - Open the in-app **API Docs & Windows Setup** modal from the header for quick reference!
