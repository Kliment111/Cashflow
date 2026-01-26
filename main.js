// --- DІЯ STYLE NAVIGATION ---
let currentTab = 'income'; // income, expense, assets, liabilities
let touchStartX = 0;
let touchEndX = 0;
let deferredInstallPrompt = null;
let refreshing = false;
let isSwiping = false;
let swipeStartTab = '';

// Tab switching functions
function switchToTab(tabName) {
    currentTab = tabName;
    updateDiaPanel();
    updateDiaTabs();
    updateIndicators();
    
    // Scroll to top of dia container
    const diaContainer = document.querySelector('.dia-container');
    if (diaContainer) {
        diaContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateDiaPanel() {
    const panels = document.querySelectorAll('.dia-panel');
    panels.forEach(panel => {
        if (panel.dataset.panel === currentTab) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

function updateDiaTabs() {
    const tabs = document.querySelectorAll('.dia-tab');
    tabs.forEach(tab => {
        if (tab.dataset.tab === currentTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        if (indicator.dataset.indicator === currentTab) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Touch events for swipe navigation
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    swipeStartTab = currentTab;
    isSwiping = false;
}

function handleTouchMove(e) {
    if (!touchStartX) return;
    
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    // Only start swipe if moved enough
    if (Math.abs(diff) > 10) {
        isSwiping = true;
    }
}

function handleTouchEnd(e) {
    if (!touchStartX || !isSwiping) return;
    
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
    
    touchStartX = 0;
    touchEndX = 0;
    isSwiping = false;
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    const tabs = ['income', 'expense', 'assets', 'liabilities'];
    const currentIndex = tabs.indexOf(currentTab);
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < tabs.length - 1) {
            // Swipe left - next tab
            switchToTab(tabs[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous tab
            switchToTab(tabs[currentIndex - 1]);
        }
    }
}

// Touch events initialization moved to initializeDiaNavigation()

// --- LEGACY SWIPE NAVIGATION (for backward compatibility) ---
let currentSwipePanel = 0; // 0 = transactions, 1 = assets/liabilities

function switchToTransactions() {
    switchToTab('income'); // Redirect to new tab system
}

function switchToAssetsLiabilities() {
    switchToTab('assets'); // Redirect to new tab system
}

function updateSwipePanel() {
    // Legacy function - now handled by updateDiaPanel
}

function updateSwipeTabs() {
    // Legacy function - now handled by updateDiaTabs
}

// --- APP INITIALIZATION ---
function initializeApp() {
    // Load data and initialize
    loadData();
    updateAll();
    initializeCustomSuggestions();
    
    // Setup auto-save
    setupAutoSave();
    
    // Start auto-backup system
    startAutoBackup();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize DІЯ navigation (replaces old swipe navigation)
    initializeDiaNavigation();
    
    // Initialize PWA install button
    initializeInstallButton();
    
    // Set current month
    currentMonth = new Date();
    
    // Update month display
    updateMonthDisplay();
}

// Initialize DІЯ navigation
function initializeDiaNavigation() {
    const diaContainer = document.querySelector('.dia-container');
    if (diaContainer) {
        diaContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        diaContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        diaContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Initialize indicators click events
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            switchToTab(this.dataset.indicator);
        });
    });
}

// --- CALENDAR FUNCTIONALITY ---
let calendarCurrentDate = new Date();
let calendarSelectedDate = null;

function initializeCalendar() {
    const calendarBtn = document.getElementById('calendarBtn');
    const calendarDropdown = document.getElementById('calendarDropdown');
    const calendarPrevBtn = document.getElementById('calendarPrevBtn');
    const calendarNextBtn = document.getElementById('calendarNextBtn');
    
    // Toggle calendar
    calendarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarDropdown.classList.toggle('show');
        if (calendarDropdown.classList.contains('show')) {
            renderCalendar();
        }
    });
    
    // Close calendar when clicking outside
    document.addEventListener('click', function(e) {
        if (!calendarDropdown.contains(e.target) && e.target !== calendarBtn) {
            calendarDropdown.classList.remove('show');
        }
    });
    
    // Navigation buttons
    calendarPrevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
        renderCalendar();
    });
    
    calendarNextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();
    
    // Update title
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    document.getElementById('calendarTitle').textContent = `${monthNames[month]} ${year}`;
    
    // Clear grid
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add weekdays
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'calendar-weekdays';
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-weekday';
        dayElement.textContent = day;
        weekdaysRow.appendChild(dayElement);
    });
    calendarGrid.appendChild(weekdaysRow);
    
    // Add days
    const daysRow = document.createElement('div');
    daysRow.className = 'calendar-days';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay() || 7; // Sunday = 7
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    
    // Previous month days
    for (let i = firstDayOfWeek - 2; i >= 0; i--) {
        const dayElement = createDayElement(daysInPrevMonth - i, true, false, false, year, month - 1);
        daysRow.appendChild(dayElement);
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === todayDate;
        const hasTransactions = checkTransactionsForDate(year, month, day);
        const dayElement = createDayElement(day, false, isToday, hasTransactions, year, month);
        daysRow.appendChild(dayElement);
    }
    
    // Next month days
    const totalCells = daysRow.children.length;
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, false, false, year, month + 1);
        daysRow.appendChild(dayElement);
    }
    
    calendarGrid.appendChild(daysRow);
}

