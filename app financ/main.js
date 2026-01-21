// Переводы для трех языков
const translations = {
    ru: {
        appTitle: '💰 Финансовый Трекер',
        monthView: 'По месяцам',
        quarterView: 'По кварталам',
        today: 'Сегодня',
        income: 'Доходы',
        expense: 'Расходы',
        balance: 'Баланс',
        dateLabel: 'Дата',
        amountLabel: 'Сумма',
        descPlaceholder: 'Описание (например: Зарплата или Покупка продуктов)',
        amountPlaceholder: 'Сумма',
        addIncome: '➕ Доход',
        addExpense: '➖ Расход',
        history: 'История',
        transactions: 'История',
        assets: 'Активы',
        liabilities: 'Пассивы',
        clearAll: '🗑️ Очистить всё',
        noTransactionsMonth: 'Нет транзакций за этот месяц. Добавьте доход или расход!',
        noTransactionsQuarter: 'Нет транзакций за этот квартал. Добавьте доход или расход!',
        noTransactions: 'Нет транзакций. Добавьте доход или расход!',
        errorDescription: 'Пожалуйста, введите описание!',
        errorAmount: 'Пожалуйста, введите корректную сумму!',
        confirmDelete: 'Вы уверены? Все транзакции будут удалены безвозвратно!',
        noDeleteTransactions: 'Нет транзакций для удаления!',
        Q1: 'I квартал',
        Q2: 'II квартал',
        Q3: 'III квартал',
        Q4: 'IV квартал',
        assetsTitle: 'Активы',
        totalAssets: 'Всего активов:',
        assetNamePlaceholder: 'Название актива (например: Наличность)',
        addAsset: '➕ Добавить актив',
        withdrawAsset: 'Снять',
        deleteAsset: '✕',
        noAssets: 'Нет активов. Добавьте первый актив!',
        liabilitiesTitle: 'Пассивы',
        totalLiabilities: 'Всего обязательств:',
        liabilityNamePlaceholder: 'Название обязательства (например: Кредит)',
        ratePercentPlaceholder: '% годовых (опционально)',
        addLiability: '➕ Добавить обязательство',
        payLiability: 'Погасить',
        deleteLiability: '✕',
        noLiabilities: 'Нет обязательств.',
        monthEnd: '📅 Закончить месяц',
        monthEndSuccess: 'Месяц закончен! Кешфлоу переведен в активы как наличность.',
        withdrawSuccess: 'Сумма снята из активов и переведена в расходы',
        payLiabilitySuccess: 'Обязательство погашено',
        interestCharge: 'Начисленный процент'
    },
    uk: {
        appTitle: '💰 Фінансовий Трекер',
        monthView: 'По місяцях',
        quarterView: 'По кварталах',
        today: 'Сьогодні',
        income: 'Доходи',
        expense: 'Видатки',
        balance: 'Баланс',
        dateLabel: 'Дата',
        amountLabel: 'Сума',
        descPlaceholder: 'Опис (наприклад: Зарплата або Покупка продуктів)',
        amountPlaceholder: 'Сума',
        addIncome: '➕ Дохід',
        addExpense: '➖ Видаток',
        history: 'Історія',
        transactions: 'Історія',
        assets: 'Активи',
        liabilities: 'Пасиви',
        clearAll: '🗑️ Очистити все',
        noTransactionsMonth: 'Немає транзакцій за цей місяць. Додайте дохід або видаток!',
        noTransactionsQuarter: 'Немає транзакцій за цей квартал. Додайте дохід або видаток!',
        noTransactions: 'Немає транзакцій. Додайте дохід або видаток!',
        errorDescription: 'Будь ласка, введіть опис!',
        errorAmount: 'Будь ласка, введіть коректну суму!',
        confirmDelete: 'Ви впевнені? Усі транзакції будуть видалені безповоротно!',
        noDeleteTransactions: 'Немає транзакцій для видалення!',
        Q1: 'I квартал',
        Q2: 'II квартал',
        Q3: 'III квартал',
        Q4: 'IV квартал',
        assetsTitle: 'Активи',
        totalAssets: 'Всього активів:',
        assetNamePlaceholder: 'Назва активу (наприклад: Готівка)',
        addAsset: '➕ Додати актив',
        withdrawAsset: 'Зняти',
        deleteAsset: '✕',
        noAssets: 'Немає активів. Додайте перший актив!',
        liabilitiesTitle: 'Пасиви',
        totalLiabilities: 'Всього зобов\'язань:',
        liabilityNamePlaceholder: 'Назва зобов\'язання (наприклад: Кредит)',
        ratePercentPlaceholder: '% річних (опціонально)',
        addLiability: '➕ Додати зобов\'язання',
        payLiability: 'Погасити',
        deleteLiability: '✕',
        noLiabilities: 'Немає зобов\'язань.',
        monthEnd: '📅 Завершити місяць',
        monthEndSuccess: 'Місяць завершено! Кешфлоу переведено в активи як готівка.',
        withdrawSuccess: 'Суму знято з активів і переведено в видатки',
        payLiabilitySuccess: 'Зобов\'язання погашено',
        interestCharge: 'Нараховані відсотки'
    },
    en: {
        appTitle: '💰 Financial Tracker',
        monthView: 'By Months',
        quarterView: 'By Quarters',
        today: 'Today',
        income: 'Income',
        expense: 'Expenses',
        balance: 'Balance',
        dateLabel: 'Date',
        amountLabel: 'Amount',
        descPlaceholder: 'Description (e.g.: Salary or Groceries)',
        amountPlaceholder: 'Amount',
        addIncome: '➕ Income',
        addExpense: '➖ Expense',
        history: 'History',
        transactions: 'History',
        assets: 'Assets',
        liabilities: 'Liabilities',
        clearAll: '🗑️ Clear All',
        noTransactionsMonth: 'No transactions this month. Add income or expense!',
        noTransactionsQuarter: 'No transactions this quarter. Add income or expense!',
        noTransactions: 'No transactions. Add income or expense!',
        errorDescription: 'Please enter a description!',
        errorAmount: 'Please enter a valid amount!',
        confirmDelete: 'Are you sure? All transactions will be deleted permanently!',
        noDeleteTransactions: 'No transactions to delete!',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
        assetsTitle: 'Assets',
        totalAssets: 'Total Assets:',
        assetNamePlaceholder: 'Asset name (e.g.: Cash)',
        addAsset: '➕ Add Asset',
        withdrawAsset: 'Withdraw',
        deleteAsset: '✕',
        noAssets: 'No assets. Add your first asset!',
        liabilitiesTitle: 'Liabilities',
        totalLiabilities: 'Total Liabilities:',
        liabilityNamePlaceholder: 'Liability name (e.g.: Loan)',
        ratePercentPlaceholder: '% annual (optional)',
        addLiability: '➕ Add Liability',
        payLiability: 'Pay',
        deleteLiability: '✕',
        noLiabilities: 'No liabilities.',
        monthEnd: '📅 End Month',
        monthEndSuccess: 'Month ended! Cash flow transferred to assets as cash.',
        withdrawSuccess: 'Amount withdrawn from assets and moved to expenses',
        payLiabilitySuccess: 'Liability paid',
        interestCharge: 'Interest charged'
    }
};

