// --- SWIPE NAVIGATION ---
let currentSwipePanel = 0; // 0 = transactions, 1 = assets/liabilities
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;
let swipeStartPanel = 0;

function switchToTransactions() {
    currentSwipePanel = 0;
    updateSwipePanel();
    updateSwipeTabs();
    // Scroll to top of swipe container
    const swipeContainer = document.querySelector('.swipe-container');
    if (swipeContainer) {
        swipeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function switchToAssetsLiabilities() {
    currentSwipePanel = 1;
    updateSwipePanel();
    updateSwipeTabs();
    // Scroll to top of swipe container
    const swipeContainer = document.querySelector('.swipe-container');
    if (swipeContainer) {
        swipeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateSwipePanel() {
    const swipeContent = document.getElementById('swipeContent');
    if (swipeContent) {
        swipeContent.style.transform = `translateX(-${currentSwipePanel * 100}%)`;
    }
}

function updateSwipeTabs() {
    const tabs = document.querySelectorAll('.swipe-tab');
    tabs.forEach((tab, index) => {
        if (index === currentSwipePanel) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Touch events for swipe - CONTROLLED SWIPE
function handleTouchStart(e) {
    // Ignore if touch is on interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('a')) {
        return;
    }
    
    touchStartX = e.touches[0].clientX;
    swipeStartPanel = currentSwipePanel;
    isSwiping = true;
    
    // Disable transition during drag
    const swipeContent = document.getElementById('swipeContent');
    if (swipeContent) {
        swipeContent.style.transition = 'none';
    }
}

function handleTouchMove(e) {
    if (!isSwiping) return;
    
    const swipeContent = document.getElementById('swipeContent');
    if (!swipeContent) return;
    
    const currentX = e.touches[0].clientX;
    touchEndX = currentX; // Обновляем позицию конца для handleTouchEnd
    const diff = touchStartX - currentX;
    
    // Calculate the percentage of drag
    const dragPercent = (diff / swipeContent.offsetWidth) * 100;
    
    // Translate based on current panel + drag
    const translateX = (swipeStartPanel * 100) + dragPercent;
    swipeContent.style.transform = `translateX(-${translateX}%)`;
}

function handleTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;
    
    const swipeContent = document.getElementById('swipeContent');
    if (!swipeContent) return;
    
    // Re-enable transition
    swipeContent.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    const diff = touchStartX - touchEndX;
    const swipeThreshold = swipeContent.offsetWidth * 0.2; // 20% threshold
    
    // Determine which panel to snap to
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSwipePanel === 0) {
            // Swipe right - switch to assets/liabilities
            switchToAssetsLiabilities();
        } else if (diff < 0 && currentSwipePanel === 1) {
            // Swipe left - switch to transactions
            switchToTransactions();
        } else {
            // Return to current panel
            updateSwipePanel();
        }
    } else {
        // Didn't swipe far enough - return to current panel
        updateSwipePanel();
    }
}

// --- SPLASH SCREEN LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize swipe navigation
    const swipeContainer = document.querySelector('.swipe-container');
    const swipeContent = document.getElementById('swipeContent');
    
    if (swipeContainer && swipeContent) {
        swipeContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        swipeContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        swipeContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Initialize panel position
        updateSwipePanel();
        updateSwipeTabs();
    }

    // Header language selector
    const headerLanguageSelect = document.getElementById('headerLanguageSelect');
    if (headerLanguageSelect) {
        headerLanguageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            
            // Update splash language selector
            const splashLanguage = document.getElementById('splashLanguage');
            if (splashLanguage && splashLanguage.value !== currentLanguage) {
                splashLanguage.value = currentLanguage;
            }
            
            updateLanguage();
        });
        
        // Set current language
        headerLanguageSelect.value = currentLanguage;
    }

    // Splash screen logic
    const splashScreen = document.getElementById('splashScreen');
    const splashContinueBtn = document.getElementById('splashContinueBtn');
    const splashLanguage = document.getElementById('splashLanguage');
    const splashCurrency = document.getElementById('splashCurrency');
    const container = document.querySelector('.container');
    
    document.documentElement.removeAttribute('data-theme');
    
    if (splashScreen && splashContinueBtn && splashLanguage && splashCurrency) {
        container.style.display = 'none';
        splashScreen.style.display = 'flex';
        
        // Load saved settings
        const savedLanguage = localStorage.getItem('language');
        const savedCurrency = localStorage.getItem('currency');
        
        if (savedLanguage) splashLanguage.value = savedLanguage;
        if (savedCurrency) splashCurrency.value = savedCurrency;
        
        splashLanguage.addEventListener('change', updateLanguage);
        splashCurrency.addEventListener('change', updateLanguage);
        
        updateLanguage();
        
        splashContinueBtn.onclick = function() {
            // Сохраняем язык и валюту
            localStorage.setItem('language', splashLanguage.value);
            localStorage.setItem('currency', splashCurrency.value);
            
            // Скрываем splash screen и показываем приложение
            splashScreen.style.display = 'none';
            container.style.display = 'block';
            
            // Обновляем язык после загрузки приложения
            updateLanguage();
            
            // Обновляем все данные после загрузки
            updateMonthDisplay();
            updateTransactions();
            updateAssets();
            updateLiabilities();
            updateSummary();
        };
    } else {
        // Если splash screen не найден, просто показываем приложение
        updateLanguage();
    }
});