function createDayElement(day, isOtherMonth, isToday, hasTransactions, year, month) {
    const dayElement = document.createElement('button');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (isToday) {
        dayElement.classList.add('today');
    }
    
    if (hasTransactions) {
        dayElement.classList.add('has-transactions');
    }
    
    // Add click handler
    dayElement.addEventListener('click', function(e) {
        e.stopPropagation();
        selectDate(year, month, day);
    });
    
    return dayElement;
}

function checkTransactionsForDate(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactions.some(t => t.date === dateStr);
}

function selectDate(year, month, day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked day
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(dayEl => {
        if (dayEl.textContent == day && !dayEl.classList.contains('other-month')) {
            dayEl.classList.add('selected');
        }
    });
    
    // Update current month in the app
    currentMonth = new Date(year, month, 1);
    
    // Update displays
    updateMonthDisplay();
    updateAll();
    
    // Close calendar
    document.getElementById('calendarDropdown').classList.remove('show');
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
    // Update suggestions when language changes
    document.addEventListener('languageChanged', updateSuggestions);
    
    // Initialize custom suggestions
    initializeCustomSuggestions();

    // Set up month end button
    const monthEndBtn = document.getElementById('monthEndBtn');
    if (monthEndBtn) {
        monthEndBtn.addEventListener('click', endMonth);
    }
    
    // Initialize calendar
    initializeCalendar();
}

function initializeInstallButton() {
    const installButton = document.getElementById('installAppBtn');
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    console.log('Install button found:', !!installButton);
    console.log('Is iOS:', isIos);
    console.log('Is standalone:', isInStandalone);
    console.log('Deferred prompt available:', !!deferredInstallPrompt);

    if (installButton) {
        installButton.addEventListener('click', async () => {
            console.log('Install button clicked');
            if (deferredInstallPrompt) {
                console.log('Showing install prompt');
                deferredInstallPrompt.prompt();
                const choiceResult = await deferredInstallPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    installButton.classList.remove('is-visible');
                }
                deferredInstallPrompt = null;
            } else if (isIos && !isInStandalone) {
                console.log('Showing iOS instructions');
                showIosInstallInstructions();
            } else {
                console.log('No install prompt available, showing manual instructions');
                alert('Установка недоступна. Попробуйте открыть в браузере Chrome на Android или следуйте инструкциям для iPhone.');
            }
        });

        if (isIos && !isInStandalone) {
            installButton.classList.add('is-visible');
        }
    }
}

function showIosInstallInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>📱 Установка на iPhone</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📱</div>
                    <h3 style="color: var(--primary); margin-bottom: 20px;">Как установить приложение:</h3>
                    <div style="text-align: left; background: var(--light-gray); padding: 15px; border-radius: 8px;">
                        <p style="margin-bottom: 10px;"><strong>1.</strong> Нажмите кнопку <strong>"Поделиться"</strong> 📤 внизу экрана</p>
                        <p style="margin-bottom: 10px;"><strong>2.</strong> Прокрутите и нажмите <strong>"На экран 'Домой'"</strong> ➕</p>
                        <p style="margin-bottom: 10px;"><strong>3.</strong> Нажмите <strong>"Добавить"</strong> для подтверждения</p>
                    </div>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-top: 20px;">
                        Приложение появится на вашем домашнем экране!
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Понятно</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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
            updateAll();
            
            // Initialize app after splash
            initializeApp();
        };
    } else {
        // Если splash screen не найден, просто показываем приложение
        updateLanguage();
        initializeApp();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then((registration) => {
            if (registration.waiting) {
                showUpdateBanner(registration);
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner(registration);
                    }
                });
            });
        });

        const tryUpdate = () => {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    registration.update();
                }
            });
        };

        setInterval(tryUpdate, 30 * 60 * 1000);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                tryUpdate();
            }
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }
});

