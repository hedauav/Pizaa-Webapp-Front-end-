// ============================================
// SliceMaster Pizza - Menu Module
// ============================================

const MenuModule = {
    pizzas: [],
    categories: [],
    currentFilter: 'all',
    isLoading: false,
    
    async init() {
        await this.loadCategories();
        await this.loadPizzas();
        this.bindEvents();
    },
    
    async loadPizzas() {
        const menuGrid = document.querySelector('.menu-grid');
        if (!menuGrid) return;
        
        this.isLoading = true;
        this.showLoadingState(menuGrid);
        
        try {
            const response = await MenuAPI.getAllPizzas();
            this.pizzas = Array.isArray(response) ? response : (response.data || response.content || []);
            this.renderPizzas(this.pizzas);
        } catch (error) {
            console.error('Failed to load menu:', error);
            this.showErrorState(menuGrid);
        } finally {
            this.isLoading = false;
        }
    },
    
    async loadCategories() {
        try {
            const response = await MenuAPI.getCategories();
            this.categories = Array.isArray(response) ? response : (response.data || []);
            this.renderCategories();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    },
    
    showLoadingState(container) {
        container.innerHTML = `
            <div class="menu-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading delicious pizzas...</p>
            </div>
        `;
    },
    
    showErrorState(container) {
        container.innerHTML = `
            <div class="menu-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load menu</p>
                <button onclick="MenuModule.loadPizzas()" class="btn secondary-btn">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    },
    
    renderCategories() {
        const categoryContainer = document.querySelector('.menu-categories');
        if (!categoryContainer || this.categories.length === 0) return;
        
        categoryContainer.innerHTML = `
            <button class="menu-category active" data-category="all">All</button>
            ${this.categories.map(cat => `
                <button class="menu-category" data-category="${cat.slug || cat.name.toLowerCase()}">
                    ${cat.name}
                </button>
            `).join('')}
        `;
        
        // Rebind category filter events
        this.bindCategoryEvents();
    },
    
    renderPizzas(pizzas) {
        const menuGrid = document.querySelector('.menu-grid');
        if (!menuGrid) return;
        
        if (pizzas.length === 0) {
            menuGrid.innerHTML = `
                <div class="menu-empty">
                    <i class="fas fa-pizza-slice"></i>
                    <p>No pizzas found</p>
                </div>
            `;
            return;
        }
        
        menuGrid.innerHTML = pizzas.map(pizza => this.createPizzaCard(pizza)).join('');
        
        // Trigger reveal animation
        setTimeout(() => {
            document.querySelectorAll('.menu-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('revealed');
                }, index * 100);
            });
        }, 100);
    },
    
    createPizzaCard(pizza) {
        const categoryClasses = pizza.categories 
            ? pizza.categories.map(c => c.slug || c.name.toLowerCase()).join(' ')
            : 'popular';
            
        const imageUrl = pizza.imageUrl || pizza.image || `images/pizza-${(pizza.id % 7) + 1}.jpg`;
        const price = pizza.price || pizza.basePrice || 199;
        
        return `
            <div class="menu-item" data-category="${categoryClasses}" data-pizza-id="${pizza.id}">
                <div class="menu-item-img">
                    <img src="${imageUrl}" alt="${pizza.name}" onerror="this.src='images/pizza-1.jpg'">
                    ${pizza.isBestseller || pizza.bestseller ? '<div class="menu-item-tag">Bestseller</div>' : ''}
                    ${pizza.isNew || pizza.newItem ? '<div class="menu-item-tag new">New</div>' : ''}
                    ${pizza.isVegetarian || pizza.vegetarian ? '<div class="veg-badge"><i class="fas fa-leaf"></i></div>' : ''}
                </div>
                <div class="menu-item-info">
                    <h3>${pizza.name}</h3>
                    <p>${pizza.description || 'Delicious handcrafted pizza'}</p>
                    <div class="menu-item-footer">
                        <span class="price">₹${price}</span>
                        <button class="add-to-cart" onclick="CartModule.addItem(${pizza.id}, '${pizza.name}', ${price})">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    bindEvents() {
        this.bindCategoryEvents();
    },
    
    bindCategoryEvents() {
        const categories = document.querySelectorAll('.menu-category');
        categories.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                categories.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.category;
                this.filterPizzas(filter);
            });
        });
    },
    
    filterPizzas(category) {
        this.currentFilter = category;
        const items = document.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const itemCategories = item.dataset.category || '';
            
            if (category === 'all' || itemCategories.includes(category)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    },
    
    getPizzaById(id) {
        return this.pizzas.find(p => p.id === id);
    },
    
    async searchPizzas(query) {
        if (!query.trim()) {
            this.renderPizzas(this.pizzas);
            return;
        }
        
        try {
            const results = await MenuAPI.searchPizzas(query);
            this.renderPizzas(Array.isArray(results) ? results : results.data || []);
        } catch (error) {
            // Fallback to client-side search
            const filtered = this.pizzas.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
            );
            this.renderPizzas(filtered);
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure API is loaded
    setTimeout(() => MenuModule.init(), 100);
});

window.MenuModule = MenuModule;