// Текущий язык
let currentLanguage = localStorage.getItem('language') || 'ru';

// Функция для получения перевода
function t(key) {
    return translations[currentLanguage]?.[key] || translations['ru'][key];
}

// Получаем элементы DOM
const languageSelect = document.getElementById('languageSelect');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');
const monthInput = document.getElementById('monthInput');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayBtn = document.getElementById('todayBtn');
const monthViewBtn = document.getElementById('monthViewBtn');
const quarterViewBtn = document.getElementById('quarterViewBtn');
const monthSelector = document.getElementById('monthSelector');
const quarterSelector = document.getElementById('quarterSelector');
const quarterInput = document.getElementById('quarterInput');
const prevQuarterBtn = document.getElementById('prevQuarterBtn');
const nextQuarterBtn = document.getElementById('nextQuarterBtn');
const todayQuarterBtn = document.getElementById('todayQuarterBtn');

// Элементы для активов
const addAssetBtn = document.getElementById('addAssetBtn');
const assetNameInput = document.getElementById('assetName');
const assetAmountInput = document.getElementById('assetAmount');
const assetsList = document.getElementById('assetsList');
const totalAssetsAmount = document.getElementById('totalAssetsAmount');

// Элементы для пассивов
const addLiabilityBtn = document.getElementById('addLiabilityBtn');
const liabilityNameInput = document.getElementById('liabilityName');
const liabilityAmountInput = document.getElementById('liabilityAmount');
const liabilityRateInput = document.getElementById('liabilityRate');
const liabilitiesList = document.getElementById('liabilitiesList');
const totalLiabilitiesAmount = document.getElementById('totalLiabilitiesAmount');

// Кнопка для закрытия месяца
const monthEndBtn = document.getElementById('monthEndBtn');

// Элементы для модала подтверждения удаления
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Элементы для модала погашения пассива
const payLiabilityModal = document.getElementById('payLiabilityModal');
const payLiabilityTitle = document.getElementById('payLiabilityTitle');
const payLiabilityName = document.getElementById('payLiabilityName');
const payLiabilityAmount = document.getElementById('payLiabilityAmount');
const payLiabilityPaid = document.getElementById('payLiabilityPaid');
const payLiabilityRemaining = document.getElementById('payLiabilityRemaining');
const payLiabilityAmountInput = document.getElementById('payLiabilityAmountInput');
const confirmPayBtn = document.getElementById('confirmPayBtn');

// Инициализируем данные из localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let assets = JSON.parse(localStorage.getItem('assets')) || [];
let liabilities = JSON.parse(localStorage.getItem('liabilities')) || [];
let lastMonthEnd = JSON.parse(localStorage.getItem('lastMonthEnd')) || null;

// Переменные для хранения выбранного периода
let selectedMonth = getCurrentMonth();
let selectedQuarter = getCurrentQuarter();
let viewMode = 'month'; // 'month' или 'quarter'
let currentTab = 'transactions'; // текущая вкладка

// Функция получить текущий месяц в формате YYYY-MM
function getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Функция получить текущий квартал в формате YYYY-QX
function getCurrentQuarter() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
}

// Функция для преобразования месяца в квартал
function monthToQuarter(monthStr) {
    const [year, month] = monthStr.split('-');
    const quarter = Math.ceil(parseInt(month) / 3);
    return `${year}-Q${quarter}`;
}