function showUpdateBanner(registration) {
    let banner = document.getElementById('updateBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'updateBanner';
        banner.className = 'update-banner';
        banner.innerHTML = `
            <span>Доступна новая версия приложения.</span>
            <button class="btn btn-success" id="updateBannerBtn">Обновить</button>
        `;
        document.body.appendChild(banner);
    }

    const button = banner.querySelector('#updateBannerBtn');
    if (button) {
        button.onclick = () => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        };
    }

    banner.classList.add('is-visible');
}

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;

    const installButton = document.getElementById('installAppBtn');
    if (installButton) {
        installButton.classList.add('is-visible');
    }
});

// Восстановить историю из localStorage
function restoreHistory() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');

    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
    if (storedAssets) {
        assets = JSON.parse(storedAssets);
    }
    if (storedLiabilities) {
        liabilities = JSON.parse(storedLiabilities);
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

function showTopUpConfirm(existingAsset, amount, rate) {
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


// --- TRANSACTION FUNCTIONS ---
function addAssetTransaction() {
    const name = document.getElementById('assetName').value;
    const amount = parseFloat(document.getElementById('assetAmount').value);
    const rate = parseFloat(document.getElementById('assetRate').value) || 0;

    // Validation
    if (!name || !amount || amount <= 0) {
        showValidationError('Пожалуйста, заполните все поля корректно');
        return;
    }

    // Check for existing asset with same name
    const existingAsset = assets.find(asset => asset.name.toLowerCase() === name.toLowerCase());
    
    if (existingAsset) {
        // Show confirmation to top up existing asset
        showTopUpConfirm(existingAsset, amount, rate);
    } else {
        // Track usage for suggestions
        trackAssetUsage(name);
        
        // Create new asset
        const asset = {
            id: Date.now(),
            name: name,
            amount: amount,
            rate: rate,
            date: new Date().toISOString().split('T')[0]
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
        date: new Date().toISOString().split('T')[0]
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

function editTransaction(type, id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    if (type === 'income') {
        // Fill income modal with transaction data
        document.getElementById('incomeType').value = transaction.category || 'other';
        document.getElementById('incomeDescription').value = transaction.description;
        document.getElementById('incomeAmount').value = transaction.amount;
        document.getElementById('incomeDate').value = transaction.date;
        
        // Store editing ID
        window.editingTransactionId = id;
        
        // Change modal title and button
        const modal = document.getElementById('incomeModal');
        modal.querySelector('h2').textContent = '💰 Редактировать доход';
        modal.querySelector('.btn-income').textContent = 'Сохранить изменения';
        modal.querySelector('.btn-income').onclick = function() {
            updateTransaction(id, 'income');
        };
        
        openIncomeModal();
    } else if (type === 'expense') {
        // Fill expense modal with transaction data
        document.getElementById('expenseType').value = transaction.category || 'other';
        document.getElementById('expenseDescription').value = transaction.description;
        document.getElementById('expenseAmount').value = transaction.amount;
        document.getElementById('expenseDate').value = transaction.date;
        
        // Store editing ID
        window.editingTransactionId = id;
        
        // Change modal title and button
        const modal = document.getElementById('expenseModal');
        modal.querySelector('h2').textContent = '💸 Редактировать расход';
        modal.querySelector('.btn-expense').textContent = 'Сохранить изменения';
        modal.querySelector('.btn-expense').onclick = function() {
            updateTransaction(id, 'expense');
        };
        
        openExpenseModal();
    }
}

function updateTransaction(id, type) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    if (type === 'income') {
        transaction.category = document.getElementById('incomeType').value;
        transaction.description = document.getElementById('incomeDescription').value;
        transaction.amount = parseFloat(document.getElementById('incomeAmount').value);
        transaction.date = document.getElementById('incomeDate').value;
        
        closeIncomeModal();
    } else if (type === 'expense') {
        transaction.category = document.getElementById('expenseType').value;
        transaction.description = document.getElementById('expenseDescription').value;
        transaction.amount = parseFloat(document.getElementById('expenseAmount').value);
        transaction.date = document.getElementById('expenseDate').value;
        
        closeExpenseModal();
    }
    
    // Reset modal
    resetModal(type);
    
    // Update displays
    updateAll();
    saveData();
}

function resetModal(type) {
    window.editingTransactionId = null;
    
    if (type === 'income') {
        const modal = document.getElementById('incomeModal');
        modal.querySelector('h2').textContent = '💰 Добавить доход';
        modal.querySelector('.btn-income').textContent = 'Добавить';
        modal.querySelector('.btn-income').onclick = addIncomeTransaction;
        document.getElementById('incomeType').value = 'other';
        document.getElementById('incomeDescription').value = '';
        document.getElementById('incomeAmount').value = '';
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];
    } else if (type === 'expense') {
        const modal = document.getElementById('expenseModal');
        modal.querySelector('h2').textContent = '💸 Добавить расход';
        modal.querySelector('.btn-expense').textContent = 'Добавить';
        modal.querySelector('.btn-expense').onclick = addExpenseTransaction;
        document.getElementById('expenseType').value = 'other';
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    }
}

function deleteTransaction(type, id) {
    showDeleteConfirm('транзакцию', () => {
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions.splice(index, 1);
            updateAll();
            saveData();
        }
    });
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
    
    // Group transactions by category
    const incomeCategories = {};
    const expenseCategories = {};
    
    currentMonthTransactions.forEach(transaction => {
        const category = transaction.category || transaction.description;
        
        if (transaction.type === 'income') {
            if (!incomeCategories[category]) {
                incomeCategories[category] = {
                    amount: 0,
                    transactions: []
                };
            }
            incomeCategories[category].amount += transaction.amount;
            incomeCategories[category].transactions.push(transaction);
            totalIncome += transaction.amount;
        } else {
            if (!expenseCategories[category]) {
                expenseCategories[category] = {
                    amount: 0,
                    transactions: []
                };
            }
            expenseCategories[category].amount += transaction.amount;
            expenseCategories[category].transactions.push(transaction);
            totalExpense += transaction.amount;
        }
    });
    
    // Create DІЯ style cards for income
    Object.entries(incomeCategories).forEach(([category, data]) => {
        const card = createDiaCard(category, data.amount, data.transactions[0], 'income', data.transactions.length);
        incomeList.appendChild(card);
    });
    
    // Create DІЯ style cards for expenses
    Object.entries(expenseCategories).forEach(([category, data]) => {
        const card = createDiaCard(category, data.amount, data.transactions[0], 'expense', data.transactions.length);
        expenseList.appendChild(card);
    });
    
    // Update totals
    totalIncomeElement.textContent = formatCurrency(totalIncome);
    totalExpenseElement.textContent = formatCurrency(totalExpense);
    
    // Show empty states if needed
    if (incomeList.children.length === 0) {
        incomeList.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💰</div>
                <div class="dia-empty-text">${t.noIncome}</div>
                <div class="dia-empty-subtext">Добавьте свой первый доход</div>
            </div>
        `;
    }
    if (expenseList.children.length === 0) {
        expenseList.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💸</div>
                <div class="dia-empty-text">${t.noExpense}</div>
                <div class="dia-empty-subtext">Добавьте свой первый расход</div>
            </div>
        `;
    }
}

function createDiaCard(title, amount, transaction, type, count = 1) {
    const card = document.createElement('div');
    card.className = `dia-card ${type}`;
    
    // Get icon based on type and category
    const icon = getCardIcon(type, transaction?.category || title);
    
    // Format date
    const date = transaction?.date ? new Date(transaction.date).toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
    }) : '';
    
    card.innerHTML = `
        <div class="dia-card-header">
            <div class="dia-card-icon">${icon}</div>
            <div class="dia-card-amount ${type}">${formatCurrency(amount)}</div>
        </div>
        <h3 class="dia-card-title">${title}</h3>
        <div class="dia-card-details">
            <div class="dia-card-date">
                📅 ${date}
                ${count > 1 ? `• ${count} операций` : ''}
            </div>
            <div class="dia-card-type">${getCategoryLabel(transaction?.category || title, type)}</div>
        </div>
        <div class="dia-card-actions">
            <button class="dia-card-btn edit" onclick="editTransaction('${type}', ${transaction?.id})">✏️</button>
            <button class="dia-card-btn delete" onclick="deleteTransaction('${type}', ${transaction?.id})">🗑️</button>
        </div>
    `;
    
    return card;
}

