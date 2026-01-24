// Google Authentication and Cloud Sync

// TODO: Настройте Google Cloud Console и вставьте ваши ключи
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; 
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

// Временно отключаем Google Auth пока не настроены ключи
let googleAuthEnabled = false;

// Check if Google Auth is properly configured
function isGoogleAuthConfigured() {
    return GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && 
           GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE';
}

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize Google APIs
function initializeGoogleAuth() {
    if (!isGoogleAuthConfigured()) {
        console.log('Google Auth не настроен. Следуйте инструкциям в GOOGLE_SETUP.md');
        return;
    }
    
    googleAuthEnabled = true;
    
    // Load GAPI client
    gapi.load('client', initializeGapiClient);
    
    // Load GIS client
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn
    });
    
    gisInited = true;
}

function initializeGapiClient() {
    gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
    }).then(() => {
        gapiInited = true;
        console.log('Google API initialized');
        
        // Check if user is already signed in
        checkExistingAuth();
    }).catch(err => {
        console.error('Error initializing Google API:', err);
    });
}

// Handle Google Sign-In
function handleGoogleSignIn(response) {
    if (response.credential) {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        const userEmail = payload.email;
        const userName = payload.name || userEmail;
        const userPicture = payload.picture;
        
        // Store user info
        localStorage.setItem('google_token', response.credential);
        localStorage.setItem('user_email', userEmail);
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_picture', userPicture);
        
        // Initialize GAPI with the token
        gapi.client.setToken({ access_token: response.credential });
        
        // Show personalized success message
        showSyncNotification(`✅ Добро пожаловать, ${userName}!`, 'success');
        
        // Start cloud sync
        startCloudSync();
        
        // Update UI
        updateAuthUI(true);
        showUserInfo();
    }
}

// Check for existing authentication
function checkExistingAuth() {
    const token = localStorage.getItem('google_token');
    if (token) {
        gapi.client.setToken({ access_token: token });
        updateAuthUI(true);
        showUserInfo();
        startCloudSync();
    }
}

// Sign out from Google
function signOutFromGoogle() {
    const token = localStorage.getItem('google_token');
    if (token) {
        google.accounts.id.revoke(token, () => {
            localStorage.removeItem('google_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_picture');
            gapi.client.setToken(null);
            updateAuthUI(false);
            hideUserInfo();
            showSyncNotification('🔒 Вы вышли из аккаунта', 'info');
        });
    }
}

// Update UI based on auth state
function updateAuthUI(isSignedIn) {
    const authButton = document.getElementById('googleAuthBtn');
    if (authButton) {
        if (isSignedIn) {
            authButton.innerHTML = '🔒 Выйти';
            authButton.className = 'btn btn-secondary';
            authButton.onclick = signOutFromGoogle;
        } else {
            authButton.innerHTML = '🔗 Войти через Google';
            authButton.className = 'btn btn-primary';
            authButton.onclick = () => {
                if (!isGoogleAuthConfigured()) {
                    alert('Чтобы включить синхронизацию с Google:\n\n1. Откройте файл GOOGLE_SETUP.md\n2. Создайте проект в Google Cloud Console\n3. Получите Client ID и API ключ\n4. Вставьте их в google-auth.js');
                } else {
                    google.accounts.id.prompt();
                }
            };
        }
    }
}

// Show user information
function showUserInfo() {
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    const userPicture = localStorage.getItem('user_picture');
    
    // Remove existing user info if any
    hideUserInfo();
    
    if (userName && userEmail) {
        const headerLeft = document.querySelector('.header-left');
        if (headerLeft) {
            const userInfo = document.createElement('div');
            userInfo.id = 'userInfo';
            userInfo.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
                padding: 8px 12px;
                background: rgba(76, 175, 80, 0.1);
                border-radius: 20px;
                font-size: 0.85rem;
            `;
            
            const picture = userPicture ? 
                `<img src="${userPicture}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">` :
                `<div style="width: 24px; height: 24px; border-radius: 50%; background: #4caf50; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">${userName.charAt(0).toUpperCase()}</div>`;
            
            userInfo.innerHTML = `
                ${picture}
                <div>
                    <div style="font-weight: 600; color: var(--dark);">${userName}</div>
                    <div style="color: var(--gray); font-size: 0.75rem;">${userEmail}</div>
                </div>
            `;
            
            headerLeft.appendChild(userInfo);
        }
    }
}

// Hide user information
function hideUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.remove();
    }
}

// Cloud Sync Functions
const CLOUD_FILE_NAME = 'cashflow-data.json';

async function startCloudSync() {
    try {
        // Ensure user folder exists
        const folderId = await ensureUserCloudFolder();
        
        // Try to load existing data from cloud
        await loadFromCloud();
        
        // Set up periodic sync
        setInterval(syncToCloud, 5 * 60 * 1000); // Every 5 minutes
        
        // Auto-sync on data changes
        const originalSaveData = window.saveData;
        window.saveData = function() {
            originalSaveData.call(this);
            setTimeout(syncToCloud, 1000); // Sync after 1 second
        };
        
    } catch (error) {
        console.error('Error starting cloud sync:', error);
        showSyncNotification('❌ Ошибка синхронизации', 'error');
    }
}

async function ensureUserCloudFolder() {
    try {
        const userEmail = localStorage.getItem('user_email');
        if (!userEmail) {
            throw new Error('User not authenticated');
        }
        
        // Create user-specific folder name (safe for Google Drive)
        const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
        const userFolderName = `Cashflow_${safeEmail}`;
        
        // Search for existing user folder
        const response = await gapi.client.drive.files.list({
            q: `name='${userFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)'
        });
        
        if (response.result.files.length > 0) {
            return response.result.files[0].id;
        }
        
        // Create new user folder
        const folderResponse = await gapi.client.drive.files.create({
            resource: {
                name: userFolderName,
                mimeType: 'application/vnd.google-apps.folder',
                description: `Данные финансового трекера для ${userEmail}`
            }
        });
        
        return folderResponse.result.id;
    } catch (error) {
        console.error('Error ensuring user cloud folder:', error);
        throw error;
    }
}

