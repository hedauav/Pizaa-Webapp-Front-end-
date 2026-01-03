// ============================================
// SliceMaster Pizza - Checkout Module
// ============================================

const CheckoutModule = {
    currentStep: 1,
    selectedAddress: null,
    selectedPayment: 'paypal',
    order: null,
    
    init() {
        this.createCheckoutModal();
    },
    
    createCheckoutModal() {
        const modalHTML = `
            <div id="checkoutModal" class="checkout-modal">
                <div class="checkout-container">
                    <div class="checkout-header">
                        <h2>Checkout</h2>
                        <button class="checkout-close" onclick="CheckoutModule.close()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- Progress Steps -->
                    <div class="checkout-progress">
                        <div class="progress-step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Delivery</span>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Payment</span>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Confirm</span>
                        </div>
                    </div>
                    
                    <div class="checkout-content">
                        <!-- Step 1: Delivery Address -->
                        <div class="checkout-step" id="checkoutStep1">
                            <h3>Delivery Address</h3>
                            
                            <div id="savedAddresses" class="saved-addresses">
                                <!-- Saved addresses will be loaded here -->
                            </div>
                            
                            <div class="add-address-form" id="addressForm">
                                <h4>Add New Address</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Street Address</label>
                                        <input type="text" id="addressStreet" placeholder="123 Pizza Lane" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>City</label>
                                        <input type="text" id="addressCity" placeholder="Nagpur" required>
                                    </div>
                                    <div class="form-group">
                                        <label>State</label>
                                        <input type="text" id="addressState" placeholder="Maharashtra" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>PIN Code</label>
                                        <input type="text" id="addressPincode" placeholder="440001" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Landmark (Optional)</label>
                                        <input type="text" id="addressLandmark" placeholder="Near City Mall">
                                    </div>
                                </div>
                                <button class="btn secondary-btn" onclick="CheckoutModule.saveAddress()">
                                    <i class="fas fa-plus"></i> Save Address
                                </button>
                            </div>
                            
                            <div class="checkout-actions">
                                <button class="btn secondary-btn" onclick="CheckoutModule.close()">Cancel</button>
                                <button class="btn primary-btn" onclick="CheckoutModule.goToStep(2)">
                                    Continue to Payment <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 2: Payment Method -->
                        <div class="checkout-step" id="checkoutStep2" style="display:none;">
                            <h3>Payment Method</h3>
                            
                            <div class="payment-methods">
                                <label class="payment-option active" data-method="cod">
                                    <input type="radio" name="payment" value="cod" checked>
                                    <div class="payment-icon">
                                        <i class="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div class="payment-info">
                                        <span class="payment-name">Cash on Delivery</span>
                                        <span class="payment-desc">Pay when you receive</span>
                                    </div>
                                </label>
                                
                                <label class="payment-option" data-method="card">
                                    <input type="radio" name="payment" value="card">
                                    <div class="payment-icon">
                                        <i class="fas fa-credit-card"></i>
                                    </div>
                                    <div class="payment-info">
                                        <span class="payment-name">Credit/Debit Card</span>
                                        <span class="payment-desc">Pay with card</span>
                                    </div>
                                </label>
                                
                                <label class="payment-option" data-method="upi">
                                    <input type="radio" name="payment" value="upi">
                                    <div class="payment-icon">
                                        <i class="fas fa-mobile-alt"></i>
                                    </div>
                                    <div class="payment-info">
                                        <span class="payment-name">UPI Payment</span>
                                        <span class="payment-desc">Pay with UPI</span>
                                    </div>
                                </label>
                            </div>
                            
                            <div class="checkout-actions">
                                <button class="btn secondary-btn" onclick="CheckoutModule.goToStep(1)">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <button class="btn primary-btn" onclick="CheckoutModule.goToStep(3)">
                                    Review Order <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 3: Order Confirmation -->
                        <div class="checkout-step" id="checkoutStep3" style="display:none;">
                            <h3>Order Summary</h3>
                            
                            <div class="order-summary">
                                <div class="order-items" id="orderItems">
                                    <!-- Order items will be rendered here -->
                                </div>
                                
                                <div class="order-delivery" id="orderDeliveryInfo">
                                    <!-- Delivery info will be rendered here -->
                                </div>
                                
                                <div class="order-totals">
                                    <div class="order-row">
                                        <span>Subtotal</span>
                                        <span id="orderSubtotal">₹0</span>
                                    </div>
                                    <div class="order-row">
                                        <span>Delivery Fee</span>
                                        <span id="orderDelivery">₹40</span>
                                    </div>
                                    <div class="order-row total">
                                        <span>Total</span>
                                        <span id="orderTotal">₹0</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="checkout-actions">
                                <button class="btn secondary-btn" onclick="CheckoutModule.goToStep(2)">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <button class="btn primary-btn" id="placeOrderBtn" onclick="CheckoutModule.placeOrder()">
                                    <span>Place Order</span>
                                    <i class="fas fa-check"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Order Success -->
                        <div class="checkout-step" id="checkoutSuccess" style="display:none;">
                            <div class="success-content">
                                <div class="success-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h3>Order Placed Successfully!</h3>
                                <p>Your order <strong id="successOrderId"></strong> has been confirmed.</p>
                                <p class="success-message">We'll start preparing your delicious pizzas right away!</p>
                                
                                <div class="success-actions">
                                    <button class="btn secondary-btn" onclick="CheckoutModule.close()">
                                        Continue Shopping
                                    </button>
                                    <button class="btn primary-btn" onclick="OrderModule.trackOrder()">
                                        <i class="fas fa-map-marker-alt"></i> Track Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindPaymentEvents();
    },
    
    bindPaymentEvents() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                option.querySelector('input').checked = true;
                this.selectedPayment = option.dataset.method;
            });
        });
    },
    
    open() {
        this.currentStep = 1;
        this.loadAddresses();
        this.updateProgress();
        this.showStep(1);
        document.getElementById('checkoutModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        document.getElementById('checkoutModal').classList.remove('active');
        document.body.style.overflow = '';
        this.resetCheckout();
    },
    
    resetCheckout() {
        this.currentStep = 1;
        this.selectedAddress = null;
        this.selectedPayment = 'paypal';
        this.order = null;
        
        // Reset forms
        document.getElementById('addressForm')?.reset?.();
        
        // Reset payment selection
        document.querySelectorAll('.payment-option').forEach((o, i) => {
            o.classList.toggle('active', i === 0);
        });
        
        // Hide success, show step 1
        document.getElementById('checkoutSuccess').style.display = 'none';
        this.showStep(1);
    },
    
    async loadAddresses() {
        const container = document.getElementById('savedAddresses');
        
        try {
            const response = await AddressAPI.getAddresses();
            const addresses = Array.isArray(response) ? response : (response.data || []);
            
            if (addresses.length === 0) {
                container.innerHTML = '<p class="no-addresses">No saved addresses. Add one below.</p>';
                return;
            }
            
            container.innerHTML = addresses.map(addr => `
                <label class="address-option ${addr.isDefault ? 'selected' : ''}" data-id="${addr.id}">
                    <input type="radio" name="address" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
                    <div class="address-details">
                        <strong>${addr.label || 'Home'}</strong>
                        <p>${addr.street}, ${addr.city}</p>
                        <p>${addr.state} - ${addr.pincode}</p>
                        ${addr.landmark ? `<p class="landmark">${addr.landmark}</p>` : ''}
                    </div>
                    ${addr.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </label>
            `).join('');
            
            // Bind selection events
            container.querySelectorAll('.address-option').forEach(option => {
                option.addEventListener('click', () => {
                    container.querySelectorAll('.address-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    option.querySelector('input').checked = true;
                    this.selectedAddress = parseInt(option.dataset.id);
                });
            });
            
            // Set default selection
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            if (defaultAddr) {
                this.selectedAddress = defaultAddr.id;
            }
            
        } catch (error) {
            console.error('Failed to load addresses:', error);
            container.innerHTML = '<p class="no-addresses">Add a delivery address below.</p>';
        }
    },
    
    async saveAddress() {
        const addressData = {
            street: document.getElementById('addressStreet').value,
            city: document.getElementById('addressCity').value,
            state: document.getElementById('addressState').value,
            pincode: document.getElementById('addressPincode').value,
            landmark: document.getElementById('addressLandmark').value,
            label: 'Home'
        };
        
        // Validate
        if (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode) {
            Toast.show('Please fill all required fields', 'warning');
            return;
        }
        
        try {
            await AddressAPI.addAddress(addressData);
            Toast.show('Address saved!', 'success');
            this.loadAddresses();
            
            // Clear form
            document.getElementById('addressStreet').value = '';
            document.getElementById('addressCity').value = '';
            document.getElementById('addressState').value = '';
            document.getElementById('addressPincode').value = '';
            document.getElementById('addressLandmark').value = '';
        } catch (error) {
            Toast.show('Failed to save address', 'error');
        }
    },
    
    goToStep(step) {
        // Validation for step 1
        if (this.currentStep === 1 && step > 1) {
            if (!this.selectedAddress) {
                Toast.show('Please select or add a delivery address', 'warning');
                return;
            }
        }
        
        this.currentStep = step;
        this.updateProgress();
        this.showStep(step);
        
        // Render order summary on step 3
        if (step === 3) {
            this.renderOrderSummary();
        }
    },
    
    updateProgress() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.toggle('active', stepNum <= this.currentStep);
            step.classList.toggle('completed', stepNum < this.currentStep);
        });
    },
    
    showStep(step) {
        document.querySelectorAll('.checkout-step').forEach(s => s.style.display = 'none');
        document.getElementById(`checkoutStep${step}`).style.display = 'block';
    },
    
    renderOrderSummary() {
        const items = CartModule.items;
        
        // Render items
        document.getElementById('orderItems').innerHTML = items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/pizza-1.jpg'">
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-details">${item.size} × ${item.quantity}</span>
                </div>
                <span class="order-item-price">₹${item.price * item.quantity}</span>
            </div>
        `).join('');
        
        // Render delivery info
        const addressOptions = document.querySelectorAll('.address-option');
        const selectedOption = Array.from(addressOptions).find(o => o.classList.contains('selected'));
        if (selectedOption) {
            const addressText = selectedOption.querySelector('.address-details').innerHTML;
            document.getElementById('orderDeliveryInfo').innerHTML = `
                <h4><i class="fas fa-map-marker-alt"></i> Delivering to:</h4>
                <div class="delivery-address">${addressText}</div>
            `;
        }
        
        // Update totals
        document.getElementById('orderSubtotal').textContent = `₹${CartModule.getSubtotal()}`;
        document.getElementById('orderDelivery').textContent = `₹${CartModule.getDeliveryFee()}`;
        document.getElementById('orderTotal').textContent = `₹${CartModule.getTotal()}`;
    },
    
    async placeOrder() {
        const btn = document.getElementById('placeOrderBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            const orderData = {
                addressId: this.selectedAddress,
                paymentMethod: this.selectedPayment.toUpperCase(),
                items: CartModule.items.map(item => ({
                    pizzaId: item.pizzaId,
                    quantity: item.quantity,
                    size: item.size
                }))
            };
            
            const response = await OrderAPI.createOrder(orderData);
            this.order = response;
            
            // For COD and other payments, order is already placed
            this.showSuccess(response.id || response.orderNumber);
            
            // Clear cart after successful order
            CartModule.clearCart();
            
        } catch (error) {
            console.error('Order failed:', error);
            Toast.show('Failed to place order. Please try again.', 'error');
            btn.disabled = false;
            btn.innerHTML = '<span>Place Order</span><i class="fas fa-check"></i>';
        }
    },
    
    async handlePayPalPayment(orderId) {
        try {
            const paypalOrder = await PaymentAPI.createPayPalOrder(orderId);
            
            // In production, redirect to PayPal or open PayPal modal
            // For now, simulate success
            Toast.show('Redirecting to PayPal...', 'info');
            
            setTimeout(async () => {
                // Simulate PayPal approval
                await PaymentAPI.capturePayPalPayment(paypalOrder.id);
                this.showSuccess(orderId);
            }, 2000);
            
        } catch (error) {
            Toast.show('PayPal payment failed', 'error');
            throw error;
        }
    },
    
    async handleCryptoPayment(orderId) {
        try {
            const cryptoDetails = await PaymentAPI.initiateCryptoPayment(orderId, 'MATIC');
            
            Toast.show('Connect your wallet to complete payment', 'info');
            
            // In production, connect to MetaMask here
            // For now, simulate success
            setTimeout(() => {
                this.showSuccess(orderId);
            }, 2000);
            
        } catch (error) {
            Toast.show('Crypto payment failed', 'error');
            throw error;
        }
    },
    
    showSuccess(orderId) {
        document.getElementById('successOrderId').textContent = `#${orderId}`;
        document.querySelectorAll('.checkout-step').forEach(s => s.style.display = 'none');
        document.getElementById('checkoutSuccess').style.display = 'block';
        
        // Connect to WebSocket for order tracking
        WebSocketModule.subscribeToOrder(orderId);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CheckoutModule.init(), 200);
});

window.CheckoutModule = CheckoutModule;