function getCardIcon(type, category) {
    const icons = {
        income: {
            salary: '💼',
            bonus: '🎁',
            freelance: '💻',
            investment: '📈',
            gift: '🎁',
            other: '💰'
        },
        expense: {
            food: '🍔',
            transport: '🚗',
            utilities: '💡',
            entertainment: '🎮',
            health: '🏥',
            shopping: '🛍️',
            other: '💸'
        },
        asset: {
            'Наличность': '💵',
            'Банковский счёт': '🏦',
            'Сбережения': '🏆',
            'Инвестиции': '📊',
            'Депозит': '📋',
            'Криптовалюта': '₿',
            'Недвижимость': '🏠',
            'Автомобиль': '🚗'
        },
        liability: {
            'Ипотека': '🏠',
            'Кредит на машину': '🚗',
            'Потребительский кредит': '💳',
            'Кредитная карта': '💳',
            'Налоги': '📄',
            'Коммунальные платежи': '💡',
            'Долг другу': '🤝',
            'Образовательный кредит': '📚'
        }
    };
    
    return icons[type]?.[category] || (type === 'income' ? '💰' : type === 'expense' ? '💸' : type === 'asset' ? '💳' : '📊');
}

function getCategoryLabel(category, type) {
    const labels = {
        income: {
            salary: 'Зарплата',
            bonus: 'Бонус',
            freelance: 'Фриланс',
            investment: 'Инвестиции',
            gift: 'Подарок',
            other: 'Другое'
        },
        expense: {
            food: 'Продукты',
            transport: 'Транспорт',
            utilities: 'Коммунальные',
            entertainment: 'Развлечения',
            health: 'Здоровье',
            shopping: 'Покупки',
            other: 'Другое'
        }
    };
    
    return labels[type]?.[category] || category;
}

