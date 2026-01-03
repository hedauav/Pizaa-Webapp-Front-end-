// ============================================
// SliceMaster Pizza - Order Module
// ============================================

const OrderModule = {
    currentOrderId: null,
    orders: [],
    
    init() {
        // Only create modal if it doesn't exist in HTML
        if (!document.getElementById('orderModal')) {
            this.createOrderModal();
        }
        
        // Bind My Orders button click event
        this.bindEvents();
    },
    
    bindEvents() {
        // Bind My Orders button
        const myOrdersBtn = document.getElementById('myOrdersBtn');
        if (myOrdersBtn) {
            myOrdersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showOrderHistory();
            });
        }
        
        // Bind close button
        const orderModalClose = document.getElementById('orderModalClose');
        if (orderModalClose) {
            orderModalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Close on outside click
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
            orderModal.addEventListener('click', (e) => {
                if (e.target === orderModal) {
                    this.closeModal();
                }
            });
        }
    },
    
    createOrderModal() {
        const modalHTML = `
            <div id="orderModal" class="order-modal">
                <div class="order-modal-content">
                    <div class="order-modal-header">
                        <h2 id="orderModalTitle">My Orders</h2>
                        <button class="order-close" onclick="OrderModule.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="order-modal-body" id="orderModalBody">
                        <!-- Content will be rendered here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    async showOrderHistory() {
        document.getElementById('orderModalTitle').textContent = 'My Orders';
        document.getElementById('orderModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const body = document.getElementById('orderModalBody');
        body.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>';
        
        try {
            const response = await OrderAPI.getOrders();
            this.orders = Array.isArray(response) ? response : (response.data || response.content || []);
            
            if (this.orders.length === 0) {
                body.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-receipt"></i>
                        <p>No orders yet</p>
                        <a href="#menu" class="btn primary-btn" onclick="OrderModule.closeModal()">
                            Order Now
                        </a>
                    </div>
                `;
                return;
            }
            
            body.innerHTML = `
                <div class="orders-list">
                    ${this.orders.map(order => this.renderOrderCard(order)).join('')}
                </div>
            `;
            
        } catch (error) {
            console.error('Failed to load orders:', error);
            body.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load orders</p>
                    <button class="btn secondary-btn" onclick="OrderModule.showOrderHistory()">
                        Try Again
                    </button>
                </div>
            `;
        }
    },
    
    renderOrderCard(order) {
        const statusClass = this.getStatusClass(order.status);
        const formattedDate = new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const items = order.items || order.orderItems || [];
        
        return `
            <div class="order-card">
                <div class="order-card-header">
                    <div class="order-info">
                        <span class="order-number">Order #${order.id || order.orderNumber}</span>
                        <span class="order-date">${formattedDate}</span>
                    </div>
                    <span class="order-status ${statusClass}">${this.formatStatus(order.status)}</span>
                </div>
                
                <div class="order-card-items">
                    ${items.slice(0, 3).map(item => `
                        <div class="order-item-mini">
                            <span>${item.quantity}x ${item.pizza?.name || item.name}</span>
                        </div>
                    `).join('')}
                    ${items.length > 3 ? `<span class="more-items">+${items.length - 3} more items</span>` : ''}
                </div>
                
                <div class="order-card-footer">
                    <span class="order-total">₹${order.total || order.totalAmount}</span>
                    <div class="order-actions">
                        ${this.canTrack(order.status) ? `
                            <button class="btn-sm secondary-btn" onclick="OrderModule.trackOrder('${order.id}')">
                                <i class="fas fa-map-marker-alt"></i> Track
                            </button>
                        ` : ''}
                        <button class="btn-sm primary-btn" onclick="OrderModule.reorder('${order.id}')">
                            <i class="fas fa-redo"></i> Reorder
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    getStatusClass(status) {
        const statusClasses = {
            'PENDING': 'status-pending',
            'CONFIRMED': 'status-confirmed',
            'PREPARING': 'status-preparing',
            'READY': 'status-ready',
            'OUT_FOR_DELIVERY': 'status-delivery',
            'DELIVERED': 'status-delivered',
            'CANCELLED': 'status-cancelled'
        };
        return statusClasses[status] || 'status-pending';
    },
    
    formatStatus(status) {
        const statusNames = {
            'PENDING': 'Pending',
            'CONFIRMED': 'Confirmed',
            'PREPARING': 'Preparing',
            'READY': 'Ready',
            'OUT_FOR_DELIVERY': 'On the way',
            'DELIVERED': 'Delivered',
            'CANCELLED': 'Cancelled'
        };
        return statusNames[status] || status;
    },
    
    canTrack(status) {
        return ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(status);
    },
    
    async trackOrder(orderId) {
        this.currentOrderId = orderId || this.currentOrderId;
        
        if (!this.currentOrderId) {
            Toast.show('No order to track', 'warning');
            return;
        }
        
        document.getElementById('orderModalTitle').textContent = `Track Order #${this.currentOrderId}`;
        document.getElementById('orderModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const body = document.getElementById('orderModalBody');
        body.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        
        try {
            const order = await OrderAPI.getOrderById(this.currentOrderId);
            
            body.innerHTML = `
                <div class="order-tracking">
                    <div class="tracking-timeline">
                        ${this.renderTrackingSteps(order.status)}
                    </div>
                    
                    <div class="tracking-info">
                        <div class="tracking-eta">
                            <i class="fas fa-clock"></i>
                            <span>Estimated delivery: <strong>${order.estimatedDeliveryTime || '30-45 mins'}</strong></span>
                        </div>
                        
                        ${order.deliveryPerson ? `
                            <div class="delivery-person">
                                <i class="fas fa-motorcycle"></i>
                                <span>Delivery by: <strong>${order.deliveryPerson.name}</strong></span>
                                <a href="tel:${order.deliveryPerson.phone}" class="btn-sm">
                                    <i class="fas fa-phone"></i>
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="tracking-order-details">
                        <h4>Order Details</h4>
                        ${(order.items || order.orderItems || []).map(item => `
                            <div class="tracking-item">
                                <span>${item.quantity}x ${item.pizza?.name || item.name}</span>
                                <span>₹${item.price * item.quantity}</span>
                            </div>
                        `).join('')}
                        <div class="tracking-total">
                            <span>Total</span>
                            <span>₹${order.total || order.totalAmount}</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Subscribe to WebSocket updates
            WebSocketModule.subscribeToOrder(this.currentOrderId);
            
        } catch (error) {
            console.error('Failed to load order:', error);
            body.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load order details</p>
                </div>
            `;
        }
    },
    
    renderTrackingSteps(currentStatus) {
        const steps = [
            { status: 'CONFIRMED', label: 'Confirmed', icon: 'fa-check' },
            { status: 'PREPARING', label: 'Preparing', icon: 'fa-utensils' },
            { status: 'READY', label: 'Ready', icon: 'fa-box' },
            { status: 'OUT_FOR_DELIVERY', label: 'On the way', icon: 'fa-motorcycle' },
            { status: 'DELIVERED', label: 'Delivered', icon: 'fa-home' }
        ];
        
        const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        
        return steps.map((step, index) => {
            const stepIndex = statusOrder.indexOf(step.status);
            const isCompleted = stepIndex <= currentIndex;
            const isCurrent = step.status === currentStatus;
            
            return `
                <div class="tracking-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="step-icon">
                        <i class="fas ${step.icon}"></i>
                    </div>
                    <span class="step-label">${step.label}</span>
                </div>
                ${index < steps.length - 1 ? '<div class="step-line"></div>' : ''}
            `;
        }).join('');
    },
    
    updateOrderStatus(status, estimatedTime) {
        // Update tracking steps in modal if open
        const trackingTimeline = document.querySelector('.tracking-timeline');
        if (trackingTimeline) {
            trackingTimeline.innerHTML = this.renderTrackingSteps(status);
        }
        
        // Update ETA if provided
        if (estimatedTime) {
            const etaElement = document.querySelector('.tracking-eta strong');
            if (etaElement) {
                etaElement.textContent = estimatedTime;
            }
        }
    },
    
    async reorder(orderId) {
        try {
            const order = await OrderAPI.getOrderById(orderId);
            const items = order.items || order.orderItems || [];
            
            // Add all items to cart
            for (const item of items) {
                await CartModule.addItem(
                    item.pizzaId || item.pizza?.id,
                    item.pizza?.name || item.name,
                    item.price || item.pizza?.price,
                    item.quantity,
                    item.size
                );
            }
            
            this.closeModal();
            Toast.show('Items added to cart! 🍕', 'success');
            CartModule.open();
            
        } catch (error) {
            console.error('Failed to reorder:', error);
            Toast.show('Failed to reorder. Please try again.', 'error');
        }
    },
    
    closeModal() {
        document.getElementById('orderModal').classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => OrderModule.init(), 250);
});

window.OrderModule = OrderModule;
