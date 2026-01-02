// ============================================
// SliceMaster Pizza - Cart Module
// ============================================

const CartModule = {
    items: [],
    isOpen: false,
    
    init() {
        this.createCartSidebar();
        this.loadCart();
        this.bindEvents();
        this.updateCartBadge();
    },
    
    createCartSidebar() {
        const sidebarHTML = `
            <div id="cartSidebar" class="cart-sidebar">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
                    <button class="cart-close" onclick="CartModule.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-items" id="cartItems">
                    <!-- Cart items will be rendered here -->
                </div>
                
                <div class="cart-footer" id="cartFooter">
                    <div class="cart-summary">
                        <div class="cart-subtotal">
                            <span>Subtotal</span>
                            <span id="cartSubtotal">₹0</span>
                        </div>
                        <div class="cart-delivery">
                            <span>Delivery</span>
                            <span id="cartDelivery">₹40</span>
                        </div>
                        <div class="cart-total">
                            <span>Total</span>
                            <span id="cartTotal">₹40</span>
                        </div>
                    </div>
                    <button class="checkout-btn" onclick="CartModule.proceedToCheckout()">
                        Proceed to Checkout <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            <div id="cartOverlay" class="cart-overlay" onclick="CartModule.close()"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
        
        // Add cart icon to navbar if not exists
        this.addCartIcon();
    },
    
    addCartIcon() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        // Check if cart icon already exists
        if (document.querySelector('.cart-icon-btn')) return;
        
        const cartIconHTML = `
            <button class="cart-icon-btn" onclick="CartModule.toggle()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge" id="cartBadge">0</span>
            </button>
        `;
        
        const navButton = navbar.querySelector('.nav-button');
        if (navButton) {
            navButton.insertAdjacentHTML('beforebegin', cartIconHTML);
        }
    },
    
    bindEvents() {
        // Listen for auth events to sync cart
        window.addEventListener('auth:login', () => this.syncCartWithBackend());
        window.addEventListener('auth:logout', () => this.clearCart());
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    loadCart() {
        // Try to load from localStorage first
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch {
                this.items = [];
            }
        }
        
        // If logged in, sync with backend
        if (API_CONFIG.isAuthenticated()) {
            this.syncCartWithBackend();
        }
        
        this.render();
    },
    
    async syncCartWithBackend() {
        if (!API_CONFIG.isAuthenticated()) return;
        
        try {
            const response = await CartAPI.getCart();
            const backendItems = response.items || response.cartItems || [];
            
            // Merge local cart with backend cart
            if (this.items.length > 0 && backendItems.length === 0) {
                // Push local items to backend
                for (const item of this.items) {
                    await CartAPI.addToCart(item.pizzaId, item.quantity, item.size);
                }
            } else {
                // Use backend cart
                this.items = backendItems.map(item => ({
                    id: item.id,
                    pizzaId: item.pizzaId || item.pizza?.id,
                    name: item.name || item.pizza?.name,
                    price: item.price || item.pizza?.price,
                    quantity: item.quantity,
                    size: item.size || 'MEDIUM',
                    image: item.image || item.pizza?.imageUrl
                }));
            }
            
            this.saveCart();
            this.render();
        } catch (error) {
            console.error('Failed to sync cart:', error);
        }
    },
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartBadge();
    },
    
    async addItem(pizzaId, name, price, quantity = 1, size = 'MEDIUM', image = null) {
        // Check if item already exists
        const existingIndex = this.items.findIndex(
            item => item.pizzaId === pizzaId && item.size === size
        );
        
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += quantity;
        } else {
            this.items.push({
                id: Date.now(), // Temporary ID for local items
                pizzaId,
                name,
                price,
                quantity,
                size,
                image: image || `images/pizza-${(pizzaId % 7) + 1}.jpg`
            });
        }
        
        // Sync with backend if logged in
        if (API_CONFIG.isAuthenticated()) {
            try {
                await CartAPI.addToCart(pizzaId, quantity, size);
            } catch (error) {
                console.error('Failed to add to cart:', error);
            }
        }
        
        this.saveCart();
        this.render();
        this.open();
        
        Toast.show(`${name} added to cart! 🍕`, 'success');
    },
    
    async updateQuantity(itemId, change) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;
        
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            await this.removeItem(itemId);
            return;
        }
        
        item.quantity = newQuantity;
        
        // Sync with backend
        if (API_CONFIG.isAuthenticated()) {
            try {
                await CartAPI.updateCartItem(itemId, newQuantity);
            } catch (error) {
                console.error('Failed to update cart:', error);
            }
        }
        
        this.saveCart();
        this.render();
    },
    
    async removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        
        // Sync with backend
        if (API_CONFIG.isAuthenticated()) {
            try {
                await CartAPI.removeFromCart(itemId);
            } catch (error) {
                console.error('Failed to remove from cart:', error);
            }
        }
        
        this.saveCart();
        this.render();
        
        Toast.show('Item removed from cart', 'info');
    },
    
    async clearCart() {
        this.items = [];
        
        // Sync with backend
        if (API_CONFIG.isAuthenticated()) {
            try {
                await CartAPI.clearCart();
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
        
        this.saveCart();
        this.render();
    },
    
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    getDeliveryFee() {
        return this.items.length > 0 ? 40 : 0;
    },
    
    getTotal() {
        return this.getSubtotal() + this.getDeliveryFee();
    },
    
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    
    render() {
        const container = document.getElementById('cartItems');
        const footer = document.getElementById('cartFooter');
        
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <a href="#menu" class="btn secondary-btn" onclick="CartModule.close()">
                        Browse Menu
                    </a>
                </div>
            `;
            footer.style.display = 'none';
            return;
        }
        
        footer.style.display = 'block';
        
        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/pizza-1.jpg'">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-size">${item.size}</p>
                    <p class="cart-item-price">₹${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="CartModule.updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button onclick="CartModule.updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="cart-item-remove" onclick="CartModule.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update totals
        document.getElementById('cartSubtotal').textContent = `₹${this.getSubtotal()}`;
        document.getElementById('cartDelivery').textContent = `₹${this.getDeliveryFee()}`;
        document.getElementById('cartTotal').textContent = `₹${this.getTotal()}`;
        
        this.updateCartBadge();
    },
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },
    
    open() {
        document.getElementById('cartSidebar').classList.add('open');
        document.getElementById('cartOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    },
    
    close() {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    },
    
    proceedToCheckout() {
        if (this.items.length === 0) {
            Toast.show('Your cart is empty!', 'warning');
            return;
        }
        
        // Require authentication for checkout
        AuthModule.requireAuth(() => {
            this.close();
            CheckoutModule.open();
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CartModule.init(), 150);
});

window.CartModule = CartModule;