function createCategoryItem(category, amount, transactions, type) {
    const item = document.createElement('div');
    item.className = 'category-item';
    item.style.cssText = `
        background: var(--white);
        padding: 12px;
        border-radius: var(--radius);
        border: 1px solid rgba(0, 0, 0, 0.05);
        margin-bottom: 8px;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    
    const amountColor = type === 'income' ? 'var(--success)' : 'var(--danger)';
    const prefix = type === 'income' ? '+' : '-';
    const count = transactions.length;
    
    item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600; color: var(--dark); font-size: 0.9rem;">
                    ${category}
                    <span style="color: var(--gray); font-size: 0.8rem; margin-left: 8px;">(${count})</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="color: ${amountColor}; font-weight: 700; font-size: 1rem;">
                    ${prefix} ${formatCurrency(amount)}
                </div>
            </div>
        </div>
    `;
    
    // Add click handler to show details
    item.addEventListener('click', () => showCategoryDetails(category, transactions, type));
    
    // Add hover effect
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = 'var(--shadow)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'var(--shadow-sm)';
    });
    
    return item;
}

function showCategoryDetails(category, transactions, type) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const amountColor = type === 'income' ? 'var(--success)' : 'var(--danger)';
    const prefix = type === 'income' ? '+' : '-';
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>${type === 'income' ? '💰' : '💸'} ${category}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: ${amountColor}20; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: ${amountColor};">
                        ${prefix} ${formatCurrency(totalAmount)}
                    </div>
                    <div style="color: var(--gray); font-size: 0.9rem; margin-top: 5px;">
                        ${transactions.length} транзакций
                    </div>
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${transactions.map(transaction => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--light-gray);">
                            <div>
                                <div style="font-weight: 500; color: var(--dark); font-size: 0.9rem;">
                                    ${transaction.description}
                                </div>
                                <div style="color: var(--gray); font-size: 0.8rem;">
                                    ${transaction.date}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="color: ${amountColor}; font-weight: 600; font-size: 0.9rem;">
                                    ${prefix} ${formatCurrency(transaction.amount)}
                                </div>
                                <button class="btn-delete-small" onclick="deleteTransaction(${transaction.id}); this.closest('.modal').remove();" style="background: #ff4757; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;">×</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function updateAssets() {
    const assetsList = document.getElementById('assetsList');
    const totalElement = document.getElementById('totalAssetsAmount');
    
    if (!assetsList || !totalElement) return;

    assetsList.innerHTML = '';
    let total = 0;

    if (assets.length === 0) {
        assetsList.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💳</div>
                <div class="dia-empty-text">Нет активов</div>
                <div class="dia-empty-subtext">Добавьте свой первый актив</div>
            </div>
        `;
    } else {
        assets.forEach(asset => {
            total += asset.amount;
            
            const card = createAssetCard(asset);
            assetsList.appendChild(card);
        });
    }

    totalElement.textContent = formatCurrency(total);
}

function createAssetCard(asset) {
    const card = document.createElement('div');
    card.className = 'dia-card asset';
    
    const icon = getCardIcon('asset', asset.name);
    const rate = asset.rate ? `${asset.rate}% годовых` : 'Без ставки';
    
    card.innerHTML = `
        <div class="dia-card-header">
            <div class="dia-card-icon">${icon}</div>
            <div class="dia-card-amount asset">${formatCurrency(asset.amount)}</div>
        </div>
        <h3 class="dia-card-title">${asset.name}</h3>
        <div class="dia-card-details">
            <div class="dia-card-type">${rate}</div>
        </div>
        <div class="dia-card-actions">
            <button class="dia-card-btn withdraw" onclick="withdrawFromAsset(${asset.id})">💸 Снять</button>
            <button class="dia-card-btn delete" onclick="deleteAsset(${asset.id})">🗑️</button>
        </div>
    `;
    
    return card;
}

function updateLiabilities() {
    const liabilitiesList = document.getElementById('liabilitiesList');
    const totalElement = document.getElementById('totalLiabilitiesAmount');
    
    if (!liabilitiesList || !totalElement) return;

    liabilitiesList.innerHTML = '';
    let total = 0;

    if (liabilities.length === 0) {
        liabilitiesList.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">📊</div>
                <div class="dia-empty-text">Нет пассивов</div>
                <div class="dia-empty-subtext">Добавьте свой первый пассив</div>
            </div>
        `;
    } else {
        liabilities.forEach(liability => {
            const remaining = liability.amount - liability.paid;
            total += remaining;
            
            const card = createLiabilityCard(liability);
            liabilitiesList.appendChild(card);
        });
    }

    totalElement.textContent = formatCurrency(total);
}

function createLiabilityCard(liability) {
    const card = document.createElement('div');
    card.className = 'dia-card liability';
    
    const icon = getCardIcon('liability', liability.name);
    const remaining = liability.amount - liability.paid;
    const rate = liability.rate ? `${liability.rate}% годовых` : 'Без ставки';
    const progressPercent = (liability.paid / liability.amount) * 100;
    
    card.innerHTML = `
        <div class="dia-card-header">
            <div class="dia-card-icon">${icon}</div>
            <div class="dia-card-amount liability">${formatCurrency(remaining)}</div>
        </div>
        <h3 class="dia-card-title">${liability.name}</h3>
        <div class="dia-card-details">
            <div class="dia-card-type">${rate}</div>
            <div class="dia-card-date">
                Погашено: ${formatCurrency(liability.paid)} из ${formatCurrency(liability.amount)}
            </div>
            <div style="background: var(--gray-light); border-radius: 4px; height: 4px; margin-top: 4px;">
                <div style="background: #f59e0b; height: 100%; border-radius: 4px; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
            </div>
        </div>
        <div class="dia-card-actions">
            <button class="dia-card-btn pay" onclick="payLiability(${liability.id})">💰 Погасить</button>
            <button class="dia-card-btn delete" onclick="deleteLiability(${liability.id})">🗑️</button>
        </div>
    `;
    
    return card;
}


function getCurrentMonthTransactions() {
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
    });
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

