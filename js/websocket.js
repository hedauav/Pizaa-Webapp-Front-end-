// ============================================
// SliceMaster Pizza - WebSocket Module
// ============================================

const WebSocketModule = {
    socket: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectDelay: 3000,
    subscribedOrders: new Set(),
    
    init() {
        // Only connect when user is authenticated
        window.addEventListener('auth:login', () => this.connect());
        window.addEventListener('auth:logout', () => this.disconnect());
        
        if (API_CONFIG.isAuthenticated()) {
            this.connect();
        }
    },
    
    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            return;
        }
        
        try {
            const token = API_CONFIG.getToken();
            const wsUrl = `${API_CONFIG.WS_URL}/orders?token=${token}`;
            
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                
                // Resubscribe to any previously subscribed orders
                this.subscribedOrders.forEach(orderId => {
                    this.sendMessage({
                        type: 'SUBSCRIBE',
                        orderId: orderId
                    });
                });
            };
            
            this.socket.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };
            
            this.socket.onclose = (event) => {
                console.log('WebSocket disconnected', event.code);
                this.attemptReconnect();
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    },
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.subscribedOrders.clear();
    },
    
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnect attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        
        setTimeout(() => {
            if (API_CONFIG.isAuthenticated()) {
                this.connect();
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    },
    
    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    },
    
    subscribeToOrder(orderId) {
        this.subscribedOrders.add(orderId);
        
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.sendMessage({
                type: 'SUBSCRIBE',
                orderId: orderId
            });
        } else {
            this.connect();
        }
    },
    
    unsubscribeFromOrder(orderId) {
        this.subscribedOrders.delete(orderId);
        this.sendMessage({
            type: 'UNSUBSCRIBE',
            orderId: orderId
        });
    },
    
    handleMessage(message) {
        console.log('WebSocket message:', message);
        
        switch (message.type) {
            case 'ORDER_STATUS_UPDATE':
                this.handleOrderStatusUpdate(message);
                break;
            case 'ORDER_READY':
                this.handleOrderReady(message);
                break;
            case 'ORDER_OUT_FOR_DELIVERY':
                this.handleOutForDelivery(message);
                break;
            case 'ORDER_DELIVERED':
                this.handleOrderDelivered(message);
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    },
    
    handleOrderStatusUpdate(message) {
        const { orderId, status, estimatedTime } = message;
        
        // Update order tracking UI
        if (OrderModule.currentOrderId === orderId) {
            OrderModule.updateOrderStatus(status, estimatedTime);
        }
        
        // Show notification
        Toast.show(`Order #${orderId}: ${this.formatStatus(status)}`, 'info');
    },
    
    handleOrderReady(message) {
        Toast.show(`🍕 Order #${message.orderId} is ready and being prepared!`, 'success');
        this.showNotification('Order Ready', 'Your pizza is being prepared!');
    },
    
    handleOutForDelivery(message) {
        Toast.show(`🛵 Order #${message.orderId} is out for delivery!`, 'success');
        this.showNotification('Out for Delivery', 'Your order is on its way!');
    },
    
    handleOrderDelivered(message) {
        Toast.show(`✅ Order #${message.orderId} has been delivered. Enjoy!`, 'success');
        this.showNotification('Order Delivered', 'Enjoy your meal! 🍕');
        this.unsubscribeFromOrder(message.orderId);
    },
    
    formatStatus(status) {
        const statusMap = {
            'PENDING': 'Order received',
            'CONFIRMED': 'Order confirmed',
            'PREPARING': 'Being prepared',
            'READY': 'Ready for pickup',
            'OUT_FOR_DELIVERY': 'Out for delivery',
            'DELIVERED': 'Delivered',
            'CANCELLED': 'Cancelled'
        };
        return statusMap[status] || status;
    },
    
    showNotification(title, body) {
        // Request permission and show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'images/logo.png'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: 'images/logo.png'
                    });
                }
            });
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    WebSocketModule.init();
});

window.WebSocketModule = WebSocketModule;
