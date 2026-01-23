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
}

function switchToAssetsLiabilities() {
    currentSwipePanel = 1;
    updateSwipePanel();
    updateSwipeTabs();
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
    
    if (splashScreen && splashContinueBtn && splashLanguage && splashCurrency) {
        container.style.display = 'none';
        splashScreen.style.display = 'flex';
        
        splashLanguage.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            
            // Update header language selector
            const headerLanguageSelect = document.getElementById('headerLanguageSelect');
            if (headerLanguageSelect && headerLanguageSelect.value !== currentLanguage) {
                headerLanguageSelect.value = currentLanguage;
            }
            
            updateLanguage();
        });
        
        splashContinueBtn.onclick = function() {
            // Сохраняем язык и валюту
            localStorage.setItem('language', splashLanguage.value);
            localStorage.setItem('currency', splashCurrency.value);
            // Применяем язык
            currentLanguage = splashLanguage.value;
            currentCurrency = splashCurrency.value;
            
            // Update header language selector
            if (headerLanguageSelect) {
                headerLanguageSelect.value = currentLanguage;
            }
            
            updateLanguage();
            // Показываем основной сайт
            splashScreen.style.display = 'none';
            container.style.display = '';
        };
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

    if (!name || !amount || amount <= 0) {
        alert('Пожалуйста, заполните все поля корректно');
        return;
    }

    const asset = {
        id: Date.now(),
        name: name,
        amount: amount,
        rate: rate,
        date: new Date().toISOString()
    };

    assets.push(asset);
    saveData();
    updateAll();
    closeAssetModal();
}

function addLiabilityTransaction() {
    const name = document.getElementById('liabilityName').value;
    const amount = parseFloat(document.getElementById('liabilityAmount').value);
    const rate = parseFloat(document.getElementById('liabilityRate').value) || 0;

    if (!name || !amount || amount <= 0) {
        alert('Пожалуйста, заполните все поля корректно');
        return;
    }

    const liability = {
        id: Date.now(),
        name: name,
        amount: amount,
        rate: rate,
        paid: 0,
        date: new Date().toISOString()
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
    if (confirm('Вы уверены, что хотите удалить этот актив?')) {
        assets = assets.filter(asset => asset.id !== id);
        saveData();
        updateAll();
    }
}

function deleteLiability(id) {
    if (confirm('Вы уверены, что хотите удалить этот пассив?')) {
        liabilities = liabilities.filter(liability => liability.id !== id);
        saveData();
        updateAll();
    }
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
            <div style="color: ${amountColor}; font-weight: 700; font-size: 1rem;">
                ${prefix} ${formatCurrency(transaction.amount)}
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
}

function loadData() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');
    const storedLastMonthEnd = localStorage.getItem('lastMonthEnd');
    const storedLanguage = localStorage.getItem('language');
    const storedCurrency = localStorage.getItem('currency');

    if (storedTransactions) transactions = JSON.parse(storedTransactions);
    if (storedAssets) assets = JSON.parse(storedAssets);
    if (storedLiabilities) liabilities = JSON.parse(storedLiabilities);
    if (storedLastMonthEnd) lastMonthEnd = new Date(storedLastMonthEnd);
    if (storedLanguage) currentLanguage = storedLanguage;
    if (storedCurrency) currentCurrency = storedCurrency;
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
