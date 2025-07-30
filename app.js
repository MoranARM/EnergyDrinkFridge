// Application State
let currentMode = 'stocking';
let currentStockingMode = 'add'; // 'add' or 'edit'
let currentUser = null;
let users = [];
let inventory = [];
let checkoutHistory = [];

// LocalStorage key for persistent data
const STORAGE_KEY = 'smart-mini-fridge-data';

// Persistent Storage Functions
function saveToLocalStorage() {
    try {
        const data = {
            users: users,
            inventory: inventory,
            checkoutHistory: checkoutHistory,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Failed to save data to localStorage:', error);
        showToast('Failed to save data locally', 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            users = data.users || [];
            inventory = data.inventory || [];
            checkoutHistory = data.checkoutHistory || [];
            console.log('Data loaded from localStorage');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to load data from localStorage:', error);
        showToast('Failed to load saved data', 'error');
        return false;
    }
}

function clearLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('LocalStorage data cleared');
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}

// Sample data initialization
const sampleProducts = [
    {
        barcode: "1234567890123",
        name: "Red Bull Energy Drink",
        brand: "Red Bull",
        category: "Energy Drinks",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23004B87' rx='5'/%3E%3Ctext x='30' y='50' font-family='Arial' font-size='10' fill='white' text-anchor='middle'%3ERed Bull%3C/text%3E%3C/svg%3E",
        nutrition: {
            energy_kcal: 45,
            fat: 0,
            saturated_fat: 0,
            carbohydrates: 11,
            sugars: 10.5,
            fiber: 0,
            proteins: 0.4,
            salt: 0.1,
            caffeine: 80
        },
        scores: {
            nutriscore: "d",
            nova_group: 4,
            ecoscore: "c"
        },
        ingredients: "Water, sucrose, glucose, acidifier (citric acid), carbon dioxide, taurine (0.4%), caffeine (0.03%), inositol, niacin, calcium-pantothenate, pyridoxine HCl, vitamin B12, artificial flavors, colors (caramel, riboflavin)",
        allergens: null,
        traces: null,
        labels: "Energy Drink",
        images: {
            front: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23004B87' rx='10'/%3E%3Ctext x='100' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3ERed Bull%3C/text%3E%3C/svg%3E"
        },
        serving_size: "250ml",
        quantity: "250ml",
        packaging: "Aluminum can",
        origins: "Austria"
    },
    {
        barcode: "2345678901234",
        name: "Monster Energy",
        brand: "Monster",
        category: "Energy Drinks",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23000000' rx='5'/%3E%3Ctext x='30' y='50' font-family='Arial' font-size='10' fill='%2300FF00' text-anchor='middle'%3EMonster%3C/text%3E%3C/svg%3E",
        nutrition: {
            energy_kcal: 50,
            fat: 0,
            saturated_fat: 0,
            carbohydrates: 12,
            sugars: 11,
            fiber: 0,
            proteins: 1.4,
            salt: 0.2,
            caffeine: 160
        },
        scores: {
            nutriscore: "e",
            nova_group: 4,
            ecoscore: "d"
        },
        ingredients: "Carbonated water, sugar, glucose syrup, natural flavors, taurine, citric acid, sodium citrate, color added, panax ginseng root extract, L-carnitine L-tartrate, caffeine, sorbic acid, niacinamide, sodium chloride, inositol, guarana seed extract, pyridoxine hydrochloride, sucralose, riboflavin, maltodextrin, cyanocobalamin",
        allergens: null,
        traces: null,
        labels: "Energy Drink",
        images: {
            front: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23000000' rx='10'/%3E%3Ctext x='100' y='150' font-family='Arial' font-size='24' fill='%2300FF00' text-anchor='middle'%3EMonster%3C/text%3E%3C/svg%3E"
        },
        serving_size: "473ml",
        quantity: "473ml",
        packaging: "Aluminum can",
        origins: "United States"
    },
    {
        barcode: "3456789012345",
        name: "Rockstar Energy",
        brand: "Rockstar",
        category: "Energy Drinks",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23FFD700' rx='5'/%3E%3Ctext x='30' y='50' font-family='Arial' font-size='10' fill='black' text-anchor='middle'%3ERockstar%3C/text%3E%3C/svg%3E",
        nutrition: {
            energy_kcal: 63,
            fat: 0,
            saturated_fat: 0,
            carbohydrates: 15,
            sugars: 15,
            fiber: 0,
            proteins: 0,
            salt: 0.18,
            caffeine: 160
        },
        scores: {
            nutriscore: "e",
            nova_group: 4,
            ecoscore: "d"
        },
        ingredients: "Carbonated water, cane sugar, citric acid, natural flavor, caffeine, sodium benzoate, potassium sorbate, taurine, ascorbic acid, guarana seed extract, inositol, milk thistle extract, panax ginseng root extract, ginkgo biloba leaf extract, riboflavin, niacin, cyanocobalamin, pyridoxine hydrochloride",
        allergens: null,
        traces: null,
        labels: "Energy Drink",
        images: {
            front: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23FFD700' rx='10'/%3E%3Ctext x='100' y='150' font-family='Arial' font-size='24' fill='black' text-anchor='middle'%3ERockstar%3C/text%3E%3C/svg%3E"
        },
        serving_size: "473ml",
        quantity: "473ml", 
        packaging: "Aluminum can",
        origins: "United States"
    }
];

// Initialize with real exported data
function initializeApp() {
    // Try to load from localStorage first
    const dataLoaded = loadFromLocalStorage();
    
    if (!dataLoaded) {
        // Initialize users with real data from export (only if no saved data)
        users = [
            {
                badgeId: "123456",
                name: "John Doe",
                checkoutHistory: [
                    {
                        date: "2025-01-15T10:30:00Z",
                        barcode: "1234567890123",
                        productName: "Red Bull Energy Drink",
                        quantity: 1
                    }
                ]
            },
            {
                badgeId: "475627",
                name: "Alex",
                checkoutHistory: [
                    {
                        date: "2025-07-30T21:58:42.081Z",
                        userId: "475627",
                        userName: "Alex",
                        barcode: "06827465",
                        productName: "Pure Life",
                        quantity: 1
                    }
                ]
            }
        ];

        // Initialize inventory with real Monster Energy data from export (only if no saved data)
        inventory = [
            {
                barcode: "070847891857",
                name: "Monster Ultra Strawberry Dreams",
                brand: "Monster Energy",
                category: "Beverages, Artificially sweetened beverages, Energy drinks, Energy drink without sugar and with artificial sweeteners",
                image: "https://images.openfoodfacts.org/images/products/007/084/789/1857/front_en.27.400.jpg",
                nutrition: {
                    energy_kcal: 2.11,
                    fat: null,
                    saturated_fat: null,
                    carbohydrates: 1.27,
                    sugars: null,
                    fiber: null,
                    proteins: null,
                    salt: 0.137,
                    sodium: 0.0549,
                    caffeine: null
                },
                scores: {
                    nutriscore: "c",
                    nova_group: 4,
                    ecoscore: "not-applicable"
                },
                ingredients: "CARBONATED WATER, ERYTHRITOL, CITRIC ACID, TAURINE, SODIUM CITRATE, NATURAL FLAVORS, PANAX GINSENG FLAVOR, L-CARNITINE L-TARTRATE, POTASSIUM SORBATE (PRESERVATIVE), CAFFEINE, SUCRALOSE, SODIUM BENZOATE (PRESERVATIVE), NIACINAMIDE (VIT. B3), D-CALCIUM PANTOTHENATE (VIT. B5), BETA CAROTENE (COLOR), INOSITOL, VEGETABLE JUICE COLOR, PYRIDOXINE HYDROCHLORIDE (VIT B6), CYANOCOBALAMIN (VIT. B12)",
                allergens: null,
                traces: null,
                labels: null,
                images: {
                    front: "https://images.openfoodfacts.org/images/products/007/084/789/1857/front_en.27.400.jpg",
                    nutrition: "https://images.openfoodfacts.org/images/products/007/084/789/1857/nutrition_en.5.400.jpg",
                    ingredients: "https://images.openfoodfacts.org/images/products/007/084/789/1857/ingredients_en.33.400.jpg"
                },
                serving_size: "473ml, 16 fl oz",
                quantity: 2,
                packaging: null,
                origins: null,
                shelf: 3,
                position: 0
            },
            {
                barcode: "070847037545",
                name: "Monster Zero Ultra",
                brand: "Monster",
                category: "Energy Drinks",
                image: "https://images.openfoodfacts.org/images/products/007/084/703/7545/front_en.7.400.jpg",
                nutrition: {
                    energy_kcal: 2.8178539224527,
                    fat: null,
                    saturated_fat: null,
                    carbohydrates: 1.1271415689811,
                    sugars: null,
                    fiber: null,
                    proteins: null,
                    salt: 0.19724977457169,
                    sodium: 0.078899909828676,
                    caffeine: null
                },
                scores: {
                    nutriscore: "unknown",
                    nova_group: 4,
                    ecoscore: "unknown"
                },
                ingredients: "CARBONATED WATER, ERYTHRITOL, CITRIC ACID, TAURINE, SODIUM CITRATE, NATURAL FLAVORS, PANAX GINSENG FLAVOR, L-CARNITINE L-TARTRATE, POTASSIUM SORBATE (PRESERVATIVE), CAFFEINE, SUCRALOSE, SODIUM BENZOATE (PRESERVATIVE), NIACINAMIDE (VIT. B3), D-CALCIUM PANTOTHENATE (VIT. B5), INOSITOL, PYRIDOXINE HYDROCHLORIDE (VIT B6), CYANOCOBALAMIN (VIT. B12)",
                allergens: null,
                traces: null,
                labels: null,
                images: {
                    front: "https://images.openfoodfacts.org/images/products/007/084/703/7545/front_en.7.400.jpg",
                    nutrition: "https://images.openfoodfacts.org/images/products/007/084/703/7545/nutrition_en.9.400.jpg",
                    ingredients: "https://images.openfoodfacts.org/images/products/007/084/703/7545/ingredients_en.4.400.jpg"
                },
                serving_size: null,
                quantity: 3,
                packaging: null,
                origins: null,
                shelf: 2,
                position: 0
            }
        ];

        // Initialize checkout history with real data (only if no saved data)
        checkoutHistory = [
            {
                date: "2025-07-30T21:58:42.081Z",
                userId: "475627",
                userName: "Alex",
                barcode: "06827465",
                productName: "Pure Life",
                quantity: 1
            }
        ];

        // Save the initial data to localStorage
        saveToLocalStorage();
        console.log('Initialized with default data and saved to localStorage');
    } else {
        console.log('Initialized with data from localStorage');
    }

    updateStockDisplay();
    updateFridgeDisplay();
    updateTransactionHistory();
}

// DOM Elements
const stockingModeBtn = document.getElementById('stockingModeBtn');
const checkoutModeBtn = document.getElementById('checkoutModeBtn');
const stockingMode = document.getElementById('stockingMode');
const checkoutMode = document.getElementById('checkoutMode');

// Stocking mode elements
const addStockBtn = document.getElementById('addStockBtn');
const editStockBtn = document.getElementById('editStockBtn');
const addStockMode = document.getElementById('addStockMode');
const editStockMode = document.getElementById('editStockMode');

// Add stock elements
const stockBarcodeInput = document.getElementById('stockBarcode');
const stockQuantityInput = document.getElementById('stockQuantity');
const addToFridgeBtn = document.getElementById('addToFridgeBtn');

// Edit stock elements
const editBarcodeInput = document.getElementById('editBarcode');
const editStockDetails = document.getElementById('editStockDetails');
const currentProductName = document.getElementById('currentProductName');
const currentProductDetails = document.getElementById('currentProductDetails');
const newStockQuantityInput = document.getElementById('newStockQuantity');
const updateStockBtn = document.getElementById('updateStockBtn');

// Checkout elements
const badgeIdInput = document.getElementById('badgeId');
const userNameInput = document.getElementById('userName');
const nameInputGroup = document.getElementById('nameInputGroup');
const userWelcome = document.getElementById('userWelcome');
const checkoutBarcodeInput = document.getElementById('checkoutBarcode');
const checkoutItemBtn = document.getElementById('checkoutItemBtn');

// Other elements
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const importFile = document.getElementById('importFile');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const toast = document.getElementById('toast');

// Event Listeners - use proper event delegation and prevent multiple bindings
function initializeEventListeners() {
    // Main mode switchers - use proper event binding
    stockingModeBtn.onclick = function(e) {
        e.preventDefault();
        switchMode('stocking');
    };
    
    checkoutModeBtn.onclick = function(e) {
        e.preventDefault();
        switchMode('checkout');
    };

    // Stocking mode switchers
    addStockBtn.onclick = function(e) {
        e.preventDefault();
        switchStockingMode('add');
    };
    
    editStockBtn.onclick = function(e) {
        e.preventDefault();
        switchStockingMode('edit');
    };

    // Add stock functionality
    addToFridgeBtn.onclick = function(e) {
        e.preventDefault();
        addToFridge();
    };
    
    stockQuantityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            stockBarcodeInput.focus();
        }
    });
    
    stockBarcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addToFridge();
        }
    });

    // Edit stock functionality
    editBarcodeInput.addEventListener('input', handleEditBarcodeInput);
    editBarcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEditBarcodeInput();
        }
    });
    
    updateStockBtn.onclick = function(e) {
        e.preventDefault();
        updateStock();
    };
    
    newStockQuantityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateStock();
        }
    });

    // Checkout functionality
    badgeIdInput.addEventListener('input', handleBadgeInput);
    badgeIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBadgeInput();
        }
    });
    
    checkoutItemBtn.onclick = function(e) {
        e.preventDefault();
        checkoutItem();
    };
    
    checkoutBarcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkoutItem();
        }
    });

    // Data management
    exportDataBtn.onclick = function(e) {
        e.preventDefault();
        exportData();
    };
    
    importDataBtn.onclick = function(e) {
        e.preventDefault();
        importFile.click();
    };
    
    importFile.addEventListener('change', importData);
    
    // Clear data button
    clearDataBtn.onclick = function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            clearLocalStorage();
            users = [];
            inventory = [];
            checkoutHistory = [];
            currentUser = null;
            resetInputs();
            updateStockDisplay();
            updateFridgeDisplay();
            updateTransactionHistory();
            updateUserInterface();
            showToast('All data cleared successfully', 'success');
        }
    };

    // History modal
    viewHistoryBtn.onclick = function(e) {
        e.preventDefault();
        showUserHistory();
    };
    
    closeHistoryModal.onclick = function(e) {
        e.preventDefault();
        historyModal.classList.add('hidden');
    };
    
    historyModal.querySelector('.modal-overlay').onclick = function(e) {
        e.preventDefault();
        historyModal.classList.add('hidden');
    };

    // Product detail modal
    const productDetailModal = document.getElementById('productDetailModal');
    const closeProductDetailModal = document.getElementById('closeProductDetailModal');
    
    closeProductDetailModal.onclick = function(e) {
        e.preventDefault();
        productDetailModal.classList.add('hidden');
    };
    
    productDetailModal.querySelector('.modal-overlay').onclick = function(e) {
        e.preventDefault();
        productDetailModal.classList.add('hidden');
    };

    // Handle new user name input
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const badgeId = badgeIdInput.value.trim();
            const name = userNameInput.value.trim();
            
            if (name && badgeId.length === 6) {
                const newUser = {
                    badgeId: badgeId,
                    name: name,
                    checkoutHistory: []
                };
                users.push(newUser);
                currentUser = newUser;
                userWelcome.textContent = `Welcome, ${name}!`;
                userWelcome.classList.remove('hidden');
                nameInputGroup.classList.add('hidden');
                updateUserInterface();
                
                // Save new user to localStorage
                saveToLocalStorage();
                
                showToast(`User ${name} registered successfully!`, 'success');
            }
        }
    });
}