// Функция для получения предыдущего квартала
function getPreviousQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    let newQuarter = parseInt(quarter) - 1;
    let newYear = parseInt(year);
    
    if (newQuarter === 0) {
        newQuarter = 4;
        newYear--;
    }
    
    return `${newYear}-Q${newQuarter}`;
}

// Функция для получения следующего квартала
function getNextQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    let newQuarter = parseInt(quarter) + 1;
    let newYear = parseInt(year);
    
    if (newQuarter === 5) {
        newQuarter = 1;
        newYear++;
    }
    
    return `${newYear}-Q${newQuarter}`;
}

// Функция для получения месяцев квартала
function getMonthsInQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    const q = parseInt(quarter);
    const startMonth = (q - 1) * 3 + 1;
    const months = [];
    
    for (let i = 0; i < 3; i++) {
        const month = startMonth + i;
        months.push(`${year}-${String(month).padStart(2, '0')}`);
    }
    
    return months;
}

// Функция для получения предыдущего месяца
function getPreviousMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    let newMonth = parseInt(month) - 1;
    let newYear = parseInt(year);
    
    if (newMonth === 0) {
        newMonth = 12;
        newYear--;
    }
    
    return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

// Функция для получения следующего месяца
function getNextMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    let newMonth = parseInt(month) + 1;
    let newYear = parseInt(year);
    
    if (newMonth === 13) {
        newMonth = 1;
        newYear++;
    }
    
    return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

// Функция для фильтрации транзакций по месяцу
function getTransactionsByMonth(month) {
    return transactions.filter(t => {
        const transactionDate = new Date(t.fullDate);
        const transactionMonth = transactionDate.getFullYear() + '-' + 
                                String(transactionDate.getMonth() + 1).padStart(2, '0');
        return transactionMonth === month;
    });
}

// Функция для фильтрации транзакций по кварталу
function getTransactionsByQuarter(quarter) {
    const months = getMonthsInQuarter(quarter);
    return transactions.filter(t => {
        const transactionDate = new Date(t.fullDate);
        const transactionMonth = transactionDate.getFullYear() + '-' + 
                                String(transactionDate.getMonth() + 1).padStart(2, '0');
        return months.includes(transactionMonth);
    });
}

// Функция для обновления month input
function updateMonthInput() {
    monthInput.value = selectedMonth;
}

// Функция для обновления quarter input
function updateQuarterInput() {
    quarterInput.value = selectedQuarter;
}

// Функция для обновления отображения текущей даты
function updateCurrentDateDisplay() {
    const dateElement = document.getElementById('dateText');
    if (!dateElement) return;
    
    // Берем дату из input поля или текущую дату
    let displayDate;
    if (transactionDateInput && transactionDateInput.value) {
        displayDate = new Date(transactionDateInput.value);
    } else {
        displayDate = new Date();
    }
    
    // Массивы названий дней недели и месяцев на русском
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const dayOfWeek = daysOfWeek[displayDate.getDay()];
    const day = displayDate.getDate();
    const month = months[displayDate.getMonth()];
    const year = displayDate.getFullYear();
    
    const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
    dateElement.textContent = formattedDate;
}


// Функция для обновления date input при смене месяца
function updateDateInput() {
    let year, month;
    
    if (viewMode === 'month') {
        [year, month] = selectedMonth.split('-');
    } else {
        // При режиме квартала берем первый месяц квартала
        const months = getMonthsInQuarter(selectedQuarter);
        [year, month] = months[0].split('-');
    }
    
    // Устанавливаем текущую дату по умолчанию
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayDate = `${todayYear}-${todayMonth}-${todayDay}`;
    
    transactionDateInput.value = todayDate;
    updateCurrentDateDisplay();
    // Устанавливаем min и max на основе режима
    if (viewMode === 'month') {
        transactionDateInput.min = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        transactionDateInput.max = `${year}-${month}-${lastDay}`;
    } else {
        // При режиме квартала - от первого дня первого месяца до последнего дня последнего месяца квартала
        const monthsInQuarter = getMonthsInQuarter(selectedQuarter);
        const [startYear, startMonth] = monthsInQuarter[0].split('-');
        const [endYear, endMonth] = monthsInQuarter[2].split('-');
        transactionDateInput.min = `${startYear}-${startMonth}-01`;
        const lastDay = new Date(parseInt(endYear), parseInt(endMonth), 0).getDate();
        transactionDateInput.max = `${endYear}-${endMonth}-${lastDay}`;
    }
}

// Функция для удаления транзакции
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

