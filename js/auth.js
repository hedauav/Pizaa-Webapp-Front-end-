// ============================================
// SliceMaster Pizza - Authentication Module
// ============================================

const AuthModule = {
    modal: null,
    
    init() {
        this.modal = document.getElementById('authModal');
        if (!this.modal) {
            console.error('Auth modal not found in DOM');
            return;
        }
        this.bindEvents();
        this.checkAuthState();
    },
    
    bindEvents() {
        // Bind login button in navbar
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(false);
            });
        }
        
        // Bind register/signup links
        const showRegisterLinks = document.querySelectorAll('#showRegister');
        showRegisterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegister();
            });
        });
        
        // Bind login links
        const showLoginLinks = document.querySelectorAll('#showLogin');
        showLoginLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogin();
            });
        });
        
        // Bind close button
        const closeBtn = document.getElementById('authClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Bind logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Bind form submissions
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Listen for logout events
        window.addEventListener('auth:logout', () => {
            this.updateUIForLogout();
        });
    },
    
    checkAuthState() {
        if (API_CONFIG.isAuthenticated()) {
            const user = API_CONFIG.getUser();
            this.updateUIForLogin(user);
        } else {
            this.updateUIForLogout();
        }
    },
    
    openModal(showRegister = false) {
        if (showRegister) {
            this.showRegister();
        } else {
            this.showLogin();
        }
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.clearForms();
    },
    
    showLogin() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        this.clearErrors();
    },
    
    showRegister() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        this.clearErrors();
    },
    
    clearForms() {
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        this.clearErrors();
    },
    
    clearErrors() {
        document.getElementById('loginError').textContent = '';
        document.getElementById('registerError').textContent = '';
    },
    
    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    },
    
    setLoading(btnId, loading) {
        const btn = document.getElementById(btnId);
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (loading) {
            btn.disabled = true;
            span.style.display = 'none';
            icon.style.display = 'inline-block';
        } else {
            btn.disabled = false;
            span.style.display = 'inline';
            icon.style.display = 'none';
        }
    },
    
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        this.setLoading('loginBtn', true);
        this.clearErrors();
        
        try {
            const response = await AuthAPI.login(email, password);
            this.updateUIForLogin(response.user || response);
            this.closeModal();
            
            // Trigger cart sync after login
            window.dispatchEvent(new CustomEvent('auth:login'));
            
            Toast.show('Welcome back! 🍕', 'success');
        } catch (error) {
            const message = ERROR_MESSAGES[error.message] || error.message || 'Login failed';
            this.showError('loginError', message);
        } finally {
            this.setLoading('loginBtn', false);
        }
    },
    
    async handleRegister(event) {
        event.preventDefault();
        
        const userData = {
            firstName: document.getElementById('regFirstName').value,
            lastName: document.getElementById('regLastName').value,
            email: document.getElementById('regEmail').value,
            phoneNumber: document.getElementById('regPhone').value,
            password: document.getElementById('regPassword').value
        };
        
        this.setLoading('registerBtn', true);
        this.clearErrors();
        
        try {
            const response = await AuthAPI.register(userData);
            this.updateUIForLogin(response.user || response);
            this.closeModal();
            
            // Trigger cart sync after registration
            window.dispatchEvent(new CustomEvent('auth:login'));
            
            Toast.show('Account created! Welcome! 🎉', 'success');
        } catch (error) {
            const message = ERROR_MESSAGES[error.message] || error.message || 'Registration failed';
            this.showError('registerError', message);
        } finally {
            this.setLoading('registerBtn', false);
        }
    },
    
    logout() {
        AuthAPI.logout();
        Toast.show('Logged out successfully', 'info');
    },
    
    updateUIForLogin(user) {
        // Hide auth buttons (Sign In)
        const authButtons = document.getElementById('authButtons');
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        
        // Show user menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.style.display = 'flex';
        }
        
        // Update user name
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = user.firstName || 'User';
        }
        
        // Close the auth modal
        this.closeModal();
    },
    
    updateUIForLogout() {
        // Show auth buttons (Sign In)
        const authButtons = document.getElementById('authButtons');
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        // Hide user menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    },
    
    showProfile() {
        // Profile modal implementation
        Toast.show('Profile feature coming soon!', 'info');
    },
    
    requireAuth(callback) {
        if (API_CONFIG.isAuthenticated()) {
            callback();
        } else {
            this.openModal();
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AuthModule.init();
});

window.AuthModule = AuthModule;