// Mode switching
function switchMode(mode) {
    currentMode = mode;
    
    if (mode === 'stocking') {
        stockingModeBtn.classList.add('active');
        checkoutModeBtn.classList.remove('active');
        stockingMode.classList.add('active');
        checkoutMode.classList.remove('active');
    } else {
        checkoutModeBtn.classList.add('active');
        stockingModeBtn.classList.remove('active');
        checkoutMode.classList.add('active');
        stockingMode.classList.remove('active');
    }
    
    // Reset inputs when switching modes
    resetInputs();
}

// Stocking mode switching
function switchStockingMode(mode) {
    currentStockingMode = mode;
    
    if (mode === 'add') {
        addStockBtn.classList.add('active');
        editStockBtn.classList.remove('active');
        addStockMode.classList.add('active');
        editStockMode.classList.remove('active');
    } else {
        editStockBtn.classList.add('active');
        addStockBtn.classList.remove('active');
        editStockMode.classList.add('active');
        addStockMode.classList.remove('active');
    }
    
    resetStockingInputs();
}

// Reset all inputs
function resetInputs() {
    resetStockingInputs();
    badgeIdInput.value = '';
    userNameInput.value = '';
    checkoutBarcodeInput.value = '';
    currentUser = null;
    nameInputGroup.classList.add('hidden');
    userWelcome.classList.add('hidden');
    updateUserInterface();
}

