// ============================================
// SliceMaster Pizza - API Configuration
// ============================================

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api/v1',
    WS_URL: 'ws://localhost:8080/ws',
    
    // Token management
    getToken: () => localStorage.getItem('jwt_token'),
    setToken: (token) => localStorage.setItem('jwt_token', token),
    removeToken: () => localStorage.removeItem('jwt_token'),
    
    // User management
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('user'),
    
    // Headers
    getHeaders: (includeAuth = true) => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (includeAuth) {
            const token = API_CONFIG.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = API_CONFIG.getToken();
        if (!token) return false;
        
        // Check if token is expired (basic check)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
    
    // Clear all auth data
    clearAuth: () => {
        API_CONFIG.removeToken();
        API_CONFIG.removeUser();
    }
};

// Error messages mapping
const ERROR_MESSAGES = {
    'UNAUTHORIZED': 'Please login to continue',
    'INVALID_CREDENTIALS': 'Invalid email or password',
    'EMAIL_EXISTS': 'An account with this email already exists',
    'TOKEN_EXPIRED': 'Your session has expired. Please login again',
    'NETWORK_ERROR': 'Unable to connect. Please check your internet connection',
    'SERVER_ERROR': 'Something went wrong. Please try again later',
    'CART_EMPTY': 'Your cart is empty',
    'ORDER_FAILED': 'Failed to create order. Please try again',
    'PAYMENT_FAILED': 'Payment failed. Please try again',
    'VALIDATION_ERROR': 'Please check your input and try again'
};

// Export for use in other modules
window.API_CONFIG = API_CONFIG;
window.ERROR_MESSAGES = ERROR_MESSAGES;