// Функция для сохранения транзакций
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Функция для обновления интерфейса
function updateUI() {
    // Получаем транзакции в зависимости от режима просмотра
    let displayTransactions;
    let emptyMessage;
    
    if (viewMode === 'month') {
        displayTransactions = getTransactionsByMonth(selectedMonth);
        emptyMessage = t('noTransactionsMonth');
    } else {
        displayTransactions = getTransactionsByQuarter(selectedQuarter);
        emptyMessage = t('noTransactionsQuarter');
    }
    
    // Расчёты
    const totalIncome = displayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = displayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;

    // Обновляем суммы
    totalIncomeEl.textContent = totalIncome.toFixed(2) + ' $';
    totalExpenseEl.textContent = totalExpense.toFixed(2) + ' $';
    totalBalanceEl.textContent = balance.toFixed(2) + ' $';

    // Обновляем цвет баланса
    if (balance >= 0) {
        totalBalanceEl.style.color = '#27ae60';
    } else {
        totalBalanceEl.style.color = '#e74c3c';
    }

    // Обновляем список доходов
    const incomeList = displayTransactions.filter(t => t.type === 'income');
    const incomeListEl = document.getElementById('incomeList');
    if (incomeList.length === 0) {
        incomeListEl.innerHTML = `<p class="empty-message">Нет доходов</p>`;
    } else {
        incomeListEl.innerHTML = incomeList.map(t => `
            <div class="transaction-item ${t.type}">
                <div class="transaction-info">
                    <p class="description">${t.description}</p>
                    <p class="date">${t.date}</p>
                </div>
                <div class="transaction-amount">
                    <span class="amount ${t.type}">+${t.amount.toFixed(2)} $</span>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteTransaction(${t.id})">✕</button>
                </div>
            </div>
        `).join('');
    }

    // Обновляем список расходов
    const expenseList = displayTransactions.filter(t => t.type === 'expense');
    const expenseListEl = document.getElementById('expenseList');
    if (expenseList.length === 0) {
        expenseListEl.innerHTML = `<p class="empty-message">Нет расходов</p>`;
    } else {
        expenseListEl.innerHTML = expenseList.map(t => `
            <div class="transaction-item ${t.type}">
                <div class="transaction-info">
                    <p class="description">${t.description}</p>
                    <p class="date">${t.date}</p>
                </div>
                <div class="transaction-amount">
                    <span class="amount ${t.type}">-${t.amount.toFixed(2)} $</span>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteTransaction(${t.id})">✕</button>
                </div>
            </div>
        `).join('');
    }
}

// Функция для очистки всех данных
function clearAllTransactions() {
    if (transactions.length === 0) {
        alert(t('noDeleteTransactions'));
        return;
    }

    if (confirm(t('confirmDelete'))) {
        transactions = [];
        saveTransactions();
        updateUI();
    }
}

// Функция для переключения режима просмотра
function switchViewMode(newMode) {
    viewMode = newMode;
    
    if (newMode === 'month') {
        monthViewBtn.classList.add('active');
        quarterViewBtn.classList.remove('active');
        monthSelector.style.display = 'flex';
        quarterSelector.style.display = 'none';
        updateMonthInput();
        updateDateInput();
    } else {
        monthViewBtn.classList.remove('active');
        quarterViewBtn.classList.add('active');
        monthSelector.style.display = 'none';
        quarterSelector.style.display = 'flex';
        // Обновляем квартал на основе текущего месяца
        selectedQuarter = monthToQuarter(selectedMonth);
        updateQuarterInput();
        updateDateInput();
    }
    
    updateUI();
}

// Обработчики переключения режимов
monthViewBtn.addEventListener('click', () => switchViewMode('month'));
quarterViewBtn.addEventListener('click', () => switchViewMode('quarter'));

// Обработчики событий для навигации по месяцам
prevMonthBtn.addEventListener('click', () => {
    selectedMonth = getPreviousMonth(selectedMonth);
    updateMonthInput();
    updateDateInput();
    updateUI();
});

nextMonthBtn.addEventListener('click', () => {
    selectedMonth = getNextMonth(selectedMonth);
    updateMonthInput();
    updateDateInput();
    updateUI();
});

todayBtn.addEventListener('click', () => {
    selectedMonth = getCurrentMonth();
    updateMonthInput();
    updateDateInput();
    updateUI();
});

monthInput.addEventListener('change', (e) => {
    if (e.target.value) {
        selectedMonth = e.target.value;
        updateDateInput();
        updateUI();
    }
});

// Обработчики событий для навигации по кварталам
prevQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getPreviousQuarter(selectedQuarter);
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

nextQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getNextQuarter(selectedQuarter);
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

todayQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getCurrentQuarter();
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

quarterInput.addEventListener('change', (e) => {
    if (e.target.value) {
        selectedQuarter = e.target.value;
        // Обновляем selectedMonth на первый месяц квартала для синхронизации
        const months = getMonthsInQuarter(selectedQuarter);
        selectedMonth = months[0];
        updateDateInput();
        updateUI();
    }
});

// Обработчик смены языка
languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
});

// Функция для обновления всех текстов на странице
function updateLanguage() {
    // Обновляем элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.hasAttribute('data-placeholder')) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Обновляем опции квартала
    updateQuarterOptions();

    // Обновляем UI
    updateUI();
}

// Функция для обновления опций квартала
function updateQuarterOptions() {
    const year = new Date().getFullYear();
    const options = [
        `${year}-Q1|${year} - ${t('Q1')}`,
        `${year}-Q2|${year} - ${t('Q2')}`,
        `${year}-Q3|${year} - ${t('Q3')}`,
        `${year}-Q4|${year} - ${t('Q4')}`
    ];

    quarterInput.innerHTML = options.map(opt => {
        const [value, label] = opt.split('|');
        return `<option value="${value}">${label}</option>`;
    }).join('');

    // Восстанавливаем выбранное значение
    quarterInput.value = selectedQuarter;
}

// ===========================
// ФУНКЦИИ ДЛЯ АКТИВОВ
// ===========================