// Reset stocking inputs
function resetStockingInputs() {
    stockBarcodeInput.value = '';
    stockQuantityInput.value = '1';
    editBarcodeInput.value = '';
    newStockQuantityInput.value = '';
    editStockDetails.classList.add('hidden');
}

// Product lookup via Open Food Facts API with enhanced data
async function lookupProduct(barcode) {
    // First check sample products for exact match
    const sampleProduct = sampleProducts.find(p => p.barcode === barcode);
    if (sampleProduct) {
        return { ...sampleProduct }; // Return a copy to avoid reference issues
    }
    
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
            const product = data.product;
            return {
                barcode: barcode,
                name: product.product_name || `Product ${barcode}`,
                brand: product.brands || 'Unknown Brand',
                category: product.categories || 'Energy Drinks',
                image: product.image_url || product.image_front_url || createDefaultCanImage(product.product_name || barcode),
                
                // Enhanced nutritional information
                nutrition: {
                    energy_kcal: product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || null,
                    fat: product.nutriments?.fat_100g || product.nutriments?.fat || null,
                    saturated_fat: product.nutriments?.['saturated-fat_100g'] || product.nutriments?.['saturated-fat'] || null,
                    carbohydrates: product.nutriments?.carbohydrates_100g || product.nutriments?.carbohydrates || null,
                    sugars: product.nutriments?.sugars_100g || product.nutriments?.sugars || null,
                    fiber: product.nutriments?.fiber_100g || product.nutriments?.fiber || null,
                    proteins: product.nutriments?.proteins_100g || product.nutriments?.proteins || null,
                    salt: product.nutriments?.salt_100g || product.nutriments?.salt || null,
                    sodium: product.nutriments?.sodium_100g || product.nutriments?.sodium || null,
                    caffeine: product.nutriments?.caffeine_100g || product.nutriments?.caffeine || null
                },
                
                // Health and quality scores
                scores: {
                    nutriscore: product.nutriscore_grade || product.nutrition_grades || null,
                    nova_group: product.nova_group || null,
                    ecoscore: product.ecoscore_grade || null
                },
                
                // Ingredients and allergens
                ingredients: product.ingredients_text || null,
                allergens: product.allergens || null,
                traces: product.traces || null,
                
                // Labels and certifications
                labels: product.labels || null,
                
                // Additional images
                images: {
                    front: product.image_front_url || null,
                    nutrition: product.image_nutrition_url || null,
                    ingredients: product.image_ingredients_url || null
                },
                
                // Product details
                serving_size: product.serving_size || null,
                quantity: product.quantity || null,
                packaging: product.packaging || null,
                origins: product.origins || null
            };
        }
    } catch (error) {
        console.warn('API lookup failed:', error);
    }
    
    // Fallback to default
    return {
        barcode: barcode,
        name: `Energy Drink ${barcode}`,
        brand: 'Generic',
        category: 'Energy Drinks',
        image: createDefaultCanImage(barcode),
        nutrition: {},
        scores: {},
        ingredients: null,
        allergens: null,
        traces: null,
        labels: null,
        images: {},
        serving_size: null,
        quantity: null,
        packaging: null,
        origins: null
    };
}

