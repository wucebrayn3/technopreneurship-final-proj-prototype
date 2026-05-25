const API_BASE = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('access_token');

const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

const refreshAccess = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) { clearTokens(); return null; }
  try {
    const r = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!r.ok) { clearTokens(); return null; }
    const d = await r.json();
    setTokens(d.access, d.refresh);
    return d.access;
  } catch { clearTokens(); return null; }
};

const apiFetch = async (endpoint, opts = {}) => {
  const token = getToken();
  const isFormData = opts.body instanceof FormData;
  const headers = { ...opts.headers };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${endpoint}`, { ...opts, headers });
  if (res.status === 401 && token) {
    const newToken = await refreshAccess();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, { ...opts, headers });
    }
  }
  return res;
};

// Auth
export const login = async (username, password) => {
  const r = await apiFetch('/auth/login/', {
    method: 'POST', body: JSON.stringify({ username, password }),
  });
  if (r.ok) { const d = await r.json(); setTokens(d.access, d.refresh); localStorage.setItem('user', JSON.stringify(d.user)); }
  return r;
};

export const register = async (data) => {
  const r = await apiFetch('/auth/register/', {
    method: 'POST', body: JSON.stringify(data),
  });
  if (r.ok) { const d = await r.json(); setTokens(d.access, d.refresh); localStorage.setItem('user', JSON.stringify(d.user)); }
  return r;
};

export const getMe = async () => {
  const r = await apiFetch('/auth/me/');
  if (r.ok) { const d = await r.json(); localStorage.setItem('user', JSON.stringify(d)); return d; }
  return null;
};

export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

export const logout = () => clearTokens();

// Sellers
export const getSellers = async () => { const r = await apiFetch('/auth/sellers/'); return r.ok ? r.json() : []; };

// Menu
export const getMenu = async (sellerId) => { const r = await apiFetch(`/menu/${sellerId ? `?seller=${sellerId}` : ''}`); return r.ok ? r.json() : []; };

// Seller: Inventory
export const getInventory = async () => { const r = await apiFetch('/inventory/'); return r.ok ? r.json() : []; };
export const createInventoryItem = async (data) => apiFetch('/inventory/', { method: 'POST', body: JSON.stringify(data) });
export const updateInventoryItem = async (id, data) => apiFetch(`/inventory/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInventoryItem = async (id) => apiFetch(`/inventory/${id}/`, { method: 'DELETE' });

// Seller: Menu Management
export const getSellerMenu = async () => { const r = await apiFetch('/menu/seller/'); return r.ok ? r.json() : []; };
export const createMenuItem = async (data) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiFetch('/menu/seller/', { method: 'POST', body });
};
export const updateMenuItem = async (id, data) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiFetch(`/menu/seller/${id}/`, { method: 'PATCH', body });
};
export const deleteMenuItem = async (id) => apiFetch(`/menu/seller/${id}/`, { method: 'DELETE' });

// Orders
export const createOrder = async (data) => apiFetch('/orders/', { method: 'POST', body: JSON.stringify(data) });
export const getMyOrders = async () => { const r = await apiFetch('/orders/my/'); return r.ok ? r.json() : []; };
export const getSellerOrders = async () => { const r = await apiFetch('/orders/seller/'); return r.ok ? r.json() : []; };
export const updateOrderStatus = async (id, status) => apiFetch(`/orders/${id}/status/`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const cancelOrder = async (id) => apiFetch(`/orders/${id}/cancel/`, { method: 'PATCH' });

// Receipts
export const getMyReceipts = async () => { const r = await apiFetch('/orders/receipts/'); return r.ok ? r.json() : []; };
export const deleteReceipt = async (id) => apiFetch(`/orders/receipt/${id}/delete/`, { method: 'DELETE' });

// Seller Settings
export const getSellerSettings = async () => { const r = await apiFetch('/auth/seller/settings/'); return r.ok ? r.json() : null; };
export const updateSellerSettings = async (data) => apiFetch('/auth/seller/settings/', { method: 'PATCH', body: JSON.stringify(data) });

// Reports
export const createReport = async (data) => apiFetch('/reports/', { method: 'POST', body: JSON.stringify(data) });

// Admin
export const getAdminAccounts = async () => { const r = await apiFetch('/admin/accounts/'); return r.ok ? r.json() : []; };
export const toggleAccount = async (id) => apiFetch(`/admin/accounts/${id}/toggle/`, { method: 'PATCH' });
export const getAdminDashboard = async () => { const r = await apiFetch('/admin/dashboard/'); return r.ok ? r.json() : null; };
export const getAdminReports = async () => { const r = await apiFetch('/reports/admin/'); return r.ok ? r.json() : []; };
export const resolveReport = async (id, status) => apiFetch(`/reports/admin/${id}/`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getVerifications = async () => { const r = await apiFetch('/verifications/'); return r.ok ? r.json() : []; };
export const handleVerification = async (id, action) => apiFetch(`/verifications/${id}/`, { method: 'PATCH', body: JSON.stringify({ action }) });