// Добавить актив
// Снять деньги из актива (переводит в расходы)
function withdrawFromAsset(assetId, amount) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (amount > asset.amount) {
        alert('Недостаточно средств в активе!');
        return;
    }

    // Снимаем из актива
    asset.amount -= amount;
    if (asset.amount < 0.01) {
        assets = assets.filter(a => a.id !== assetId);
    }

    // Определяем формат даты по языку
    const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

    // Добавляем расход в транзакции
    const transaction = {
        id: Date.now(),
        type: 'expense',
        description: `Снятие из актива "${asset.name}"`,
        amount: amount,
        date: new Date().toLocaleString(dateLocale),
        fullDate: new Date().toISOString()
    };

    transactions.unshift(transaction);
    saveAssets();
    saveTransactions();
    updateAssetsUI();
    updateUI();
    alert(t('withdrawSuccess'));
}

// Удалить актив
// Переменные для модала удаления
// Переменная для хранения ID пассива при погашении
let payLiabilityContextId = null;

// Показать модал погашения пассива
function showPayLiabilityModal(liabilityId) {
    const liability = liabilities.find(l => l.id === liabilityId);
    if (!liability) return;
    
    payLiabilityContextId = liabilityId;
    const remaining = liability.amount - liability.paidAmount;
    
    payLiabilityName.textContent = liability.name;
    payLiabilityAmount.textContent = `${liability.amount.toFixed(2)} $`;
    payLiabilityPaid.textContent = `${liability.paidAmount.toFixed(2)} $`;
    payLiabilityRemaining.textContent = `${remaining.toFixed(2)} $`;
    payLiabilityAmountInput.value = '';
    payLiabilityAmountInput.max = remaining;
    payLiabilityAmountInput.placeholder = `Макс: ${remaining.toFixed(2)} $`;
    
    payLiabilityModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    payLiabilityAmountInput.focus();
}

// Закрыть модал погашения
function closePayLiabilityModal() {
    payLiabilityModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    payLiabilityContextId = null;
    payLiabilityAmountInput.value = '';
}

// Подтвердить погашение
function confirmPayLiability() {
    if (!payLiabilityContextId) return;
    
    const amount = parseFloat(payLiabilityAmountInput.value);
    const liability = liabilities.find(l => l.id === payLiabilityContextId);
    
    if (!liability) return;
    
    const remaining = liability.amount - liability.paidAmount;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Введите корректную сумму!');
        return;
    }
    
    if (amount > remaining) {
        alert(`Сумма не может быть больше остатка (${remaining.toFixed(2)} $)!`);
        return;
    }
    
    // Обновляем пассив
    liability.paidAmount += amount;
    
    // Определяем формат даты по языку
    const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';
    
    // Добавляем расход в транзакции
    const transaction = {
        id: Date.now(),
        type: 'expense',
        description: `Погашение обязательства "${liability.name}"`,
        amount: amount,
        date: new Date().toLocaleString(dateLocale),
        fullDate: new Date().toISOString()
    };
    
    transactions.unshift(transaction);
    
    // Если полностью погашено, удаляем пассив
    if (liability.paidAmount >= liability.amount) {
        liabilities = liabilities.filter(l => l.id !== payLiabilityContextId);
    }
    
    saveLiabilities();
    saveTransactions();
    updateLiabilitiesUI();
    updateUI();
    
    closePayLiabilityModal();
}

let deleteConfirmCallback = null;

// Показать модал подтверждения удаления
function showDeleteConfirm(message, callback) {
    alert('showDeleteConfirm вызвана!'); // ВРЕМЕННО - для проверки
    const modal = document.getElementById('deleteConfirmModal');
    const messageEl = document.getElementById('deleteConfirmMessage');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    alert('modal=' + (modal ? 'найден' : 'не найден') + ', messageEl=' + (messageEl ? 'найден' : 'не найден') + ', confirmBtn=' + (confirmBtn ? 'найден' : 'не найден')); // ВРЕМЕННО
    
    if (!modal || !messageEl || !confirmBtn) {
        alert('ОШИБКА: Элементы модали не найдены!');
        return;
    }
    
    try {
        messageEl.innerHTML = message;
        alert('innerHTML установлен!'); // ВРЕМЕННО
    } catch(e) {
        alert('ОШИБКА при установке innerHTML: ' + e.message);
    }
    
    try {
        deleteConfirmCallback = callback;
        alert('callback установлен!'); // ВРЕМЕННО
    } catch(e) {
        alert('ОШИБКА при установке callback: ' + e.message);
    }
    
    // Обновляем обработчик кнопки подтверждения
    try {
        confirmBtn.onclick = () => {
            if (deleteConfirmCallback) {
                deleteConfirmCallback();
            }
        };
        alert('onclick установлен!'); // ВРЕМЕННО
    } catch(e) {
        alert('ОШИБКА при установке onclick: ' + e.message);
    }
    
    try {
        modal.classList.add('active');
        alert('Класс active добавлен!'); // ВРЕМЕННО
    } catch(e) {
        alert('ОШИБКА при добавлении класса: ' + e.message);
    }
    
    document.body.style.overflow = 'hidden';
    alert('Модаль отображена!'); // ВРЕМЕННО
}

// Закрыть модал подтверждения
function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    deleteConfirmCallback = null;
}

function deleteAsset(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) {
        alert('Актив не найден!');
        return;
    }
    
    showDeleteConfirm(
        `Удалить актив: <strong>${asset.name}</strong>?`,
        () => {
            assets = assets.filter(a => a.id !== assetId);
            saveAssets();
            updateAssetsUI();
            closeDeleteConfirm();
        }
    );
}

// Сохранить активы
function saveAssets() {
    localStorage.setItem('assets', JSON.stringify(assets));
}