// Create default can image
function createDefaultCanImage(text) {
    const shortText = text.length > 8 ? text.substring(0, 8) + '...' : text;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='100' viewBox='0 0 60 100'%3E%3Crect width='60' height='100' fill='%23CCCCCC' rx='5'/%3E%3Ctext x='30' y='50' font-family='Arial' font-size='8' fill='black' text-anchor='middle'%3E${encodeURIComponent(shortText)}%3C/text%3E%3C/svg%3E`;
}

// Add item to fridge with random shelf placement
async function addToFridge() {
    const barcode = stockBarcodeInput.value.trim();
    const quantity = parseInt(stockQuantityInput.value) || 1;
    
    if (!barcode) {
        showToast('Please enter a barcode', 'error');
        return;
    }
    
    if (quantity <= 0) {
        showToast('Please enter a valid quantity', 'error');
        return;
    }
    
    addToFridgeBtn.classList.add('loading');
    
    try {
        const product = await lookupProduct(barcode);
        
        // Check if item already exists in inventory by barcode
        const existingItem = inventory.find(item => item.barcode === barcode);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            // Update with any new product data from API
            Object.assign(existingItem, product, { quantity: existingItem.quantity });
            showToast(`Added ${quantity} more ${existingItem.name} to fridge (Total: ${existingItem.quantity})`, 'success');
        } else {
            const newItem = {
                ...product, // Include all enhanced product data
                quantity: quantity
            };
            
            inventory.push(newItem);
            showToast(`Added ${quantity} ${product.name} to fridge`, 'success');
        }
        
        stockBarcodeInput.value = '';
        stockQuantityInput.value = '1';
        stockQuantityInput.focus(); // Focus back to quantity for next entry
        
        updateStockDisplay();
        updateFridgeDisplay();
        
        // Save to localStorage after updating inventory
        saveToLocalStorage();
        
    } catch (error) {
        console.error('Error adding item to fridge:', error);
        showToast('Error adding item to fridge', 'error');
    } finally {
        addToFridgeBtn.classList.remove('loading');
    }
}

// Handle edit barcode input - Fixed to properly find existing items
function handleEditBarcodeInput() {
    const barcode = editBarcodeInput.value.trim();
    
    if (!barcode) {
        editStockDetails.classList.add('hidden');
        return;
    }
    
    // Find existing item in inventory - ensure exact string match
    const existingItem = inventory.find(item => String(item.barcode).trim() === String(barcode).trim());
    
    if (existingItem) {
        editStockDetails.classList.remove('hidden');
        currentProductName.textContent = existingItem.name;
        currentProductDetails.textContent = `${existingItem.brand} - Current Stock: ${existingItem.quantity} (Shelf ${existingItem.shelf})`;
        newStockQuantityInput.value = existingItem.quantity;
        newStockQuantityInput.focus();
        newStockQuantityInput.select();
        showToast(`Found: ${existingItem.name}`, 'success');
    } else {
        editStockDetails.classList.add('hidden');
        showToast('Product not found in inventory. Available barcodes: ' + inventory.map(i => i.barcode).join(', '), 'error');
    }
}

// Update stock for existing item
function updateStock() {
    const barcode = editBarcodeInput.value.trim();
    const newQuantity = parseInt(newStockQuantityInput.value);
    
    if (!barcode) {
        showToast('Please scan a barcode first', 'error');
        return;
    }
    
    if (isNaN(newQuantity) || newQuantity < 0) {
        showToast('Please enter a valid quantity (0 or greater)', 'error');
        return;
    }
    
    const existingItem = inventory.find(item => String(item.barcode).trim() === String(barcode).trim());
    
    if (!existingItem) {
        showToast('Product not found in inventory', 'error');
        return;
    }
    
    const oldQuantity = existingItem.quantity;
    
    if (newQuantity === 0) {
        // Remove item completely
        const index = inventory.indexOf(existingItem);
        inventory.splice(index, 1);
        showToast(`Removed ${existingItem.name} from inventory`, 'success');
    } else {
        existingItem.quantity = newQuantity;
        showToast(`Updated ${existingItem.name} stock from ${oldQuantity} to ${newQuantity}`, 'success');
    }
    
    // Reset edit interface
    editBarcodeInput.value = '';
    newStockQuantityInput.value = '';
    editStockDetails.classList.add('hidden');
    editBarcodeInput.focus();
    
    updateStockDisplay();
    updateFridgeDisplay();
    
    // Save to localStorage after updating inventory
    saveToLocalStorage();
}

// Handle badge input
function handleBadgeInput() {
    const badgeId = badgeIdInput.value.trim();
    
    if (badgeId.length !== 6 || !/^\d{6}$/.test(badgeId)) {
        currentUser = null;
        nameInputGroup.classList.add('hidden');
        userWelcome.classList.add('hidden');
        updateUserInterface();
        return;
    }
    
    const existingUser = users.find(user => user.badgeId === badgeId);
    
    if (existingUser) {
        currentUser = existingUser;
        userWelcome.textContent = `Welcome back, ${existingUser.name}!`;
        userWelcome.classList.remove('hidden');
        nameInputGroup.classList.add('hidden');
        updateUserInterface();
    } else {
        currentUser = null;
        nameInputGroup.classList.remove('hidden');
        userWelcome.classList.add('hidden');
        userNameInput.focus();
        updateUserInterface();
    }
}

// Update user interface
function updateUserInterface() {
    const canCheckout = currentUser !== null;
    checkoutItemBtn.disabled = !canCheckout;
    viewHistoryBtn.disabled = !canCheckout;
    
    if (!canCheckout) {
        checkoutBarcodeInput.disabled = true;
        checkoutBarcodeInput.placeholder = 'Please scan badge first';
    } else {
        checkoutBarcodeInput.disabled = false;
        checkoutBarcodeInput.placeholder = 'Scan item barcode';
    }
}

// Checkout item
async function checkoutItem() {
    if (!currentUser) {
        showToast('Please scan your badge first', 'error');
        return;
    }
    
    const barcode = checkoutBarcodeInput.value.trim();
    
    if (!barcode) {
        showToast('Please scan an item barcode', 'error');
        return;
    }
    
    const inventoryItem = inventory.find(item => item.barcode === barcode);
    
    if (!inventoryItem) {
        showToast('Item not found in fridge', 'error');
        return;
    }
    
    if (inventoryItem.quantity <= 0) {
        showToast('Item out of stock', 'error');
        return;
    }
    
    // Process checkout
    inventoryItem.quantity -= 1;
    
    // Remove item if quantity reaches 0
    if (inventoryItem.quantity === 0) {
        const index = inventory.indexOf(inventoryItem);
        inventory.splice(index, 1);
    }
    
    // Add to checkout history
    const transaction = {
        date: new Date().toISOString(),
        userId: currentUser.badgeId,
        userName: currentUser.name,
        barcode: barcode,
        productName: inventoryItem.name,
        quantity: 1
    };
    
    checkoutHistory.unshift(transaction);
    currentUser.checkoutHistory.unshift(transaction);
    
    // Keep only last 50 transactions in memory
    if (checkoutHistory.length > 50) {
        checkoutHistory = checkoutHistory.slice(0, 50);
    }
    
    checkoutBarcodeInput.value = '';
    
    updateStockDisplay();
    updateFridgeDisplay();
    updateTransactionHistory();
    
    // Save to localStorage after checkout
    saveToLocalStorage();
    
    // Play success sound and show notification
    playSuccessSound();
    showToast(`Successfully checked out ${inventoryItem.name}`, 'success');
}

// Play success sound
function playSuccessSound() {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant two-tone beep similar to Apple Pay
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.warn('Could not play sound:', error);
        // Fallback: try to use HTML5 audio with a data URI beep
        try {
            const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAyuBzvLYiTcIGWi77eefTQwMUKjj8LZjHAY5gM/y2Yk3CBlovO3nn00NCF2m4/G2Yx8HNmzG8N2QQAoUW7vr64pWFAlFn+DyvmwhAyuBzvLYiTcIGWi87eefTQwMUKPj8LZjHAY4k9fyz3osBS2BzvLYiTcIG2i87eafTAwNUKPj8LZjHAY4lNXyz3osAAAAAAAIU/NJi9fz2Ik3Bt9GRZw");
            audio.play().catch(() => {});
        } catch (e) {
            console.warn('Audio fallback also failed:', e);
        }
    }
}

// Update stock display
function updateStockDisplay() {
    const stockList = document.getElementById('currentStock');
    
    if (inventory.length === 0) {
        stockList.innerHTML = '<div class="shelf-empty">No items in stock</div>';
        return;
    }
    
    stockList.innerHTML = inventory.map(item => `
        <div class="stock-item">
            <div class="stock-item-info">
                <div class="stock-item-name">${item.name}</div>
                <div class="stock-item-details">${item.brand} - ${item.barcode} (Shelf ${item.shelf})</div>
            </div>
            <div class="stock-quantity">${item.quantity}</div>
        </div>
    `).join('');
}

// Update fridge display
function updateFridgeDisplay() {
    const fridgeContents = document.querySelector('.fridge-contents');
    if (!fridgeContents) return;
    
    // Clear current contents
    fridgeContents.innerHTML = '';
    
    // Remove all item count classes
    fridgeContents.className = 'fridge-contents';
    
    // Add items to the fridge
    inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'fridge-item item-added';
        
        // Make item clickable to show details
        itemElement.style.cursor = 'pointer';
        itemElement.addEventListener('click', () => {
            showProductDetail(item);
        });
        
        // Always use actual images - prioritize real URLs over data URIs
        let imageElement;
        if (item.image && item.image.startsWith('http')) {
            // Real product image from API
            imageElement = `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                           <div class="default-can" style="display:none;">${item.name.substring(0, 8)}</div>`;
        } else if (item.image && item.image.startsWith('data:')) {
            // SVG data URI
            imageElement = `<img src="${item.image}" alt="${item.name}">`;
        } else {
            // Fallback to default can
            imageElement = `<div class="default-can">${item.name.substring(0, 8)}</div>`;
        }
        
        itemElement.innerHTML = `
            ${imageElement}
            <div class="fridge-item-name">${item.name}</div>
            <div class="quantity-badge">${item.quantity}</div>
        `;
        
        fridgeContents.appendChild(itemElement);
    });
    
    // Apply appropriate CSS class based on number of items
    const itemCount = inventory.length;
    if (itemCount === 0) {
        fridgeContents.innerHTML = '<div class="fridge-empty">Your fridge is empty</div>';
    } else if (itemCount === 1) {
        fridgeContents.classList.add('items-1');
    } else if (itemCount === 2) {
        fridgeContents.classList.add('items-2');
    } else if (itemCount === 3) {
        fridgeContents.classList.add('items-3');
    } else if (itemCount === 4) {
        fridgeContents.classList.add('items-4');
    } else if (itemCount === 5) {
        fridgeContents.classList.add('items-5');
    } else if (itemCount === 6) {
        fridgeContents.classList.add('items-6');
    } else {
        fridgeContents.classList.add('items-many');
    }
}

// Update transaction history
function updateTransactionHistory() {
    const transactionList = document.getElementById('recentTransactions');
    
    if (checkoutHistory.length === 0) {
        transactionList.innerHTML = '<div class="shelf-empty">No recent transactions</div>';
        return;
    }
    
    transactionList.innerHTML = checkoutHistory.slice(0, 5).map(transaction => `
        <div class="transaction-item">
            <div class="transaction-item-header">
                <div class="transaction-product">${transaction.productName}</div>
                <div class="transaction-time">${formatDate(transaction.date)}</div>
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
                ${transaction.userName} (${transaction.userId})
            </div>
        </div>
    `).join('');
}

// Show user history
function showUserHistory() {
    if (!currentUser) return;
    
    const historyContent = document.getElementById('userHistoryContent');
    
    if (currentUser.checkoutHistory.length === 0) {
        historyContent.innerHTML = '<div class="shelf-empty">No checkout history found</div>';
    } else {
        // Group by product for flavor statistics
        const productStats = {};
        currentUser.checkoutHistory.forEach(transaction => {
            if (!productStats[transaction.productName]) {
                productStats[transaction.productName] = 0;
            }
            productStats[transaction.productName]++;
        });
        
        const sortedProducts = Object.entries(productStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        historyContent.innerHTML = `
            <div class="section">
                <h4>Your Favorite Drinks</h4>
                ${sortedProducts.map(([product, count]) => `
                    <div class="history-item">
                        <div class="history-product">${product}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">
                            ${count} times purchased
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="section">
                <h4>Recent History</h4>
                ${currentUser.checkoutHistory.slice(0, 10).map(transaction => `
                    <div class="history-item">
                        <div class="history-date">${formatDate(transaction.date)}</div>
                        <div class="history-product">${transaction.productName}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">
                            Barcode: ${transaction.barcode}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    historyModal.classList.remove('hidden');
}

// Export data with proper file download - Enhanced implementation
function exportData() {
    const data = {
        users: users,
        inventory: inventory,
        checkoutHistory: checkoutHistory,
        exportDate: new Date().toISOString(),
        version: "1.0"
    };
    
    try {
        // Create the JSON string
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create blob with explicit MIME type
        const blob = new Blob([jsonString], { 
            type: 'application/json;charset=utf-8' 
        });
        
        // Generate filename with current date
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const fileName = `fridge-data-${dateStr}.json`;
        
        // Try multiple download methods for cross-browser compatibility
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE/Edge support
            window.navigator.msSaveOrOpenBlob(blob, fileName);
            showToast('Data exported successfully (IE/Edge)', 'success');
        } else {
            // Modern browsers
            const url = URL.createObjectURL(blob);
            
            // Create a temporary download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            // Add to DOM, trigger click, then clean up
            document.body.appendChild(downloadLink);
            
            // Force the download by clicking the link
            downloadLink.click();
            
            // Clean up immediately
            document.body.removeChild(downloadLink);
            
            // Revoke the URL after a short delay to ensure download starts
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 2000);
            
            showToast(`Data exported to ${fileName}`, 'success');
        }
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error exporting data: ' + error.message, 'error');
    }
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        showToast('Please select a JSON file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate the data structure
            if (!data.users || !data.inventory || !data.checkoutHistory) {
                throw new Error('Invalid data format');
            }
            
            users = data.users || [];
            inventory = data.inventory || [];
            checkoutHistory = data.checkoutHistory || [];
            
            // Reset current user state
            resetInputs();
            
            updateStockDisplay();
            updateFridgeDisplay();
            updateTransactionHistory();
            updateUserInterface();
            
            // Save imported data to localStorage
            saveToLocalStorage();
            
            showToast('Data imported successfully', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast('Error importing data: Invalid file format', 'error');
        }
    };
    
    reader.onerror = function() {
        showToast('Error reading file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showToast(message, type = 'success') {
    const toastContent = document.querySelector('.toast-content');
    toastContent.textContent = message;
    
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Product Detail Modal Functions
function showProductDetail(productData) {
    const modal = document.getElementById('productDetailModal');
    
    // Update basic product info
    document.getElementById('productDetailName').textContent = productData.name || 'Unknown Product';
    document.getElementById('productDetailImage').src = productData.image || '';
    document.getElementById('productDetailBrand').textContent = productData.brand || 'Unknown Brand';
    document.getElementById('productDetailCategory').textContent = productData.category || 'Unknown Category';
    document.getElementById('productDetailQuantity').textContent = productData.quantity ? `Package: ${productData.quantity}` : '';
    
    // Update health scores
    updateHealthScores(productData.scores || {});
    
    // Update nutrition info
    updateNutritionTab(productData.nutrition || {});
    
    // Update ingredients
    updateIngredientsTab(productData.ingredients, productData.labels);
    
    // Update allergens
    updateAllergensTab(productData.allergens, productData.traces);
    
    // Update images
    updateImagesTab(productData.images || {}, productData.name);
    
    // Show modal
    modal.classList.remove('hidden');
}

function updateHealthScores(scores) {
    // Nutri-Score
    const nutriScoreElement = document.getElementById('productNutriScore');
    if (scores.nutriscore) {
        nutriScoreElement.textContent = scores.nutriscore.toUpperCase();
        nutriScoreElement.className = `score-value nutri-score grade-${scores.nutriscore.toLowerCase()}`;
    } else {
        nutriScoreElement.textContent = 'N/A';
        nutriScoreElement.className = 'score-value nutri-score';
    }
    
    // NOVA Group
    const novaElement = document.getElementById('productNovaGroup');
    if (scores.nova_group) {
        const novaTexts = {
            1: 'Group 1 - Unprocessed',
            2: 'Group 2 - Processed Culinary',
            3: 'Group 3 - Processed',
            4: 'Group 4 - Ultra-processed'
        };
        novaElement.textContent = novaTexts[scores.nova_group] || `Group ${scores.nova_group}`;
        novaElement.className = `score-value nova-score group-${scores.nova_group}`;
    } else {
        novaElement.textContent = 'N/A';
        novaElement.className = 'score-value nova-score';
    }
    
    // Eco-Score
    const ecoScoreElement = document.getElementById('productEcoScore');
    if (scores.ecoscore) {
        ecoScoreElement.textContent = scores.ecoscore.toUpperCase();
        ecoScoreElement.className = `score-value eco-score grade-${scores.ecoscore.toLowerCase()}`;
    } else {
        ecoScoreElement.textContent = 'N/A';
        ecoScoreElement.className = 'score-value eco-score';
    }
}

function updateNutritionTab(nutrition) {
    const nutritionTable = document.getElementById('nutritionTable');
    
    const nutritionItems = [
        { key: 'energy_kcal', label: 'Energy', unit: 'kcal' },
        { key: 'fat', label: 'Fat', unit: 'g' },
        { key: 'saturated_fat', label: 'Saturated Fat', unit: 'g' },
        { key: 'carbohydrates', label: 'Carbohydrates', unit: 'g' },
        { key: 'sugars', label: 'Sugars', unit: 'g' },
        { key: 'fiber', label: 'Fiber', unit: 'g' },
        { key: 'proteins', label: 'Proteins', unit: 'g' },
        { key: 'salt', label: 'Salt', unit: 'g' },
        { key: 'sodium', label: 'Sodium', unit: 'mg' },
        { key: 'caffeine', label: 'Caffeine', unit: 'mg' }
    ];
    
    nutritionTable.innerHTML = nutritionItems
        .filter(item => nutrition[item.key] !== null && nutrition[item.key] !== undefined)
        .map(item => {
            const value = nutrition[item.key];
            const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;
            return `
                <div class="nutrition-row">
                    <div class="nutrition-label">${item.label}</div>
                    <div class="nutrition-value">${formattedValue}</div>
                    <div class="nutrition-unit">${item.unit}</div>
                </div>
            `;
        })
        .join('') || '<p>No nutrition information available</p>';
}

function updateIngredientsTab(ingredients, labels) {
    const ingredientsElement = document.getElementById('productIngredients');
    
    let content = '';
    
    if (ingredients) {
        content += `<p>${ingredients}</p>`;
    } else {
        content += '<p>No ingredient information available</p>';
    }
    
    if (labels) {
        content += `<h4 style="margin-top: 24px; margin-bottom: 12px;">Labels & Certifications</h4>`;
        content += `<p style="color: var(--color-success); font-weight: 500;">${labels}</p>`;
    }
    
    ingredientsElement.innerHTML = content;
}

function updateAllergensTab(allergens, traces) {
    const allergensElement = document.getElementById('productAllergens');
    const tracesElement = document.getElementById('productTraces');
    
    // Allergens
    if (allergens) {
        const allergenList = allergens.split(',').map(a => a.trim().replace(/^en:/, '').replace(/-/g, ' '));
        allergensElement.innerHTML = `
            <h4>Contains Allergens:</h4>
            <div class="allergens-list">
                ${allergenList.map(allergen => `<span class="allergen-tag">${allergen}</span>`).join('')}
            </div>
        `;
    } else {
        allergensElement.innerHTML = '<h4>Contains Allergens:</h4><p>No known allergens</p>';
    }
    
    // Traces
    if (traces) {
        const traceList = traces.split(',').map(t => t.trim().replace(/^en:/, '').replace(/-/g, ' '));
        tracesElement.innerHTML = `
            <h4>May Contain Traces:</h4>
            <div class="traces-list">
                ${traceList.map(trace => `<span class="trace-tag">${trace}</span>`).join('')}
            </div>
        `;
    } else {
        tracesElement.innerHTML = '<h4>May Contain Traces:</h4><p>No trace information available</p>';
    }
}

function updateImagesTab(images, productName) {
    const imagesElement = document.getElementById('productImages');
    
    const imageTypes = [
        { key: 'front', label: 'Front Package' },
        { key: 'nutrition', label: 'Nutrition Label' },
        { key: 'ingredients', label: 'Ingredients List' }
    ];
    
    const availableImages = imageTypes.filter(type => images[type.key]);
    
    if (availableImages.length === 0) {
        imagesElement.innerHTML = '<p>No additional images available</p>';
        return;
    }
    
    imagesElement.innerHTML = availableImages.map(type => `
        <div class="product-image-item">
            <img src="${images[type.key]}" alt="${productName} - ${type.label}" loading="lazy">
            <div class="product-image-label">${type.label}</div>
        </div>
    `).join('');
}

// Tab switching functionality
function initializeProductDetailTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab + 'Tab').classList.add('active');
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeEventListeners();
    initializeProductDetailTabs();
});