// --- UTILITY FUNCTIONS ---
function formatCurrency(amount) {
    return `${amount.toFixed(2)} ${currentCurrency}`;
}

// --- ENHANCED AUTO-BACKUP SYSTEM ---

// Автоматическое резервное копирование каждые 5 минут
let autoBackupInterval;

function startAutoBackup() {
    // Сразу делаем бэкап
    autoBackup();
    
    // Затем каждые 5 минут
    autoBackupInterval = setInterval(autoBackup, 5 * 60 * 1000);
}

function stopAutoBackup() {
    if (autoBackupInterval) {
        clearInterval(autoBackupInterval);
    }
}

// Улучшенное автоматическое резервное копирование
function autoBackup() {
    const data = {
        transactions: transactions,
        assets: assets,
        liabilities: liabilities,
        assetUsageCount: assetUsageCount,
        liabilityUsageCount: liabilityUsageCount,
        backupDate: new Date().toISOString(),
        version: '1.0',
        deviceInfo: navigator.userAgent,
        lastBackupTime: Date.now()
    };
    
    // Сохраняем в localStorage с меткой времени
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(`cashflow-backup-${timestamp}`, JSON.stringify(data));
    
    // Обновляем последнюю копию
    localStorage.setItem('cashflow-latest-backup', JSON.stringify(data));
    
    // Сохраняем последние 10 копий
    const backups = JSON.parse(localStorage.getItem('cashflow-backups') || '[]');
    backups.unshift({
        timestamp: timestamp,
        data: data
    });
    
    // Оставляем только последние 10 копий
    if (backups.length > 10) {
        backups.splice(10);
    }
    
    localStorage.setItem('cashflow-backups', JSON.stringify(backups));
    
    // Показываем уведомление о бэкапе
    showBackupNotification();
}