// Обновить UI активов
function updateAssetsUI() {
    const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
    totalAssetsAmount.textContent = totalAssets.toFixed(2) + ' $';

    if (assets.length === 0) {
        assetsList.innerHTML = `<p class="empty-message">${t('noAssets')}</p>`;
        return;
    }

    assetsList.innerHTML = assets.map(asset => `
        <div class="asset-item">
            <div class="asset-info">
                <p class="asset-name">${asset.name}</p>
                <p class="asset-amount">${asset.amount.toFixed(2)} $</p>
                ${asset.annualRate > 0 ? `<p class="asset-rate">${asset.annualRate.toFixed(2)}% годовых</p>` : ''}
            </div>
            <div class="asset-actions">
                <button class="asset-btn" onclick="showWithdrawDialog(${asset.id}, ${asset.amount})">
                    🔽 Снять
                </button>
                <button class="asset-btn delete" onclick="deleteAsset(${asset.id})">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
}

// Диалог для снятия денег
function showWithdrawDialog(assetId, availableAmount) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const amount = prompt(`Сколько снять из "${asset.name}"? (Доступно: ${asset.amount.toFixed(2)} $)`);
    if (amount !== null && amount !== '') {
        const withdrawAmount = parseFloat(amount);
        if (withdrawAmount > 0 && withdrawAmount <= asset.amount) {
            withdrawFromAsset(assetId, withdrawAmount);
        } else {
            alert('Неверная сумма!');
        }
    }
}

// ===========================
// ФУНКЦИИ ДЛЯ ПАССИВОВ
// ===========================

// Погасить пассив
function payLiability(liabilityId) {
    showPayLiabilityModal(liabilityId);
}

// Удалить пассив
function deleteLiability(liabilityId) {
    const liability = liabilities.find(l => l.id === liabilityId);
    if (!liability) return;
    
    showDeleteConfirm(
        `Удалить пассив: <strong>${liability.name}</strong>?`,
        () => {
            liabilities = liabilities.filter(l => l.id !== liabilityId);
            saveLiabilities();
            updateLiabilitiesUI();
            closeDeleteConfirm();
        }
    );
}

// Сохранить пассивы
function saveLiabilities() {
    localStorage.setItem('liabilities', JSON.stringify(liabilities));
}

// Обновить UI пассивов
function updateLiabilitiesUI() {
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.amount - l.paidAmount), 0);
    totalLiabilitiesAmount.textContent = totalLiabilities.toFixed(2) + ' $';

    if (liabilities.length === 0) {
        liabilitiesList.innerHTML = `<p class="empty-message">${t('noLiabilities')}</p>`;
        return;
    }

    liabilitiesList.innerHTML = liabilities.map(liability => {
        const remaining = liability.amount - liability.paidAmount;
        const monthlyInterest = (liability.amount * liability.annualRate) / 12 / 100;
        
        return `
            <div class="liability-item">
                <div class="liability-info">
                    <p class="liability-name">${liability.name}</p>
                    <p class="liability-rate">
                        Основная сумма: ${liability.amount.toFixed(2)} $ | 
                        Погашено: ${liability.paidAmount.toFixed(2)} $ 
                        ${liability.annualRate > 0 ? `| ${liability.annualRate.toFixed(2)}% годовых` : ''}
                    </p>
                </div>
                <div class="liability-actions">
                    <p class="liability-amount">${remaining.toFixed(2)} $</p>
                    <button class="liability-btn pay" onclick="payLiability(${liability.id})">
                        💰 Погасить
                    </button>
                    <button class="liability-btn" onclick="deleteLiability(${liability.id})">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===========================
// ФУНКЦИЯ ДЛЯ ЗАКРЫТИЯ МЕСЯЦА
// ===========================

// Закрыть месяц (кешфлоу переходит в активы)
function endMonth() {
    console.log('endMonth вызвана'); // Для отладки
    
    const displayTransactions = viewMode === 'month' 
        ? getTransactionsByMonth(selectedMonth)
        : getTransactionsByQuarter(selectedQuarter);

    // Расчитываем кешфлоу (разница между доходами и расходами)
    const totalIncome = displayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = displayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const cashFlow = totalIncome - totalExpense;

    // Если кешфлоу положительный, добавляем в активы как наличность
    if (cashFlow > 0) {
        const cashAsset = assets.find(a => a.name === 'Наличность');
        
        if (cashAsset) {
            cashAsset.amount += cashFlow;
        } else {
            const newAsset = {
                id: Date.now(),
                name: 'Наличность',
                amount: cashFlow,
                createdDate: new Date().toISOString()
            };
            assets.push(newAsset);
        }
        
        alert(`${t('monthEndSuccess')} Кешфлоу: +${cashFlow.toFixed(2)} $`);
    } else if (cashFlow < 0) {
        alert(`Месяц закончен с убытком: ${Math.abs(cashFlow).toFixed(2)} $`);
    } else {
        alert(`Месяц закончен. Кешфлоу: 0 $`);
    }

    // Добавляем проценты на пассивы
    liabilities.forEach(liability => {
        if (liability.annualRate > 0 && liability.paidAmount < liability.amount) {
            const monthlyRate = liability.annualRate / 12 / 100;
            const remaining = liability.amount - liability.paidAmount;
            const interest = remaining * monthlyRate;

            // Определяем формат даты по языку
            const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

            // Добавляем процент как расход
            const transaction = {
                id: Date.now() + Math.random(),
                type: 'expense',
                description: `Начисление процентов: ${liability.name}`,
                amount: interest,
                date: new Date().toLocaleString(dateLocale),
                fullDate: new Date().toISOString()
            };
            transactions.push(transaction);
            
            // Увеличиваем основную сумму пассива на величину процентов
            liability.amount += interest;
        }
    });

    // Добавляем проценты на активы
    assets.forEach(asset => {
        if (asset.annualRate > 0) {
            const monthlyRate = asset.annualRate / 12 / 100;
            const interest = asset.amount * monthlyRate;

            // Определяем формат даты по языку
            const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

            // Добавляем процент как доход
            const transaction = {
                id: Date.now() + Math.random(),
                type: 'income',
                description: `Процент от актива: ${asset.name}`,
                amount: interest,
                date: new Date().toLocaleString(dateLocale),
                fullDate: new Date().toISOString()
            };
            transactions.push(transaction);
            
            // Увеличиваем сумму актива на величину процентов
            asset.amount += interest;
        }
    });

    saveAssets();
    saveLiabilities();
    saveTransactions();
    updateAssetsUI();
    updateLiabilitiesUI();
    updateUI();
}

// ===========================
// ФУНКЦИИ ДЛЯ ВКЛАДОК
// ===========================

// Переключение между вкладками
function switchTab(tab) {
    currentTab = tab;
    
    // Скрываем все разделы
    const transactionsSection = document.getElementById('transactionsSection');
    const assetsSection = document.getElementById('assetsSection');
    const liabilitiesSection = document.getElementById('liabilitiesSection');
    
    if (transactionsSection) transactionsSection.classList.add('hidden-tab');
    if (assetsSection) assetsSection.classList.add('hidden-tab');
    if (liabilitiesSection) liabilitiesSection.classList.add('hidden-tab');
    
    // Показываем выбранный раздел
    if (tab === 'transactions' && transactionsSection) {
        transactionsSection.classList.remove('hidden-tab');
    } else if (tab === 'assets' && assetsSection) {
        assetsSection.classList.remove('hidden-tab');
    } else if (tab === 'liabilities' && liabilitiesSection) {
        liabilitiesSection.classList.remove('hidden-tab');
    }

    // Обновляем активную кнопку
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
}
// Инициализация при загрузке страницы
languageSelect.value = currentLanguage;
updateMonthInput();
updateDateInput();
updateLanguage();
updateCurrentDateDisplay();

// Обработчик для закрытия месяца
monthEndBtn.addEventListener('click', endMonth);

// Обработчики для переключения вкладок
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        switchTab(e.target.getAttribute('data-tab'));
    });
});