// Восстановить историю из localStorage
function restoreHistory() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');
    const storedLastMonthEnd = localStorage.getItem('lastMonthEnd');

    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
    if (storedAssets) {
        assets = JSON.parse(storedAssets);
    }
    if (storedLiabilities) {
        liabilities = JSON.parse(storedLiabilities);
    }
    if (storedLastMonthEnd) {
        lastMonthEnd = new Date(storedLastMonthEnd);
    }

    updateAll();
    showRestoreSuccessModal();
}

function showRestoreSuccessModal() {
    const modal = document.getElementById('restoreSuccessModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeRestoreSuccessModal() {
    const modal = document.getElementById('restoreSuccessModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// --- DATA STRUCTURES ---
let transactions = [];
let assets = [];
let liabilities = [];
let currentLanguage = 'ru';
let currentCurrency = '$';
let currentMonth = new Date();
let lastMonthEnd = null;

// Usage tracking for suggestions
let assetUsageCount = {};
let liabilityUsageCount = {};

// --- MODAL FUNCTIONS ---
function openAssetModal() {
    const modal = document.getElementById('assetModal');
    if (modal) {
        modal.classList.add('active');
        // Set current date
        const dateInput = document.getElementById('assetDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function closeAssetModal() {
    const modal = document.getElementById('assetModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function openLiabilityModal() {
    const modal = document.getElementById('liabilityModal');
    if (modal) {
        modal.classList.add('active');
        // Set current date
        const dateInput = document.getElementById('liabilityDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function closeLiabilityModal() {
    const modal = document.getElementById('liabilityModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function openIncomeModal() {
    const modal = document.getElementById('incomeModal');
    if (modal) {
        modal.classList.add('active');
        // Set current date
        const dateInput = document.getElementById('incomeDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        // Clear amount field
        const amountInput = document.getElementById('incomeAmount');
        if (amountInput) {
            amountInput.value = '';
        }
    }
}

function closeIncomeModal() {
    const modal = document.getElementById('incomeModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function openExpenseModal() {
    const modal = document.getElementById('expenseModal');
    if (modal) {
        modal.classList.add('active');
        // Set current date
        const dateInput = document.getElementById('expenseDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        // Clear amount field
        const amountInput = document.getElementById('expenseAmount');
        if (amountInput) {
            amountInput.value = '';
        }
    }
}

function closeExpenseModal() {
    const modal = document.getElementById('expenseModal');
    if (modal) {
        modal.classList.remove('active');
        // Clear form
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showValidationError(message) {
    // Create a simple toast notification instead of alert
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    
    // Add animation keyframes if not already present
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showTopUpConfirm(existingAsset, amount, rate, date) {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>💰 Пополнение актива</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">💳</div>
                    <p style="font-weight: 600; color: var(--dark); margin-bottom: 8px;">
                        Актив "${existingAsset.name}" уже существует
                    </p>
                    <p style="color: var(--gray); font-size: 14px;">
                        Текущий баланс: <strong style="color: var(--success);">${formatCurrency(existingAsset.amount)}</strong>
                    </p>
                    <p style="color: var(--primary); font-size: 14px; margin-top: 8px;">
                        Пополнить на <strong>${formatCurrency(amount)}</strong>?
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Отмена</button>
                <button class="btn btn-success" onclick="confirmTopUp(${existingAsset.id}, ${amount})">Пополнить</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add global function for confirmation
    window.confirmTopUp = function(assetId, topUpAmount) {
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
            asset.amount += topUpAmount;
            saveData();
            updateAll();
            closeAssetModal();
        }
        modal.remove();
    };
}

function closePayLiabilityModal() {
    const modal = document.getElementById('payLiabilityModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeWithdrawAssetModal() {
    const modal = document.getElementById('withdrawAssetModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeMonthEndModal() {
    const modal = document.getElementById('monthEndModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// --- TRANSACTION FUNCTIONS ---
function addAssetTransaction() {
    const name = document.getElementById('assetName').value;
    const amount = parseFloat(document.getElementById('assetAmount').value);
    const rate = parseFloat(document.getElementById('assetRate').value) || 0;
    const date = document.getElementById('assetDate').value;

    // Validation
    if (!name || !amount || amount <= 0) {
        showValidationError('Пожалуйста, заполните все поля корректно');
        return;
    }

    // Check for existing asset with same name
    const existingAsset = assets.find(asset => asset.name.toLowerCase() === name.toLowerCase());
    
    if (existingAsset) {
        // Show confirmation to top up existing asset
        showTopUpConfirm(existingAsset, amount, rate, date);
    } else {
        // Track usage for suggestions
        trackAssetUsage(name);
        
        // Create new asset
        const asset = {
            id: Date.now(),
            name: name,
            amount: amount,
            rate: rate,
            date: date || new Date().toISOString().split('T')[0]
        };

        assets.push(asset);
        saveData();
        updateAll();
        closeAssetModal();
    }
}

function addLiabilityTransaction() {
    const name = document.getElementById('liabilityName').value;
    const amount = parseFloat(document.getElementById('liabilityAmount').value);
    const rate = parseFloat(document.getElementById('liabilityRate').value) || 0;
    const date = document.getElementById('liabilityDate').value;

    // Validation
    if (!name || !amount || amount <= 0) {
        showValidationError('Пожалуйста, заполните все поля корректно');
        return;
    }

    // Check for duplicate liability names
    const existingLiability = liabilities.find(liability => liability.name.toLowerCase() === name.toLowerCase());
    if (existingLiability) {
        showValidationError('Пассив с таким названием уже существует.');
        return;
    }

    // Track usage for suggestions
    trackLiabilityUsage(name);

    const liability = {
        id: Date.now(),
        name: name,
        amount: amount,
        rate: rate,
        paid: 0,
        date: date || new Date().toISOString().split('T')[0]
    };

    liabilities.push(liability);
    saveData();
    updateAll();
    closeLiabilityModal();
}

function addIncomeTransaction() {
    const type = document.getElementById('incomeType').value;
    const description = document.getElementById('incomeDescription').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }

    const transaction = {
        id: Date.now(),
        type: 'income',
        category: type,
        description: description || type,
        amount: amount,
        date: date || new Date().toISOString().split('T')[0]
    };

    transactions.push(transaction);
    saveData();
    updateAll();
    closeIncomeModal();
}

function addExpenseTransaction() {
    const type = document.getElementById('expenseType').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму');
        return;
    }

    const transaction = {
        id: Date.now(),
        type: 'expense',
        category: type,
        description: description || type,
        amount: amount,
        date: date || new Date().toISOString().split('T')[0]
    };

    transactions.push(transaction);
    saveData();
    updateAll();
    closeExpenseModal();
}

function deleteAsset(id) {
    showDeleteConfirm('актив', 'deleteAsset', id);
}

function deleteLiability(id) {
    showDeleteConfirm('пассив', 'deleteLiability', id);
}

function deleteTransaction(id) {
    showDeleteConfirm('транзакцию', 'deleteTransaction', id);
}

function showDeleteConfirm(itemType, action, id) {
    const modal = document.getElementById('deleteConfirmModal');
    const titleElement = document.getElementById('deleteConfirmTitle');
    const messageElement = document.getElementById('deleteConfirmMessage');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    // Update modal content
    titleElement.textContent = `⚠️ Удаление ${itemType}`;
    messageElement.textContent = `Вы уверены, что хотите удалить этот ${itemType}?`;
    
    // Set up confirm button action
    confirmBtn.onclick = function() {
        if (action === 'deleteAsset') {
            assets = assets.filter(asset => asset.id !== id);
        } else if (action === 'deleteLiability') {
            liabilities = liabilities.filter(liability => liability.id !== id);
        } else if (action === 'deleteTransaction') {
            transactions = transactions.filter(transaction => transaction.id !== id);
        }
        
        saveData();
        updateAll();
        closeDeleteConfirm();
    };
    
    // Show modal
    modal.classList.add('active');
}

function withdrawFromAsset(id) {
    const t = translations[currentLanguage];
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    const modal = document.getElementById('withdrawAssetModal');
    const nameElement = document.getElementById('withdrawAssetName');
    const availableElement = document.getElementById('withdrawAssetAvailable');
    const amountInput = document.getElementById('withdrawAssetAmountInput');

    if (modal && nameElement && availableElement && amountInput) {
        nameElement.textContent = asset.name;
        availableElement.textContent = formatCurrency(asset.amount);
        amountInput.max = asset.amount;
        amountInput.value = '';
        
        modal.classList.add('active');
        
        // Update modal title
        const modalTitle = document.querySelector('#withdrawAssetModal .modal-title');
        if (modalTitle && t.withdrawTitle) {
            modalTitle.textContent = t.withdrawTitle;
        }
        
        // Update labels
        const nameLabel = document.querySelector('#withdrawAssetModal .info-label');
        const availableLabel = document.querySelectorAll('#withdrawAssetModal .info-label')[1];
        const amountLabel = document.querySelector('#withdrawAssetModal .form-group label');
        const confirmBtn = document.getElementById('confirmWithdrawAssetBtn');
        const cancelBtn = document.querySelector('#withdrawAssetModal .modal-footer button:first-child');
        
        if (nameLabel && t.assetName) nameLabel.textContent = t.assetName;
        if (availableLabel && t.available) availableLabel.textContent = t.available;
        if (amountLabel && t.withdrawAmount) amountLabel.textContent = t.withdrawAmount;
        if (confirmBtn && t.withdraw) confirmBtn.textContent = t.withdraw;
        if (cancelBtn && t.cancel) cancelBtn.textContent = t.cancel;
        
        // Set up confirm button
        confirmBtn.onclick = function() {
            const amount = parseFloat(amountInput.value);
            if (amount && amount > 0 && amount <= asset.amount) {
                asset.amount -= amount;
                saveData();
                updateAll();
                closeWithdrawAssetModal();
            } else {
                alert('Пожалуйста, введите корректную сумму');
            }
        };
    }
}

function payLiability(id) {
    const t = translations[currentLanguage];
    const liability = liabilities.find(l => l.id === id);
    if (!liability) return;

    const modal = document.getElementById('payLiabilityModal');
    const nameElement = document.getElementById('payLiabilityName');
    const amountElement = document.getElementById('payLiabilityAmount');
    const paidElement = document.getElementById('payLiabilityPaid');
    const remainingElement = document.getElementById('payLiabilityRemaining');
    const amountInput = document.getElementById('payLiabilityAmountInput');

    if (modal && nameElement && amountElement && paidElement && remainingElement && amountInput) {
        const remaining = liability.amount - liability.paid;
        
        nameElement.textContent = liability.name;
        amountElement.textContent = formatCurrency(liability.amount);
        paidElement.textContent = formatCurrency(liability.paid);
        remainingElement.textContent = formatCurrency(remaining);
        amountInput.max = remaining;
        amountInput.value = '';
        
        modal.classList.add('active');
        
        // Update modal title
        const modalTitle = document.querySelector('#payLiabilityModal .modal-title');
        if (modalTitle && t.payTitle) {
            modalTitle.textContent = t.payTitle;
        }
        
        // Update labels
        const nameLabel = document.querySelector('#payLiabilityModal .info-label');
        const originalLabel = document.querySelectorAll('#payLiabilityModal .info-label')[1];
        const paidLabel = document.querySelectorAll('#payLiabilityModal .info-label')[2];
        const remainingLabel = document.querySelectorAll('#payLiabilityModal .info-label')[3];
        const amountLabel = document.querySelector('#payLiabilityModal .form-group label');
        const confirmBtn = document.getElementById('confirmPayBtn');
        const cancelBtn = document.querySelector('#payLiabilityModal .modal-footer button:first-child');
        
        if (nameLabel && t.liabilityName) nameLabel.textContent = t.liabilityName;
        if (originalLabel && t.originalAmount) originalLabel.textContent = t.originalAmount;
        if (paidLabel && t.paidAmount) paidLabel.textContent = t.paidAmount;
        if (remainingLabel && t.remainingAmount) remainingLabel.textContent = t.remainingAmount;
        if (amountLabel && t.payAmount) amountLabel.textContent = t.payAmount;
        if (confirmBtn && t.pay) confirmBtn.textContent = t.pay;
        if (cancelBtn && t.cancel) cancelBtn.textContent = t.cancel;
        
        // Set up confirm button
        confirmBtn.onclick = function() {
            const amount = parseFloat(amountInput.value);
            if (amount && amount > 0 && amount <= remaining) {
                liability.paid += amount;
                saveData();
                updateAll();
                closePayLiabilityModal();
            } else {
                alert('Пожалуйста, введите корректную сумму');
            }
        };
    }
}

// --- UPDATE FUNCTIONS ---
function updateAll() {
    updateTransactions();
    updateAssets();
    updateLiabilities();
    updateSummary();
    saveData();
}

function updateTransactions() {
    const t = translations[currentLanguage];
    const incomeList = document.getElementById('incomeList');
    const expenseList = document.getElementById('expenseList');
    const totalIncomeElement = document.getElementById('totalIncomeAmount');
    const totalExpenseElement = document.getElementById('totalExpenseAmount');
    
    if (!incomeList || !expenseList || !totalIncomeElement || !totalExpenseElement) return;

    // Clear lists
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Get current month transactions
    const currentMonthTransactions = getCurrentMonthTransactions();
    
    currentMonthTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.style.cssText = `
            background: var(--white);
            padding: 12px;
            border-radius: var(--radius);
            border: 1px solid rgba(0, 0, 0, 0.05);
            margin-bottom: 8px;
            box-shadow: var(--shadow-sm);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const amountColor = transaction.type === 'income' ? 'var(--success)' : 'var(--danger)';
        const prefix = transaction.type === 'income' ? '+' : '-';
        
        item.innerHTML = `
            <div>
                <div style="font-weight: 600; color: var(--dark); font-size: 0.9rem;">${transaction.description}</div>
                <div style="color: var(--gray); font-size: 0.8rem;">${transaction.date}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="color: ${amountColor}; font-weight: 700; font-size: 1rem;">
                    ${prefix} ${formatCurrency(transaction.amount)}
                </div>
                <button class="btn-delete-small" onclick="deleteTransaction(${transaction.id})" style="background: #ff4757; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;" onmousedown="event.stopPropagation()" onmouseup="event.stopPropagation()" ontouchstart="event.stopPropagation()" ontouchend="event.stopPropagation()">×</button>
            </div>
        `;
        
        if (transaction.type === 'income') {
            incomeList.appendChild(item);
            totalIncome += transaction.amount;
        } else {
            expenseList.appendChild(item);
            totalExpense += transaction.amount;
        }
    });
    
    // Update totals
    totalIncomeElement.textContent = formatCurrency(totalIncome);
    totalExpenseElement.textContent = formatCurrency(totalExpense);
    
    // Show empty messages if needed
    if (incomeList.children.length === 0) {
        incomeList.innerHTML = `<p class="empty-message">${t.noIncome}</p>`;
    }
    if (expenseList.children.length === 0) {
        expenseList.innerHTML = `<p class="empty-message">${t.noExpense}</p>`;
    }
}

function updateAssets() {
    const assetsList = document.getElementById('assetsList');
    const totalElement = document.getElementById('totalAssetsAmount');
    
    if (!assetsList || !totalElement) return;

    assetsList.innerHTML = '';
    let total = 0;

    assets.forEach(asset => {
        total += asset.amount;
        
        const item = document.createElement('div');
        item.className = 'asset-item';
        item.innerHTML = `
            <span class="asset-item-name">${asset.name}</span>
            <span class="asset-item-amount">${formatCurrency(asset.amount)}</span>
            <div class="asset-item-actions">
                <button class="btn-withdraw" onclick="withdrawFromAsset(${asset.id})">Снять</button>
                <button class="btn-delete" onclick="deleteAsset(${asset.id})">Удалить</button>
            </div>
        `;
        assetsList.appendChild(item);
    });

    totalElement.textContent = formatCurrency(total);
}

function updateLiabilities() {
    const liabilitiesList = document.getElementById('liabilitiesList');
    const totalElement = document.getElementById('totalLiabilitiesAmount');
    
    if (!liabilitiesList || !totalElement) return;

    liabilitiesList.innerHTML = '';
    let total = 0;

    liabilities.forEach(liability => {
        const remaining = liability.amount - liability.paid;
        total += remaining;
        
        const item = document.createElement('div');
        item.className = 'liability-item';
        item.innerHTML = `
            <span class="liability-item-name">${liability.name}</span>
            <span class="liability-item-amount">${formatCurrency(remaining)}</span>
            <div class="liability-item-actions">
                <button class="btn-pay" onclick="payLiability(${liability.id})">Погасить</button>
                <button class="btn-delete" onclick="deleteLiability(${liability.id})">Удалить</button>
            </div>
        `;
        liabilitiesList.appendChild(item);
    });

    totalElement.textContent = formatCurrency(total);
}

function updateSummary() {
    const incomeElement = document.getElementById('totalIncome');
    const expenseElement = document.getElementById('totalExpense');
    const balanceElement = document.getElementById('totalBalance');
    
    if (!incomeElement || !expenseElement || !balanceElement) return;

    // Calculate current month transactions
    const currentMonthTransactions = getCurrentMonthTransactions();
    
    let income = 0;
    let expense = 0;

    currentMonthTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    incomeElement.textContent = formatCurrency(income);
    expenseElement.textContent = formatCurrency(expense);
    balanceElement.textContent = formatCurrency(balance);
}

function getCurrentMonthTransactions() {
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
    });
}

// --- UTILITY FUNCTIONS ---
function formatCurrency(amount) {
    return `${amount.toFixed(2)} ${currentCurrency}`;
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('assets', JSON.stringify(assets));
    localStorage.setItem('liabilities', JSON.stringify(liabilities));
    localStorage.setItem('lastMonthEnd', lastMonthEnd ? lastMonthEnd.toISOString() : '');
    localStorage.setItem('assetUsageCount', JSON.stringify(assetUsageCount));
    localStorage.setItem('liabilityUsageCount', JSON.stringify(liabilityUsageCount));
}

function loadData() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');
    const storedLastMonthEnd = localStorage.getItem('lastMonthEnd');
    const storedLanguage = localStorage.getItem('language');
    const storedCurrency = localStorage.getItem('currency');
    const storedAssetUsage = localStorage.getItem('assetUsageCount');
    const storedLiabilityUsage = localStorage.getItem('liabilityUsageCount');

    if (storedTransactions) transactions = JSON.parse(storedTransactions);
    if (storedAssets) assets = JSON.parse(storedAssets);
    if (storedLiabilities) liabilities = JSON.parse(storedLiabilities);
    if (storedLastMonthEnd) lastMonthEnd = new Date(storedLastMonthEnd);
    if (storedLanguage) currentLanguage = storedLanguage;
    if (storedCurrency) currentCurrency = storedCurrency;
    if (storedAssetUsage) assetUsageCount = JSON.parse(storedAssetUsage);
    if (storedLiabilityUsage) liabilityUsageCount = JSON.parse(storedLiabilityUsage);
    
    // Update suggestions based on usage
    updateSuggestions();
}

function trackAssetUsage(name) {
    const normalizedName = name.toLowerCase().trim();
    assetUsageCount[normalizedName] = (assetUsageCount[normalizedName] || 0) + 1;
    saveData();
    updateSuggestions();
}

function trackLiabilityUsage(name) {
    const normalizedName = name.toLowerCase().trim();
    liabilityUsageCount[normalizedName] = (liabilityUsageCount[normalizedName] || 0) + 1;
    saveData();
    updateSuggestions();
}

function updateSuggestions() {
    // Standard options
    const standardAssets = [
        'Наличность', 'Банковский счёт', 'Сбережения', 'Инвестиции', 
        'Депозит', 'Криптовалюта', 'Недвижимость', 'Автомобиль'
    ];
    
    const standardLiabilities = [
        'Ипотека', 'Кредит на машину', 'Потребительский кредит', 'Кредитная карта',
        'Налоги', 'Коммунальные платежи', 'Долг другу', 'Образовательный кредит'
    ];
    
    // Get frequently used items (exclude standard ones)
    const frequentAssets = Object.entries(assetUsageCount)
        .filter(([name, count]) => count > 1 && !standardAssets.includes(name))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const frequentLiabilities = Object.entries(liabilityUsageCount)
        .filter(([name, count]) => count > 1 && !standardLiabilities.includes(name))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // Update custom suggestion dropdowns
    updateCustomSuggestions('assetSuggestionsDropdown', frequentAssets, standardAssets, assetUsageCount);
    updateCustomSuggestions('liabilitySuggestionsDropdown', frequentLiabilities, standardLiabilities, liabilityUsageCount);
    
    // Also update standard datalist as fallback
    const assetDatalist = document.getElementById('assetSuggestions');
    if (assetDatalist) {
        const allAssetOptions = [...frequentAssets.map(([name]) => name), ...standardAssets];
        assetDatalist.innerHTML = allAssetOptions
            .map(option => `<option value="${option}"></option>`)
            .join('');
    }
    
    const liabilityDatalist = document.getElementById('liabilitySuggestions');
    if (liabilityDatalist) {
        const allLiabilityOptions = [...frequentLiabilities.map(([name]) => name), ...standardLiabilities];
        liabilityDatalist.innerHTML = allLiabilityOptions
            .map(option => `<option value="${option}"></option>`)
            .join('');
    }
}

function updateCustomSuggestions(dropdownId, frequentItems, standardItems, usageCount) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    let html = '';
    
    // Add frequently used items with special styling
    frequentItems.forEach(([name, count]) => {
        html += `
            <div class="suggestion-item frequently-used" data-value="${name}">
                <span>⭐ ${name}</span>
                <span class="suggestion-count">${count}</span>
            </div>
        `;
    });
    
    // Add separator if there are frequent items
    if (frequentItems.length > 0) {
        html += '<div class="suggestion-separator" style="padding: 8px 16px; color: var(--gray); font-size: 0.8rem; font-weight: 600; border-bottom: 1px solid var(--light-gray);">Стандартные варианты</div>';
    }
    
    // Add standard items
    standardItems.forEach(name => {
        const count = usageCount[name.toLowerCase()] || 0;
        const countBadge = count > 0 ? `<span class="suggestion-count">${count}</span>` : '';
        html += `
            <div class="suggestion-item standard" data-value="${name}">
                <span>📋 ${name}</span>
                ${countBadge}
            </div>
        `;
    });
    
    dropdown.innerHTML = html;
    
    // Add click handlers
    dropdown.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const input = dropdown.previousElementSibling;
            if (input) {
                input.value = value;
                hideCustomSuggestions(dropdownId);
                input.focus();
            }
        });
    });
}

function showCustomSuggestions(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const wrapper = dropdown.closest('.input-field-wrapper');
    if (dropdown && wrapper) {
        dropdown.classList.add('active');
        wrapper.classList.add('has-suggestions');
    }
}

function hideCustomSuggestions(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const wrapper = dropdown.closest('.input-field-wrapper');
    if (dropdown && wrapper) {
        dropdown.classList.remove('active');
        wrapper.classList.remove('has-suggestions');
    }
}

function initializeCustomSuggestions() {
    // Asset input
    const assetInput = document.getElementById('assetName');
    const assetDropdown = document.getElementById('assetSuggestionsDropdown');
    
    if (assetInput && assetDropdown) {
        assetInput.addEventListener('focus', () => showCustomSuggestions('assetSuggestionsDropdown'));
        assetInput.addEventListener('blur', () => {
            setTimeout(() => hideCustomSuggestions('assetSuggestionsDropdown'), 200);
        });
        assetInput.addEventListener('input', () => filterCustomSuggestions('assetSuggestionsDropdown', assetInput.value));
    }
    
    // Liability input
    const liabilityInput = document.getElementById('liabilityName');
    const liabilityDropdown = document.getElementById('liabilitySuggestionsDropdown');
    
    if (liabilityInput && liabilityDropdown) {
        liabilityInput.addEventListener('focus', () => showCustomSuggestions('liabilitySuggestionsDropdown'));
        liabilityInput.addEventListener('blur', () => {
            setTimeout(() => hideCustomSuggestions('liabilitySuggestionsDropdown'), 200);
        });
        liabilityInput.addEventListener('input', () => filterCustomSuggestions('liabilitySuggestionsDropdown', liabilityInput.value));
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-field-wrapper')) {
            document.querySelectorAll('.input-field-suggestions').forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.closest('.input-field-wrapper').classList.remove('has-suggestions');
            });
        }
    });
}

function filterCustomSuggestions(dropdownId, filter) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const items = dropdown.querySelectorAll('.suggestion-item');
    const lowerFilter = filter.toLowerCase();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerFilter)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- MONTH NAVIGATION ---
function updateMonthDisplay() {
    const monthInput = document.getElementById('monthInput');
    if (monthInput) {
        monthInput.value = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    }
}

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    updateMonthDisplay();
    updateSummary();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateAll();
    updateMonthDisplay();
    updateLanguage(); // Apply language and currency on load

    // Initialize custom suggestions
    initializeCustomSuggestions();

    // Set up month navigation
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    const todayBtn = document.getElementById('todayBtn');
    const monthInput = document.getElementById('monthInput');

    if (prevBtn) prevBtn.addEventListener('click', () => changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMonth(1));
    if (todayBtn) todayBtn.addEventListener('click', () => {
        currentMonth = new Date();
        updateMonthDisplay();
        updateSummary();
    });
    if (monthInput) monthInput.addEventListener('change', (e) => {
        const [year, month] = e.target.value.split('-').map(Number);
        currentMonth = new Date(year, month - 1);
        updateSummary();
    });

    // Set up month end button
    const monthEndBtn = document.getElementById('monthEndBtn');
    if (monthEndBtn) {
        monthEndBtn.addEventListener('click', endMonth);
    }
});

function endMonth() {
    const t = translations[currentLanguage];
    
    // Calculate month results
    const currentMonthTransactions = getCurrentMonthTransactions();
    let income = 0;
    let expense = 0;

    currentMonthTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.amount - liability.paid), 0);
    const netWorth = totalAssets - totalLiabilities;

    // Show results modal
    const modal = document.getElementById('monthEndModal');
    const modalBody = document.getElementById('monthEndModalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <h3>${t.monthEndTitle}</h3>
            <div style="display: grid; gap: 12px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; padding: 12px; background: #f0fdf4; border-radius: 8px;">
                    <span>${t.incomeLabel}</span>
                    <strong style="color: #16a34a;">${formatCurrency(income)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 12px; background: #fef2f2; border-radius: 8px;">
                    <span>${t.expenseLabel}</span>
                    <strong style="color: #dc2626;">${formatCurrency(expense)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 12px; background: #f0f9ff; border-radius: 8px;">
                    <span>${t.balanceLabel}</span>
                    <strong style="color: #2563eb;">${formatCurrency(balance)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 12px; background: #fefce8; border-radius: 8px;">
                    <span>${t.netWorth}</span>
                    <strong style="color: #ca8a04;">${formatCurrency(netWorth)}</strong>
                </div>
            </div>
            <p style="text-align: center; color: #6b7280; font-size: 14px;">
                ${balance >= 0 ? t.greatMonth : t.nextMonthBetter}
            </p>
        `;
        modal.classList.add('active');
    }

    // Mark month as ended
    lastMonthEnd = new Date();
    saveData();
}

// --- LANGUAGE SUPPORT ---
const translations = {
    ru: {
        appTitle: '💰 Финансовый Трекер',
        today: 'Сегодня',
        assetsTitle: '💳 Активы',
        liabilitiesTitle: '📊 Пассивы',
        addAsset: '➕ Добавить Актив',
        addLiability: '➕ Добавить Пассив',
        income: 'Доходы',
        expense: 'Расходы',
        balance: 'Баланс',
        monthEnd: '📅 Закончить месяц',
        addIncome: '➕ Добавить Доход',
        addExpense: '➕ Добавить Расход',
        noIncome: 'Нет доходов',
        noExpense: 'Нет расходов',
        noAssets: 'Нет активов',
        noLiabilities: 'Нет пассивов',
        chooseLanguage: 'Выберите язык:',
        chooseCurrency: 'Выберите валюту:',
        continue: 'Продолжить',
        restore: '💾 Восстановить',
        restoreTitle: '✅ История восстановлена',
        restoreMessage: 'Ваша история успешно восстановлена из памяти!',
        ok: 'ОК',
        cancel: 'Отмена',
        delete: 'Удалить',
        deleteConfirm: '⚠️ Подтверждение удаления',
        deleteMessage: 'Вы уверены, что хотите удалить этот элемент?',
        deleteNote: 'Это действие нельзя отменить.',
        withdraw: 'Снять',
        pay: 'Погасить',
        withdrawTitle: '💸 Снять с актива',
        payTitle: '💰 Погасить пассив',
        assetName: 'Название:',
        available: 'Доступно:',
        withdrawAmount: 'Сумма снятия ($):',
        liabilityName: 'Название:',
        originalAmount: 'Основная сумма:',
        paidAmount: 'Погашено:',
        remainingAmount: 'Осталось:',
        payAmount: 'Сумма погашения ($):',
        monthEndTitle: '📅 Месяц завершён',
        incomeLabel: 'Доходы:',
        expenseLabel: 'Расходы:',
        balanceLabel: 'Баланс:',
        netWorth: 'Чистая стоимость:',
        greatMonth: '🎉 Отличный месяц!',
        nextMonthBetter: '💪 В следующем месяце будет лучше!',
        incomeExpenseTab: '💰 Доходы/Расходы',
        assetsLiabilitiesTab: '💳 Активы/Пассивы'
    },
    uk: {
        appTitle: '💰 Фінансовий Трекер',
        today: 'Сьогодні',
        assetsTitle: '💳 Активи',
        liabilitiesTitle: '📊 Пасиви',
        addAsset: '➕ Додати Актив',
        addLiability: '➕ Додати Пасив',
        income: 'Доходи',
        expense: 'Витрати',
        balance: 'Баланс',
        monthEnd: '📅 Закінчити місяць',
        addIncome: '➕ Додати Дохід',
        addExpense: '➕ Додати Витрату',
        noIncome: 'Немає доходів',
        noExpense: 'Немає витрат',
        noAssets: 'Немає активів',
        noLiabilities: 'Немає пасивів',
        chooseLanguage: 'Оберіть мову:',
        chooseCurrency: 'Оберіть валюту:',
        continue: 'Продовжити',
        restore: '💾 Відновити',
        restoreTitle: '✅ Історію відновлено',
        restoreMessage: 'Ваша історію успішно відновлено з пам\'яті!',
        ok: 'ОК',
        cancel: 'Скасувати',
        delete: 'Видалити',
        deleteConfirm: '⚠️ Підтвердження видалення',
        deleteMessage: 'Ви впевнені, що хочете видалити цей елемент?',
        deleteNote: 'Цю дію неможливо скасувати.',
        withdraw: 'Зняти',
        pay: 'Погасити',
        withdrawTitle: '💸 Зняти з активу',
        payTitle: '💰 Погасити пасив',
        assetName: 'Назва:',
        available: 'Доступно:',
        withdrawAmount: 'Сума зняття ($):',
        liabilityName: 'Назва:',
        originalAmount: 'Основна сума:',
        paidAmount: 'Погашено:',
        remainingAmount: 'Залишилось:',
        payAmount: 'Сума погашення ($):',
        monthEndTitle: '📅 Місяць завершено',
        incomeLabel: 'Доходи:',
        expenseLabel: 'Витрати:',
        balanceLabel: 'Баланс:',
        netWorth: 'Чиста вартість:',
        greatMonth: '🎉 Чудовий місяць!',
        nextMonthBetter: '💪 Наступного місяця буде краще!',
        incomeExpenseTab: '💰 Доходи/Витрати',
        assetsLiabilitiesTab: '💳 Активи/Пасиви'
    },
    en: {
        appTitle: '💰 Financial Tracker',
        today: 'Today',
        assetsTitle: '💳 Assets',
        liabilitiesTitle: '📊 Liabilities',
        addAsset: '➕ Add Asset',
        addLiability: '➕ Add Liability',
        income: 'Income',
        expense: 'Expenses',
        balance: 'Balance',
        monthEnd: '📅 End Month',
        addIncome: '➕ Add Income',
        addExpense: '➕ Add Expense',
        noIncome: 'No income',
        noExpense: 'No expenses',
        noAssets: 'No assets',
        noLiabilities: 'No liabilities',
        chooseLanguage: 'Choose language:',
        chooseCurrency: 'Choose currency:',
        continue: 'Continue',
        restore: '💾 Restore',
        restoreTitle: '✅ History Restored',
        restoreMessage: 'Your history has been successfully restored from memory!',
        ok: 'OK',
        cancel: 'Cancel',
        delete: 'Delete',
        deleteConfirm: '⚠️ Delete Confirmation',
        deleteMessage: 'Are you sure you want to delete this item?',
        deleteNote: 'This action cannot be undone.',
        withdraw: 'Withdraw',
        pay: 'Pay',
        withdrawTitle: '💸 Withdraw from Asset',
        payTitle: '💰 Pay Liability',
        assetName: 'Name:',
        available: 'Available:',
        withdrawAmount: 'Withdrawal amount ($):',
        liabilityName: 'Name:',
        originalAmount: 'Original amount:',
        paidAmount: 'Paid:',
        remainingAmount: 'Remaining:',
        payAmount: 'Payment amount ($):',
        monthEndTitle: '📅 Month Completed',
        incomeLabel: 'Income:',
        expenseLabel: 'Expenses:',
        balanceLabel: 'Balance:',
        netWorth: 'Net Worth:',
        greatMonth: '🎉 Great month!',
        nextMonthBetter: '💪 Next month will be better!',
        incomeExpenseTab: '💰 Income/Expenses',
        assetsLiabilitiesTab: '💳 Assets/Liabilities'
    }
};

const currencies = {
    '$': { symbol: '$', name: 'Доллар', nameEn: 'Dollar', nameUk: 'Долар' },
    '₴': { symbol: '₴', name: 'Гривна', nameEn: 'Hryvnia', nameUk: 'Гривня' },
    '€': { symbol: '€', name: 'Евро', nameEn: 'Euro', nameUk: 'Євро' }
};

function updateLanguage() {
    const t = translations[currentLanguage];
    const currency = currencies[currentCurrency];
    
    // Update app title
    const appTitle = document.getElementById('appTitle');
    if (appTitle && t.appTitle) {
        appTitle.textContent = t.appTitle;
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    // Update currency symbols in all amounts
    updateCurrencySymbols();
    
    // Update splash screen
    updateSplashScreen();
    
    // Update modal titles and content
    updateModalContent();
}

function updateCurrencySymbols() {
    const currency = currencies[currentCurrency];
    document.querySelectorAll('.amount, .total-amount, .asset-item-amount, .liability-item-amount').forEach(element => {
        const text = element.textContent;
        const amount = parseFloat(text.replace(/[^0-9.-]/g, ''));
        if (!isNaN(amount)) {
            element.textContent = formatCurrency(amount);
        }
    });
}

function updateSplashScreen() {
    const t = translations[currentLanguage];
    const currency = currencies[currentCurrency];
    
    // Update splash labels
    const splashLabels = document.querySelectorAll('.splash-label');
    splashLabels.forEach((label, index) => {
        if (index === 0 && t.chooseLanguage) {
            label.textContent = t.chooseLanguage;
        } else if (index === 1 && t.chooseCurrency) {
            label.textContent = t.chooseCurrency;
        }
    });
    
    // Update splash button
    const splashBtn = document.getElementById('splashContinueBtn');
    if (splashBtn && t.continue) {
        splashBtn.textContent = t.continue;
    }
    
    // Update splash title
    const splashTitle = document.querySelector('.splash-title');
    if (splashTitle && t.appTitle) {
        splashTitle.textContent = t.appTitle;
    }
    
    // Update currency options
    const currencySelect = document.getElementById('splashCurrency');
    if (currencySelect) {
        currencySelect.innerHTML = '';
        Object.keys(currencies).forEach(key => {
            const option = document.createElement('option');
            const curr = currencies[key];
            option.value = key;
            if (currentLanguage === 'ru') {
                option.textContent = `${curr.name} (${curr.symbol})`;
            } else if (currentLanguage === 'uk') {
                option.textContent = `${curr.nameUk} (${curr.symbol})`;
            } else {
                option.textContent = `${curr.nameEn} (${curr.symbol})`;
            }
            currencySelect.appendChild(option);
        });
        currencySelect.value = currentCurrency;
    }
}

function updateModalContent() {
    const t = translations[currentLanguage];
    
    // Update restore modal
    const restoreTitle = document.querySelector('#restoreSuccessModal .modal-title');
    const restoreMessage = document.querySelector('#restoreSuccessModal .modal-body p');
    const restoreBtn = document.querySelector('#restoreSuccessModal .modal-footer button');
    
    if (restoreTitle && t.restoreTitle) restoreTitle.textContent = t.restoreTitle;
    if (restoreMessage && t.restoreMessage) restoreMessage.textContent = t.restoreMessage;
    if (restoreBtn && t.ok) restoreBtn.textContent = t.ok;
    
    // Update delete confirm modal
    const deleteTitle = document.querySelector('#deleteConfirmModal .modal-title');
    const deleteMessage = document.querySelector('#deleteConfirmModal .modal-body p');
    const deleteNote = document.querySelector('#deleteConfirmModal .modal-body p:last-child');
    const deleteBtn = document.querySelector('#deleteConfirmModal .modal-footer button:last-child');
    const cancelBtn = document.querySelector('#deleteConfirmModal .modal-footer button:first-child');
    
    if (deleteTitle && t.deleteConfirm) deleteTitle.textContent = t.deleteConfirm;
    if (deleteMessage && t.deleteMessage) deleteMessage.textContent = t.deleteMessage;
    if (deleteNote && t.deleteNote) deleteNote.textContent = t.deleteNote;
    if (deleteBtn && t.delete) deleteBtn.textContent = t.delete;
    if (cancelBtn && t.cancel) cancelBtn.textContent = t.cancel;
}

function formatCurrency(amount) {
    const currency = currencies[currentCurrency];
    return `${amount.toFixed(2)} ${currency.symbol}`;
}
