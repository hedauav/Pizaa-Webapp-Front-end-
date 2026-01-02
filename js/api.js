// ============================================
// SliceMaster Pizza - API Service Layer
// ============================================

const ApiService = {
    /**
     * Make an API request
     * @param {string} endpoint - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise} - Response data
     */
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...API_CONFIG.getHeaders(options.requiresAuth !== false),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                API_CONFIG.clearAuth();
                window.dispatchEvent(new CustomEvent('auth:logout'));
                throw new Error('UNAUTHORIZED');
            }
            
            // Parse response
            const data = await response.json().catch(() => ({}));
            
            if (!response.ok) {
                const error = new Error(data.message || 'Request failed');
                error.status = response.status;
                error.data = data;
                throw error;
            }
            
            return data;
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                throw new Error('NETWORK_ERROR');
            }
            throw error;
        }
    },
    
    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },
    
    /**
     * POST request
     */
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * PUT request
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

// ============================================
// Auth API
// ============================================
const AuthAPI = {
    async login(email, password) {
        const response = await ApiService.post('/auth/login', { email, password }, { requiresAuth: false });
        if (response.token) {
            API_CONFIG.setToken(response.token);
            API_CONFIG.setUser(response.user || response);
        }
        return response;
    },
    
    async register(userData) {
        const response = await ApiService.post('/auth/register', userData, { requiresAuth: false });
        if (response.token) {
            API_CONFIG.setToken(response.token);
            API_CONFIG.setUser(response.user || response);
        }
        return response;
    },
    
    async getCurrentUser() {
        return ApiService.get('/auth/me');
    },
    
    logout() {
        API_CONFIG.clearAuth();
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }
};

// ============================================
// Menu/Pizza API
// ============================================
const MenuAPI = {
    async getAllPizzas() {
        return ApiService.get('/pizzas', { requiresAuth: false });
    },
    
    async getPizzaById(id) {
        return ApiService.get(`/pizzas/${id}`, { requiresAuth: false });
    },
    
    async getCategories() {
        return ApiService.get('/categories', { requiresAuth: false });
    },
    
    async getPizzasByCategory(categorySlug) {
        return ApiService.get(`/pizzas/category/${categorySlug}`, { requiresAuth: false });
    },
    
    async searchPizzas(query) {
        return ApiService.get(`/pizzas/search?q=${encodeURIComponent(query)}`, { requiresAuth: false });
    }
};

// ============================================
// Cart API
// ============================================
const CartAPI = {
    async getCart() {
        return ApiService.get('/cart');
    },
    
    async addToCart(pizzaId, quantity = 1, size = 'MEDIUM') {
        return ApiService.post('/cart/add', { pizzaId, quantity, size });
    },
    
    async updateCartItem(itemId, quantity) {
        return ApiService.put('/cart/update', { itemId, quantity });
    },
    
    async removeFromCart(itemId) {
        return ApiService.delete(`/cart/remove/${itemId}`);
    },
    
    async clearCart() {
        return ApiService.delete('/cart/clear');
    }
};

// ============================================
// Order API
// ============================================
const OrderAPI = {
    async createOrder(orderData) {
        return ApiService.post('/orders', orderData);
    },
    
    async getOrders() {
        return ApiService.get('/orders');
    },
    
    async getOrderById(orderId) {
        return ApiService.get(`/orders/${orderId}`);
    },
    
    async cancelOrder(orderId) {
        return ApiService.post(`/orders/${orderId}/cancel`);
    }
};

// ============================================
// Address API
// ============================================
const AddressAPI = {
    async getAddresses() {
        return ApiService.get('/addresses');
    },
    
    async addAddress(addressData) {
        return ApiService.post('/addresses', addressData);
    },
    
    async updateAddress(addressId, addressData) {
        return ApiService.put(`/addresses/${addressId}`, addressData);
    },
    
    async deleteAddress(addressId) {
        return ApiService.delete(`/addresses/${addressId}`);
    },
    
    async setDefaultAddress(addressId) {
        return ApiService.post(`/addresses/${addressId}/default`);
    }
};

// ============================================
// Payment API
// ============================================
const PaymentAPI = {
    // PayPal
    async createPayPalOrder(orderId) {
        return ApiService.post('/payments/paypal/create', { orderId });
    },
    
    async capturePayPalPayment(paypalOrderId) {
        return ApiService.post('/payments/paypal/capture', { paypalOrderId });
    },
    
    // Crypto
    async initiateCryptoPayment(orderId, currency) {
        return ApiService.post('/payments/crypto/initiate', { orderId, currency });
    },
    
    async verifyCryptoPayment(txHash, orderId) {
        return ApiService.post('/payments/crypto/verify', { txHash, orderId });
    }
};

// ============================================
// Special Offers API
// ============================================
const OffersAPI = {
    async getActiveOffers() {
        return ApiService.get('/offers', { requiresAuth: false });
    },
    
    async applyPromoCode(code) {
        return ApiService.post('/offers/apply', { code });
    }
};

// ============================================
// Newsletter API
// ============================================
const NewsletterAPI = {
    async subscribe(email) {
        return ApiService.post('/newsletter/subscribe', { email }, { requiresAuth: false });
    }
};

// Export all APIs
window.ApiService = ApiService;
window.AuthAPI = AuthAPI;
window.MenuAPI = MenuAPI;
window.CartAPI = CartAPI;
window.OrderAPI = OrderAPI;
window.AddressAPI = AddressAPI;
window.PaymentAPI = PaymentAPI;
window.OffersAPI = OffersAPI;
window.NewsletterAPI = NewsletterAPI;