// Инициализируем UI активов и пассивов
updateAssetsUI();
updateLiabilitiesUI();

// Инициализируем UI транзакций
updateUI();

// ===========================
// ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН
// ===========================

// Функция для открытия модального окна доходов
function openIncomeModal() {
    const modal = document.getElementById('incomeModal');
    modal.classList.add('active');
    
    // Устанавливаем текущую дату по умолчанию
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('incomeDate').value = todayStr;
    
    // Фокус на первое поле
    document.getElementById('incomeType').focus();
}

// Функция для закрытия модального окна доходов
function closeIncomeModal() {
    const modal = document.getElementById('incomeModal');
    modal.classList.remove('active');
    // Очищаем форму
    document.getElementById('incomeType').value = 'salary';
    document.getElementById('incomeDescription').value = '';
    document.getElementById('incomeAmount').value = '';
}

// Функция для открытия модального окна расходов
function openExpenseModal() {
    const modal = document.getElementById('expenseModal');
    modal.classList.add('active');
    
    // Устанавливаем текущую дату по умолчанию
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('expenseDate').value = todayStr;
    
    // Фокус на первое поле
    document.getElementById('expenseType').focus();
}

// Функция для закрытия модального окна расходов
function closeExpenseModal() {
    const modal = document.getElementById('expenseModal');
    modal.classList.remove('active');
    // Очищаем форму
    document.getElementById('expenseType').value = 'food';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
}

// Функция для открытия модального окна активов
function openAssetModal() {
    const modal = document.getElementById('assetModal');
    modal.classList.add('active');
    document.getElementById('assetName').focus();
}

// Функция для закрытия модального окна активов
function closeAssetModal() {
    const modal = document.getElementById('assetModal');
    modal.classList.remove('active');
    // Очищаем форму
    document.getElementById('assetName').value = '';
    document.getElementById('assetAmount').value = '';
    document.getElementById('assetRate').value = '';
}

// Функция для открытия модального окна пассивов
function openLiabilityModal() {
    const modal = document.getElementById('liabilityModal');
    modal.classList.add('active');
    document.getElementById('liabilityName').focus();
}

// Функция для закрытия модального окна пассивов
function closeLiabilityModal() {
    const modal = document.getElementById('liabilityModal');
    modal.classList.remove('active');
    // Очищаем форму
    document.getElementById('liabilityName').value = '';
    document.getElementById('liabilityAmount').value = '';
    document.getElementById('liabilityRate').value = '';
}

