import { Product, Order, AdminStats, User } from '../types/index.ts';

const BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('novamart_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('novamart_token', token);
  } else {
    localStorage.removeItem('novamart_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    register: (userData: { name: string; email: string; password: string; phone?: string; address?: any }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    getProfile: () => request<{ success: boolean; user: User }>('/auth/profile'),

    updateProfile: (profileData: { name?: string; phone?: string; address?: any }) =>
      request<{ success: boolean; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),

    setupAdmin: (payload: { name: string; email: string; password: string; adminKey: string }) =>
      request<{ success: boolean; message: string; user: User }>('/auth/setup-admin', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  // Products
  products: {
    getAll: (params?: {
      search?: string;
      category?: string;
      sort?: string;
      minPrice?: number;
      maxPrice?: number;
      inStockOnly?: boolean;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.sort) searchParams.append('sort', params.sort);
      if (params?.minPrice !== undefined) searchParams.append('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) searchParams.append('maxPrice', String(params.maxPrice));
      if (params?.inStockOnly) searchParams.append('inStockOnly', 'true');

      const queryStr = searchParams.toString();
      return request<{ success: boolean; count: number; products: Product[] }>(
        `/products${queryStr ? `?${queryStr}` : ''}`
      );
    },

    getById: (id: string) => request<{ success: boolean; product: Product }>(`/products/${id}`),

    getCategories: () => request<{ success: boolean; categories: string[] }>('/products/categories'),

    create: (productData: Partial<Product>) =>
      request<{ success: boolean; product: Product }>('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      }),

    update: (id: string, productData: Partial<Product>) =>
      request<{ success: boolean; product: Product }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE'
      })
  },

  // Orders
  orders: {
    create: (orderData: {
      orderItems: Array<{ productId: string; name: string; quantity: number; price: number; imageUrl: string }>;
      shippingAddress: { fullName: string; phone: string; address: string; city: string; postalCode: string };
      paymentMethod?: 'Cash on Delivery';
    }) =>
      request<{ success: boolean; message: string; order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      }),

    getMyOrders: () => request<{ success: boolean; count: number; orders: Order[] }>('/orders/myorders'),

    getById: (id: string) => request<{ success: boolean; order: Order }>(`/orders/${id}`),

    getAll: (status?: string) => {
      const qs = status && status !== 'All' ? `?status=${status}` : '';
      return request<{ success: boolean; count: number; orders: Order[] }>(`/orders${qs}`);
    },

    updateStatus: (id: string, status: string, note?: string) =>
      request<{ success: boolean; message: string; order: Order }>(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note })
      }),

    cancel: (id: string, reason?: string) =>
      request<{ success: boolean; message: string; order: Order }>(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      })
  },

  // Stats (Admin)
  stats: {
    getDashboard: () => request<{ success: boolean; stats: AdminStats }>('/stats/dashboard'),

    resetSeed: () => request<{ success: boolean; message: string }>('/stats/reset-seed', {
      method: 'POST'
    })
  },

  // Health
  health: () => request<any>('/health')
};
