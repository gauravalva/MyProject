class PopupManager {
  constructor() {
    this.settings = {};
    this.init();
  }
  
  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.loadStats();
  }
  
  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (response.success) {
        this.settings = response.data;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.showNotification('Failed to load settings', 'error');
    }
  }
  
  async saveSettings() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: this.settings
      });
      
      if (response.success) {
        this.showNotification('Settings saved successfully!', 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification('Failed to save settings', 'error');
    }
  }
  
  setupEventListeners() {
    // Toggle switches
    document.getElementById('enableToggle').addEventListener('click', () => {
      this.toggleSetting('enabled');
    });
    
    document.getElementById('autoShowToggle').addEventListener('click', () => {
      this.toggleSetting('autoShow');
    });
    
    document.getElementById('cacheToggle').addEventListener('click', () => {
      this.toggleSetting('cacheEnabled');
    });
    
    // Select dropdowns
    document.getElementById('positionSelect').addEventListener('change', (e) => {
      this.settings.position = e.target.value;
    });
    
    document.getElementById('themeSelect').addEventListener('change', (e) => {
      this.settings.theme = e.target.value;
    });
    
    document.getElementById('apiProviderSelect').addEventListener('change', (e) => {
      this.settings.apiProvider = e.target.value;
      this.updateApiKeySection();
    });
    
    // API key input
    document.getElementById('apiKeyInput').addEventListener('input', (e) => {
      const provider = this.settings.apiProvider;
      if (provider === 'openai') {
        this.settings.openaiApiKey = e.target.value;
      } else if (provider === 'dictionary-api') {
        this.settings.dictionaryApiKey = e.target.value;
      }
    });
    
    // Buttons
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      this.saveSettings();
    });
    
    document.getElementById('clearCacheBtn').addEventListener('click', () => {
      this.clearCache();
    });
    
    document.getElementById('testWidgetBtn').addEventListener('click', () => {
      this.testWidget();
    });
    
    // Footer links
    document.getElementById('helpLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.openHelp();
    });
    
    document.getElementById('feedbackLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.openFeedback();
    });
    
    document.getElementById('privacyLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.openPrivacy();
    });
  }
  
  toggleSetting(key) {
    this.settings[key] = !this.settings[key];
    this.updateToggle(key);
  }
  
  updateToggle(key) {
    const toggle = document.getElementById(`${key.replace(/([A-Z])/g, '$1').toLowerCase()}Toggle`);
    if (toggle) {
      toggle.classList.toggle('active', this.settings[key]);
    }
  }
  
  updateUI() {
    // Update toggles
    this.updateToggle('enabled');
    this.updateToggle('autoShow');
    this.updateToggle('cacheEnabled');
    
    // Update selects
    document.getElementById('positionSelect').value = this.settings.position || 'right-center';
    document.getElementById('themeSelect').value = this.settings.theme || 'auto';
    document.getElementById('apiProviderSelect').value = this.settings.apiProvider || 'mock';
    
    // Update API key section
    this.updateApiKeySection();
  }
  
  updateApiKeySection() {
    const section = document.getElementById('apiKeySection');
    const input = document.getElementById('apiKeyInput');
    const provider = this.settings.apiProvider;
    
    if (provider === 'openai' || provider === 'dictionary-api') {
      section.style.display = 'block';
      
      if (provider === 'openai') {
        input.placeholder = 'Enter your OpenAI API key...';
        input.value = this.settings.openaiApiKey || '';
      } else if (provider === 'dictionary-api') {
        input.placeholder = 'Enter your Dictionary API key...';
        input.value = this.settings.dictionaryApiKey || '';
      }
    } else {
      section.style.display = 'none';
    }
  }
  
  async clearCache() {
    try {
      await chrome.storage.local.clear();
      this.showNotification('Cache cleared successfully!', 'success');
      this.loadStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to clear cache:', error);
      this.showNotification('Failed to clear cache', 'error');
    }
  }
  
  async testWidget() {
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }
      
      // Send test message to content script
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SHOW_DEFINITION',
        text: 'serendipity'
      });
      
      this.showNotification('Test widget triggered!', 'success');
      window.close(); // Close popup after test
    } catch (error) {
      console.error('Failed to test widget:', error);
      this.showNotification('Failed to test widget. Make sure you\'re on a supported page.', 'error');
    }
  }
  
  async loadStats() {
    try {
      // Get cache count
      const storage = await chrome.storage.local.get();
      const cacheKeys = Object.keys(storage).filter(key => key.startsWith('cache_'));
      document.getElementById('cacheCount').textContent = cacheKeys.length;
      
      // Get usage stats from sync storage
      const stats = await chrome.storage.sync.get(['totalLookups', 'lastUsed']);
      document.getElementById('lookupCount').textContent = stats.totalLookups || 0;
      
      if (stats.lastUsed) {
        const lastUsed = new Date(stats.lastUsed);
        document.getElementById('lastUsed').textContent = this.formatRelativeTime(lastUsed);
      } else {
        document.getElementById('lastUsed').textContent = 'Never';
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }
  
  formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
  
  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  openHelp() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/ai-definition-widget#help'
    });
  }
  
  openFeedback() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/ai-definition-widget/issues'
    });
  }
  
  openPrivacy() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/ai-definition-widget#privacy'
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});