// Функция для добавления дохода из модального окна
function addIncomeTransaction() {
    const type = document.getElementById('incomeType').value;
    const description = document.getElementById('incomeDescription').value.trim() || type;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const dateStr = document.getElementById('incomeDate').value;

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму!');
        return;
    }

    if (!dateStr) {
        alert('Пожалуйста, выберите дату!');
        return;
    }

    const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

    const transaction = {
        id: Date.now(),
        type: 'income',
        description: description,
        amount: amount,
        date: new Date(dateStr + 'T00:00:00').toLocaleString(dateLocale),
        fullDate: new Date(dateStr + 'T00:00:00').toISOString()
    };

    transactions.unshift(transaction);
    saveTransactions();
    closeIncomeModal();
    updateUI();
}

// Функция для добавления расхода из модального окна
function addExpenseTransaction() {
    const type = document.getElementById('expenseType').value;
    const description = document.getElementById('expenseDescription').value.trim() || type;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const dateStr = document.getElementById('expenseDate').value;

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму!');
        return;
    }

    if (!dateStr) {
        alert('Пожалуйста, выберите дату!');
        return;
    }

    const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

    const transaction = {
        id: Date.now(),
        type: 'expense',
        description: description,
        amount: amount,
        date: new Date(dateStr + 'T00:00:00').toLocaleString(dateLocale),
        fullDate: new Date(dateStr + 'T00:00:00').toISOString()
    };

    transactions.unshift(transaction);
    saveTransactions();
    closeExpenseModal();
    updateUI();
}

// Функция для добавления актива из модального окна
function addAssetTransaction() {
    const name = document.getElementById('assetName').value.trim();
    const amount = parseFloat(document.getElementById('assetAmount').value);
    const rate = parseFloat(document.getElementById('assetRate').value) || 0;

    if (!name) {
        alert('Пожалуйста, введите название актива!');
        document.getElementById('assetName').focus();
        return;
    }

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму!');
        document.getElementById('assetAmount').focus();
        return;
    }

    // Проверяем, существует ли уже актив с таким названием
    const existingAsset = assets.find(a => a.name.toLowerCase() === name.toLowerCase());
    
    if (existingAsset) {
        // Если актив существует, добавляем к нему сумму
        existingAsset.amount += amount;
        // Если введён процент, обновляем его (берём новый или оставляем старый)
        if (rate > 0) {
            existingAsset.annualRate = rate;
        }
    } else {
        // Если нового актива нет, создаём новый
        const asset = {
            id: Date.now(),
            name: name,
            amount: amount,
            annualRate: rate,
            createdDate: new Date().toISOString()
        };
        assets.push(asset);
    }

    saveAssets();
    closeAssetModal();
    updateAssetsUI();
}

// Функция для добавления пассива из модального окна
function addLiabilityTransaction() {
    const name = document.getElementById('liabilityName').value.trim();
    const amount = parseFloat(document.getElementById('liabilityAmount').value);
    const rate = parseFloat(document.getElementById('liabilityRate').value) || 0;

    if (!name) {
        alert('Пожалуйста, введите название обязательства!');
        document.getElementById('liabilityName').focus();
        return;
    }

    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму!');
        document.getElementById('liabilityAmount').focus();
        return;
    }

    const liability = {
        id: Date.now(),
        name: name,
        amount: amount,
        annualRate: rate,
        createdDate: new Date().toISOString(),
        paidAmount: 0
    };

    liabilities.push(liability);
    saveLiabilities();
    closeLiabilityModal();
    updateLiabilitiesUI();
}

// Закрытие модального окна при клике на backdrop
document.addEventListener('click', (e) => {
    const incomeModal = document.getElementById('incomeModal');
    const expenseModal = document.getElementById('expenseModal');
    const assetModal = document.getElementById('assetModal');
    const liabilityModal = document.getElementById('liabilityModal');
    
    if (e.target.id === 'incomeModal' && incomeModal.classList.contains('active')) {
        closeIncomeModal();
    }
    if (e.target.id === 'expenseModal' && expenseModal.classList.contains('active')) {
        closeExpenseModal();
    }
    if (e.target.id === 'assetModal' && assetModal.classList.contains('active')) {
        closeAssetModal();
    }
    if (e.target.id === 'liabilityModal' && liabilityModal.classList.contains('active')) {
        closeLiabilityModal();
    }
});

// Закрытие модального окна на Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeIncomeModal();
        closeExpenseModal();
        closeAssetModal();
        closeLiabilityModal();
        closeDeleteConfirm();
        closePayLiabilityModal();
    }
});

// Закрыть модал подтверждения при клике на backdrop
document.addEventListener('click', (e) => {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const backdrop = deleteModal?.querySelector('.modal-backdrop');
    
    if (deleteModal && deleteModal.classList.contains('active') && e.target === backdrop) {
        closeDeleteConfirm();
    }
});

// Обработчик для кнопки подтверждения удаления
confirmDeleteBtn?.addEventListener('click', () => {
    if (deleteConfirmCallback) {
        deleteConfirmCallback();
    }
});

// Обработчик для кнопки подтверждения погашения
confirmPayBtn?.addEventListener('click', confirmPayLiability);

// Обработчик для Enter в поле ввода суммы погашения
payLiabilityAmountInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmPayLiability();
    }
});

// Закрыть модал погашения при клике на backdrop
document.addEventListener('click', (e) => {
    const payModal = document.getElementById('payLiabilityModal');
    const backdrop = payModal?.querySelector('.modal-backdrop');
    
    if (payModal && payModal.classList.contains('active') && e.target === backdrop) {
        closePayLiabilityModal();
    }
});