async function syncToCloud() {
    try {
        const token = localStorage.getItem('google_token');
        if (!token) return;
        
        // Get current data
        const data = {
            transactions: transactions,
            assets: assets,
            liabilities: liabilities,
            assetUsageCount: assetUsageCount,
            liabilityUsageCount: liabilityUsageCount,
            lastSync: new Date().toISOString(),
            version: '1.0',
            userEmail: localStorage.getItem('user_email')
        };
        
        // Search for existing file in user folder
        const folderId = await ensureUserCloudFolder();
        const searchResponse = await gapi.client.drive.files.list({
            q: `name='${CLOUD_FILE_NAME}' and parents in '${folderId}' and trashed=false`,
            fields: 'files(id, name)'
        });
        
        const fileData = JSON.stringify(data, null, 2);
        const metadata = {
            name: CLOUD_FILE_NAME,
            parents: [folderId]
        };
        
        if (searchResponse.result.files.length > 0) {
            // Update existing file
            const fileId = searchResponse.result.files[0].id;
            await gapi.client.request({
                path: `/upload/drive/v3/files/${fileId}`,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                body: fileData
            });
        } else {
            // Create new file
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([fileData], { type: 'application/json' }));
            
            await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                body: form
            });
        }
        
        showSyncNotification('☁️ Данные синхронизированы', 'success');
        
    } catch (error) {
        console.error('Error syncing to cloud:', error);
        showSyncNotification('❌ Ошибка синхронизации', 'error');
    }
}

async function loadFromCloud() {
    try {
        const folderId = await ensureUserCloudFolder();
        const response = await gapi.client.drive.files.list({
            q: `name='${CLOUD_FILE_NAME}' and parents in '${folderId}' and trashed=false`,
            fields: 'files(id, name)'
        });
        
        if (response.result.files.length > 0) {
            const fileId = response.result.files[0].id;
            const fileResponse = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });
            
            const cloudData = fileResponse.result;
            
            // Check if cloud data is newer
            const localLastSync = localStorage.getItem('lastCloudSync');
            if (cloudData.lastSync && (!localLastSync || cloudData.lastSync > localLastSync)) {
                // Load cloud data
                transactions = cloudData.transactions || [];
                assets = cloudData.assets || [];
                liabilities = cloudData.liabilities || [];
                assetUsageCount = cloudData.assetUsageCount || {};
                liabilityUsageCount = cloudData.liabilityUsageCount || {};
                
                saveData();
                updateAll();
                
                localStorage.setItem('lastCloudSync', cloudData.lastSync);
                const userName = localStorage.getItem('user_name');
                showSyncNotification(`📥 Данные ${userName} загружены из облака`, 'success');
            }
        }
    } catch (error) {
        console.error('Error loading from cloud:', error);
    }
}

// Show sync notifications
function showSyncNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    const colors = {
        success: { bg: '#4caf50', text: 'white' },
        error: { bg: '#f44336', text: 'white' },
        info: { bg: '#2196f3', text: 'white' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.background = color.bg;
    notification.style.color = color.text;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add Google Sign-In button to header
function addGoogleAuthButton() {
    const headerRight = document.querySelector('.header-right');
    if (headerRight && !document.getElementById('googleAuthBtn')) {
        const authBtn = document.createElement('button');
        authBtn.id = 'googleAuthBtn';
        authBtn.className = 'btn btn-primary';
        
        if (!isGoogleAuthConfigured()) {
            authBtn.innerHTML = '🔗 Google (настроить)';
            authBtn.className = 'btn btn-secondary';
            authBtn.onclick = () => {
                alert('Чтобы включить синхронизацию с Google:\n\n1. Откройте файл GOOGLE_SETUP.md\n2. Создайте проект в Google Cloud Console\n3. Получите Client ID и API ключ\n4. Вставьте их в google-auth.js');
            };
        } else {
            authBtn.innerHTML = '🔗 Войти через Google';
            authBtn.onclick = () => google.accounts.id.prompt();
        }
        
        headerRight.insertBefore(authBtn, headerRight.firstChild);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add Google Sign-In button - TEMPORARILY DISABLED
    // setTimeout(addGoogleAuthButton, 1000);
    
    // Initialize Google Auth if available
    if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
        initializeGoogleAuth();
    } else {
        // Load Google APIs if not already loaded
        const script1 = document.createElement('script');
        script1.src = 'https://apis.google.com/js/api.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://accounts.google.com/gsi/client';
            script2.onload = initializeGoogleAuth;
            document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
    }
});