// Уведомление о бэкапе
function showBackupNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        transition: all 0.3s ease;
    `;
    notification.textContent = '💾 Данные сохранены';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Восстановление из автосохранения
function restoreFromAutoBackup() {
    const backup = localStorage.getItem('cashflow-latest-backup');
    
    if (backup) {
        if (confirm('Восстановить данные из последнего автосохранения?')) {
            const data = JSON.parse(backup);
            transactions = data.transactions || [];
            assets = data.assets || [];
            liabilities = data.liabilities || [];
            assetUsageCount = data.assetUsageCount || {};
            liabilityUsageCount = data.liabilityUsageCount || {};
            
            saveData();
            updateAll();
            alert('✅ Данные восстановлены из резервной копии!');
        }
    } else {
        alert('❌ Резервная копия не найдена');
    }
}

// Экспорт данных в файл
function exportData() {
    const data = {
        transactions: transactions,
        assets: assets,
        liabilities: liabilities,
        assetUsageCount: assetUsageCount,
        liabilityUsageCount: liabilityUsageCount,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cashflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
}

// Импорт данных из файла
function importData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Проверяем версию и структуру
            if (data.version && data.transactions) {
                // Подтверждение импорта
                if (confirm('Импортировать данные? Текущие данные будут заменены.')) {
                    transactions = data.transactions || [];
                    assets = data.assets || [];
                    liabilities = data.liabilities || [];
                    assetUsageCount = data.assetUsageCount || {};
                    liabilityUsageCount = data.liabilityUsageCount || {};
                    
                    saveData();
                    updateAll();
                    alert('✅ Данные успешно импортированы!');
                }
            } else {
                alert('❌ Неверный формат файла резервной копии');
            }
        } catch (error) {
            alert('❌ Ошибка при чтении файла: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function saveData() {
    try {
        // Save to localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('assets', JSON.stringify(assets));
        localStorage.setItem('liabilities', JSON.stringify(liabilities));
        localStorage.setItem('assetUsageCount', JSON.stringify(assetUsageCount));
        localStorage.setItem('liabilityUsageCount', JSON.stringify(liabilityUsageCount));
        localStorage.setItem('lastSaveTime', new Date().toISOString());
        
        // Automatic backup
        autoBackup();
        
        // Show save indicator (subtle)
        showSaveIndicator();
        
        console.log('Данные успешно сохранены локально');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
        showDataMessage('Ошибка сохранения данных', 'error');
    }
}

function loadData() {
    const storedTransactions = localStorage.getItem('transactions');
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');
    const storedLanguage = localStorage.getItem('language');
    const storedCurrency = localStorage.getItem('currency');
    const storedAssetUsage = localStorage.getItem('assetUsageCount');
    const storedLiabilityUsage = localStorage.getItem('liabilityUsageCount');

    if (storedTransactions) transactions = JSON.parse(storedTransactions);
    if (storedAssets) assets = JSON.parse(storedAssets);
    if (storedLiabilities) liabilities = JSON.parse(storedLiabilities);
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
    // Month display is now handled by the calendar dropdown
    // This function can be used for other month-related updates if needed
}

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    updateMonthDisplay();
    updateSummary();
}

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

    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal active month-end-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>📅 Месяц завершён</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; gap: 12px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #d1fae5; border-radius: 8px;">
                        <span>Доходы:</span>
                        <strong style="color: #059669;">${formatCurrency(income)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #fee2e2; border-radius: 8px;">
                        <span>Расходы:</span>
                        <strong style="color: #dc2626;">${formatCurrency(expense)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #dbeafe; border-radius: 8px;">
                        <span>Баланс:</span>
                        <strong style="color: #2563eb;">${formatCurrency(balance)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #fef3c7; border-radius: 8px;">
                        <span>Чистая стоимость:</span>
                        <strong style="color: #d97706;">${formatCurrency(netWorth)}</strong>
                    </div>
                </div>
                <p style="text-align: center; color: #6b7280; font-size: 14px;">
                    ${balance >= 0 ? '🎉 Отличный месяц!' : '💪 В следующем месяце будет лучше!'}
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" onclick="this.closest('.modal').remove()">ОК</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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

// Settings modal functions
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Load current settings
        loadSettingsValues();
        // Update data section info
        updateDataSection();
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Settings button event listener
document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }
    
    // Close modal on backdrop click
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal || e.target.classList.contains('modal-backdrop')) {
                closeSettingsModal();
            }
        });
    }
});

// Load current settings into modal
function loadSettingsValues() {
    const settingsLanguage = document.getElementById('settingsLanguage');
    const settingsCurrency = document.getElementById('settingsCurrency');
    
    if (settingsLanguage) {
        settingsLanguage.value = currentLanguage;
    }
    if (settingsCurrency) {
        settingsCurrency.value = currentCurrency;
    }
}

// Apply language and currency settings
function applyLanguageSettings() {
    const settingsLanguage = document.getElementById('settingsLanguage');
    const settingsCurrency = document.getElementById('settingsCurrency');
    
    if (settingsLanguage && settingsCurrency) {
        const newLanguage = settingsLanguage.value;
        const newCurrency = settingsCurrency.value;
        
        // Update global variables
        currentLanguage = newLanguage;
        currentCurrency = newCurrency;
        
        // Save to localStorage
        localStorage.setItem('language', currentLanguage);
        localStorage.setItem('currency', currentCurrency);
        
        // Update UI
        updateLanguage();
        updateCurrencySymbols();
        updateModalContent();
        
        // Show success message
        showSettingsSuccess();
        
        // Close modal after a short delay
        setTimeout(() => {
            closeSettingsModal();
        }, 1500);
    }
}

// Show success message for settings
function showSettingsSuccess() {
    const settingsSection = document.querySelector('.settings-section:last-child');
    if (settingsSection) {
        const successMsg = document.createElement('div');
        successMsg.className = 'settings-success';
        successMsg.textContent = 'Настройки успешно применены!';
        successMsg.style.cssText = `
            background: var(--success-light);
            color: var(--success);
            padding: 8px 12px;
            border-radius: 6px;
            margin-top: 12px;
            font-size: 0.9rem;
            text-align: center;
        `;
        
        settingsSection.appendChild(successMsg);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 2000);
    }
}

// Export data to JSON file
function exportData() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        language: currentLanguage,
        currency: currentCurrency,
        transactions: transactions,
        assets: assets,
        liabilities: liabilities,
        assetUsageCount: assetUsageCount,
        liabilityUsageCount: liabilityUsageCount
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cashflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Show success message
    showDataMessage('Данные успешно экспортированы!', 'success');
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData.transactions || !importedData.assets || !importedData.liabilities) {
                throw new Error('Неверный формат файла');
            }
            
            // Confirm import
            if (confirm('Импортировать данные? Это заменит все текущие данные.')) {
                // Import data
                transactions = importedData.transactions || [];
                assets = importedData.assets || [];
                liabilities = importedData.liabilities || [];
                assetUsageCount = importedData.assetUsageCount || {};
                liabilityUsageCount = importedData.liabilityUsageCount || {};
                
                if (importedData.language) {
                    currentLanguage = importedData.language;
                    localStorage.setItem('language', currentLanguage);
                }
                
                if (importedData.currency) {
                    currentCurrency = importedData.currency;
                    localStorage.setItem('currency', currentCurrency);
                }
                
                // Save and update UI
                saveData();
                updateLanguage();
                updateCurrencySymbols();
                updateTransactions();
                updateAssets();
                updateLiabilities();
                updateSummary();
                
                // Show success message
                showDataMessage('Данные успешно импортированы!', 'success');
                
                // Close settings modal
                setTimeout(() => {
                    closeSettingsModal();
                }, 1500);
            }
        } catch (error) {
            showDataMessage('Ошибка при импорте: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Show save indicator
function showSaveIndicator() {
    // Remove existing indicator
    const existing = document.querySelector('.save-indicator');
    if (existing) {
        existing.remove();
    }
    
    // Create indicator
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.innerHTML = '💾 Сохранено';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    // Show indicator
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
    }, 100);
    
    // Hide indicator
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

// Update data management section with save info
function updateDataSection() {
    const dataSection = document.querySelector('.settings-section:nth-child(2)');
    if (dataSection) {
        const lastSaveTime = localStorage.getItem('lastSaveTime');
        const infoDiv = dataSection.querySelector('.settings-info');
        
        if (infoDiv && lastSaveTime) {
            const saveDate = new Date(lastSaveTime);
            const formattedDate = saveDate.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            infoDiv.innerHTML = `
                <small>Данные автоматически сохраняются локально на устройстве</small><br>
                <small>Последнее сохранение: ${formattedDate}</small>
            `;
        }
    }
}

// Show data operation message
function showDataMessage(message, type) {
    const dataSection = document.querySelector('.settings-section:nth-child(2)'); // Data management section
    if (dataSection) {
        const existingMsg = dataSection.querySelector('.data-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const msg = document.createElement('div');
        msg.className = 'data-message';
        msg.textContent = message;
        
        const bgColor = type === 'success' ? 'var(--success-light)' : 'var(--danger-light)';
        const textColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
        
        msg.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            padding: 8px 12px;
            border-radius: 6px;
            margin-top: 12px;
            font-size: 0.9rem;
            text-align: center;
        `;
        
        dataSection.appendChild(msg);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        }, 3000);
    }
}

// Auto-save data periodically
function setupAutoSave() {
    // Save data every 30 seconds
    setInterval(() => {
        saveData();
    }, 30000);
    
    // Save data when page is about to unload
    window.addEventListener('beforeunload', () => {
        saveData();
    });
    
    // Save data when page becomes hidden (mobile app switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveData();
        }
    });
    
    // Save data when app loses focus (mobile)
    window.addEventListener('blur', () => {
        saveData();
    });
    
    console.log('Автосохранение настроено');
}

