// Popup script for WordPeek - Digital Reading Enhancement Tool
// Handles settings UI and communication with background script

document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    const enabledCheckbox = document.getElementById('enabled');
    const apiProviderSelect = document.getElementById('apiProvider');
    const openaiKeySection = document.getElementById('openaiKeySection');
    const openaiApiKeyInput = document.getElementById('openaiApiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const showEtymologyCheckbox = document.getElementById('showEtymology');
    const showExamplesCheckbox = document.getElementById('showExamples');
    const animationsEnabledCheckbox = document.getElementById('animationsEnabled');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    // Footer links
    const helpLink = document.getElementById('helpLink');
    const feedbackLink = document.getElementById('feedbackLink');
    const privacyLink = document.getElementById('privacyLink');
    
    // Load current settings
    await loadSettings();
    
    // Bind event listeners
    enabledCheckbox.addEventListener('change', handleEnabledChange);
    apiProviderSelect.addEventListener('change', handleApiProviderChange);
    saveApiKeyBtn.addEventListener('click', handleSaveApiKey);
    showEtymologyCheckbox.addEventListener('change', handleSettingChange);
    showExamplesCheckbox.addEventListener('change', handleSettingChange);
    animationsEnabledCheckbox.addEventListener('change', handleSettingChange);
    
    // Footer link handlers
    helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        openHelpPage();
    });
    
    feedbackLink.addEventListener('click', (e) => {
        e.preventDefault();
        openFeedbackPage();
    });
    
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPrivacyPage();
    });
    
    // Load settings from storage
    async function loadSettings() {
        try {
            const settings = await getSettings();
            
            enabledCheckbox.checked = settings.enabled ?? true;
            apiProviderSelect.value = settings.apiProvider ?? 'mock';
            showEtymologyCheckbox.checked = settings.showEtymology ?? true;
            showExamplesCheckbox.checked = settings.showExamples ?? true;
            animationsEnabledCheckbox.checked = settings.animationsEnabled ?? true;
            
            // Handle OpenAI API key section visibility
            handleApiProviderChange();
            
            // Update status indicator
            updateStatusIndicator(settings.enabled ?? true);
            
            // Load API key if OpenAI is selected
            if (settings.apiProvider === 'openai') {
                const apiKeyData = await chrome.storage.sync.get(['openaiApiKey']);
                if (apiKeyData.openaiApiKey) {
                    openaiApiKeyInput.value = '••••••••••••••••'; // Masked for security
                    openaiApiKeyInput.dataset.hasKey = 'true';
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            showNotification('Error loading settings', 'error');
        }
    }
    
    // Get settings from background script
    function getSettings() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
                resolve(response || {});
            });
        });
    }
    
    // Update settings
    function updateSettings(settings) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ 
                action: 'updateSettings', 
                settings 
            }, (response) => {
                resolve(response);
            });
        });
    }
    
    // Handle extension enabled/disabled
    async function handleEnabledChange() {
        const enabled = enabledCheckbox.checked;
        
        try {
            await updateSettings({ enabled });
            updateStatusIndicator(enabled);
            showNotification(enabled ? 'Extension enabled' : 'Extension disabled', 'success');
        } catch (error) {
            console.error('Error updating enabled status:', error);
            showNotification('Error updating settings', 'error');
            // Revert checkbox state
            enabledCheckbox.checked = !enabled;
        }
    }
    
    // Handle API provider change
    function handleApiProviderChange() {
        const provider = apiProviderSelect.value;
        
        if (provider === 'openai') {
            openaiKeySection.classList.remove('hidden');
        } else {
            openaiKeySection.classList.add('hidden');
        }
        
        // Update settings
        updateSettings({ apiProvider: provider }).then(() => {
            showNotification('Definition source updated', 'success');
        }).catch((error) => {
            console.error('Error updating API provider:', error);
            showNotification('Error updating settings', 'error');
        });
    }
    
    // Handle API key save
    async function handleSaveApiKey() {
        const apiKey = openaiApiKeyInput.value.trim();
        
        if (!apiKey || apiKey === '••••••••••••••••') {
            showNotification('Please enter a valid API key', 'error');
            return;
        }
        
        if (!apiKey.startsWith('sk-')) {
            showNotification('Invalid OpenAI API key format', 'error');
            return;
        }
        
        try {
            // Save API key securely
            await chrome.storage.sync.set({ openaiApiKey: apiKey });
            
            // Mask the input for security
            openaiApiKeyInput.value = '••••••••••••••••';
            openaiApiKeyInput.dataset.hasKey = 'true';
            
            showNotification('API key saved successfully', 'success');
        } catch (error) {
            console.error('Error saving API key:', error);
            showNotification('Error saving API key', 'error');
        }
    }
    
    // Handle other setting changes
    async function handleSettingChange(event) {
        const setting = event.target.id;
        const value = event.target.checked;
        
        const settingNames = {
            'showEtymology': 'Etymology display',
            'showExamples': 'Usage examples',
            'animationsEnabled': 'Animations'
        };
        
        try {
            await updateSettings({ [setting]: value });
            showNotification(`${settingNames[setting]} ${value ? 'enabled' : 'disabled'}`, 'success');
        } catch (error) {
            console.error(`Error updating ${setting}:`, error);
            showNotification('Error updating settings', 'error');
            // Revert checkbox state
            event.target.checked = !value;
        }
    }
    
    // Update status indicator
    function updateStatusIndicator(enabled) {
        if (enabled) {
            statusDot.classList.remove('disabled');
            statusText.textContent = 'Extension is active';
        } else {
            statusDot.classList.add('disabled');
            statusText.textContent = 'Extension is disabled';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#667eea'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Open help page
    function openHelpPage() {
        chrome.tabs.create({
            url: 'https://github.com/your-username/wordpeek#help'
        });
    }
    
    // Open feedback page
    function openFeedbackPage() {
        chrome.tabs.create({
            url: 'https://github.com/your-username/wordpeek/issues'
        });
    }
    
    // Open privacy page
    function openPrivacyPage() {
        chrome.tabs.create({
            url: 'https://github.com/your-username/wordpeek#privacy'
        });
    }
    
    // Handle API key input focus (clear mask if empty)
    openaiApiKeyInput.addEventListener('focus', () => {
        if (openaiApiKeyInput.value === '••••••••••••••••' && openaiApiKeyInput.dataset.hasKey === 'true') {
            openaiApiKeyInput.value = '';
            openaiApiKeyInput.dataset.hasKey = 'false';
        }
    });
    
    // Handle API key input blur (restore mask if empty)
    openaiApiKeyInput.addEventListener('blur', () => {
        if (!openaiApiKeyInput.value.trim() && openaiApiKeyInput.dataset.hasKey === 'true') {
            openaiApiKeyInput.value = '••••••••••••••••';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save API key
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && !openaiKeySection.classList.contains('hidden')) {
            e.preventDefault();
            handleSaveApiKey();
        }
        
        // Escape to close popup
        if (e.key === 'Escape') {
            window.close();
        }
    });
    
    // Handle extension update notifications
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'settingsUpdated') {
            loadSettings();
        }
    });
});