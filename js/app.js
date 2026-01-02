// ============================================
// SliceMaster Pizza - Toast Notifications
// ============================================

const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

window.Toast = Toast;

// ============================================
// SliceMaster Pizza - Main Application
// ============================================

const App = {
    init() {
        console.log('🍕 SliceMaster Pizza - Initializing...');
        
        // Initialize toast system
        Toast.init();
        
        // Update navigation button
        this.updateNavButton();
        
        // Bind newsletter form
        this.bindNewsletterForm();
        
        // Check for pending cart items
        this.checkPendingCart();
        
        console.log('✅ SliceMaster Pizza - Ready!');
    },
    
    updateNavButton() {
        const navButton = document.querySelector('.nav-button');
        if (navButton && !navButton.classList.contains('logged-in')) {
            navButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (!API_CONFIG.isAuthenticated()) {
                    AuthModule.openModal();
                }
            });
        }
    },
    
    bindNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = form.querySelector('input[type="email"]');
                const submitBtn = form.querySelector('button');
                const originalText = submitBtn.innerHTML;
                
                if (!emailInput.value.trim()) {
                    Toast.show('Please enter your email address', 'warning');
                    return;
                }
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                try {
                    await NewsletterAPI.subscribe(emailInput.value);
                    emailInput.value = '';
                    Toast.show('Successfully subscribed! 🎉', 'success');
                    submitBtn.innerHTML = '<i class="fas fa-check"></i>';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                } catch (error) {
                    Toast.show('Failed to subscribe. Please try again.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    },
    
    checkPendingCart() {
        // Check if there's a pending cart from before login
        const pendingCart = localStorage.getItem('pending_cart');
        if (pendingCart && API_CONFIG.isAuthenticated()) {
            try {
                const items = JSON.parse(pendingCart);
                // Merge with current cart
                items.forEach(item => {
                    CartModule.addItem(item.pizzaId, item.name, item.price, item.quantity, item.size);
                });
                localStorage.removeItem('pending_cart');
            } catch (error) {
                console.error('Failed to restore pending cart:', error);
            }
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to ensure all modules are loaded
    setTimeout(() => App.init(), 300);
});

window.App = App;
