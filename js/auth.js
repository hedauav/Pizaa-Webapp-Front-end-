// ============================================
// SliceMaster Pizza - Authentication Module
// ============================================

const AuthModule = {
    modal: null,
    
    init() {
        this.createModal();
        this.bindEvents();
        this.checkAuthState();
    },
    
    createModal() {
        // Create auth modal HTML
        const modalHTML = `
            <div id="authModal" class="auth-modal">
                <div class="auth-modal-content">
                    <button class="auth-close" onclick="AuthModule.closeModal()">&times;</button>
                    
                    <!-- Login Form -->
                    <div id="loginFormContainer" class="auth-form-container">
                        <h2>Welcome Back!</h2>
                        <p class="auth-subtitle">Sign in to continue ordering</p>
                        
                        <form id="loginForm" class="auth-form" onsubmit="AuthModule.handleLogin(event)">
                            <div class="form-group">
                                <label for="loginEmail">Email</label>
                                <input type="email" id="loginEmail" placeholder="your@email.com" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <input type="password" id="loginPassword" placeholder="••••••••" required>
                            </div>
                            <div class="form-error" id="loginError"></div>
                            <button type="submit" class="auth-btn primary-btn" id="loginBtn">
                                <span>Sign In</span>
                                <i class="fas fa-spinner fa-spin" style="display:none;"></i>
                            </button>
                        </form>
                        
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        
                        <p class="auth-switch">
                            Don't have an account? 
                            <a href="#" onclick="AuthModule.showRegister(); return false;">Create one</a>
                        </p>
                    </div>
                    
                    <!-- Register Form -->
                    <div id="registerFormContainer" class="auth-form-container" style="display:none;">
                        <h2>Create Account</h2>
                        <p class="auth-subtitle">Join us for delicious pizzas!</p>
                        
                        <form id="registerForm" class="auth-form" onsubmit="AuthModule.handleRegister(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="regFirstName">First Name</label>
                                    <input type="text" id="regFirstName" placeholder="John" required>
                                </div>
                                <div class="form-group">
                                    <label for="regLastName">Last Name</label>
                                    <input type="text" id="regLastName" placeholder="Doe" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="regEmail">Email</label>
                                <input type="email" id="regEmail" placeholder="your@email.com" required>
                            </div>
                            <div class="form-group">
                                <label for="regPhone">Phone Number</label>
                                <input type="tel" id="regPhone" placeholder="+91 98765 43210" required>
                            </div>
                            <div class="form-group">
                                <label for="regPassword">Password</label>
                                <input type="password" id="regPassword" placeholder="Min 8 characters" required minlength="8">
                            </div>
                            <div class="form-error" id="registerError"></div>
                            <button type="submit" class="auth-btn primary-btn" id="registerBtn">
                                <span>Create Account</span>
                                <i class="fas fa-spinner fa-spin" style="display:none;"></i>
                            </button>
                        </form>
                        
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        
                        <p class="auth-switch">
                            Already have an account? 
                            <a href="#" onclick="AuthModule.showLogin(); return false;">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('authModal');
    },
    
    bindEvents() {
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Listen for logout events
        window.addEventListener('auth:logout', () => {
            this.updateUIForLogout();
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
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
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('registerFormContainer').style.display = 'none';
        this.clearErrors();
    },
    
    showRegister() {
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('registerFormContainer').style.display = 'block';
        this.clearErrors();
    },
    
    clearForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
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
            phone: document.getElementById('regPhone').value,
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
        const authBtn = document.querySelector('.nav-button');
        if (authBtn) {
            authBtn.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${user.firstName || 'User'}</span>
                    <i class="fas fa-chevron-down"></i>
                    <div class="user-dropdown">
                        <a href="#" onclick="AuthModule.showProfile(); return false;">
                            <i class="fas fa-user"></i> My Profile
                        </a>
                        <a href="#" onclick="OrderModule.showOrderHistory(); return false;">
                            <i class="fas fa-receipt"></i> My Orders
                        </a>
                        <a href="#" onclick="AuthModule.logout(); return false;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            `;
            authBtn.classList.add('logged-in');
            authBtn.onclick = null;
        }
    },
    
    updateUIForLogout() {
        const authBtn = document.querySelector('.nav-button');
        if (authBtn) {
            authBtn.innerHTML = 'Login';
            authBtn.classList.remove('logged-in');
            authBtn.onclick = () => AuthModule.openModal();
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
