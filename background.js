// Background Service Worker for AI Definition Widget

class BackgroundService {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupContextMenu();
  }
  
  setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });
    
    // Handle messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
    
    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tabId, tab);
      }
    });
  }
  
  setupContextMenu() {
    chrome.contextMenus.create({
      id: 'ai-definition-lookup',
      title: 'Get AI Definition',
      contexts: ['selection'],
      documentUrlPatterns: ['http://*/*', 'https://*/*']
    });
    
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'ai-definition-lookup' && info.selectionText) {
        this.handleContextMenuClick(info, tab);
      }
    });
  }
  
  handleInstallation(details) {
    if (details.reason === 'install') {
      // Set default settings
      chrome.storage.sync.set({
        enabled: true,
        autoShow: true,
        position: 'right-center',
        theme: 'auto',
        cacheEnabled: true,
        apiProvider: 'mock' // Can be 'openai', 'dictionary-api', etc.
      });
      
      // Open welcome page
      chrome.tabs.create({
        url: chrome.runtime.getURL('welcome.html')
      });
    }
  }
  
  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.type) {
        case 'GET_DEFINITION':
          const definition = await this.getDefinition(message.text);
          sendResponse({ success: true, data: definition });
          break;
          
        case 'GET_SETTINGS':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;
          
        case 'UPDATE_SETTINGS':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;
          
        case 'CACHE_DEFINITION':
          await this.cacheDefinition(message.text, message.definition);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Background service error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  handleTabUpdate(tabId, tab) {
    // Inject content script if needed
    if (this.shouldInjectScript(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content-script.js']
      }).catch(err => {
        // Script might already be injected or tab might not support injection
        console.log('Script injection skipped:', err.message);
      });
    }
  }
  
  handleContextMenuClick(info, tab) {
    // Send message to content script to show definition
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_DEFINITION',
      text: info.selectionText
    });
  }
  
  shouldInjectScript(url) {
    if (!url) return false;
    
    const excludePatterns = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:',
      'file://'
    ];
    
    return !excludePatterns.some(pattern => url.startsWith(pattern));
  }
  
  async getDefinition(text) {
    const settings = await this.getSettings();
    
    // Check cache first if enabled
    if (settings.cacheEnabled) {
      const cached = await this.getCachedDefinition(text);
      if (cached) {
        return cached;
      }
    }
    
    let definition;
    
    switch (settings.apiProvider) {
      case 'openai':
        definition = await this.getOpenAIDefinition(text, settings);
        break;
      case 'dictionary-api':
        definition = await this.getDictionaryAPIDefinition(text, settings);
        break;
      default:
        definition = await this.getMockDefinition(text);
    }
    
    // Cache the result if caching is enabled
    if (settings.cacheEnabled && definition) {
      await this.cacheDefinition(text, definition);
    }
    
    return definition;
  }
  
  async getOpenAIDefinition(text, settings) {
    if (!settings.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful dictionary assistant. Provide clear, concise definitions with examples and etymology when possible. Format your response as JSON with fields: definition, example, etymology.'
          },
          {
            role: 'user',
            content: `Define the word or phrase: "${text}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // Fallback if response isn't JSON
      return {
        definition: content,
        example: null,
        etymology: null
      };
    }
  }
  
  async getDictionaryAPIDefinition(text, settings) {
    // Example using Free Dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      throw new Error('Word not found in dictionary');
    }
    
    const data = await response.json();
    const entry = data[0];
    const meaning = entry.meanings[0];
    const definition = meaning.definitions[0];
    
    return {
      definition: definition.definition,
      example: definition.example || null,
      etymology: entry.origin || null
    };
  }
  
  async getMockDefinition(text) {
    // Mock definitions for testing
    const mockDefinitions = {
      'photosynthesis': {
        definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. It generally involves the green pigment chlorophyll and generates oxygen as a byproduct.',
        example: 'During photosynthesis, plants convert sunlight into chemical energy.',
        etymology: 'From Greek "photos" (light) + "synthesis" (putting together)'
      },
      'serendipity': {
        definition: 'The occurrence and development of events by chance in a happy or beneficial way; a pleasant surprise.',
        example: 'Finding that old book was pure serendipity.',
        etymology: 'Coined by Horace Walpole in 1754, from the Persian fairy tale "The Three Princes of Serendip"'
      },
      'ubiquitous': {
        definition: 'Present, appearing, or found everywhere; omnipresent.',
        example: 'Smartphones have become ubiquitous in modern society.',
        etymology: 'From Latin "ubique" meaning "everywhere"'
      },
      'ephemeral': {
        definition: 'Lasting for a very short time; transitory.',
        example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.',
        etymology: 'From Greek "ephemeros" meaning "lasting only a day"'
      }
    };
    
    const lowerText = text.toLowerCase();
    
    if (mockDefinitions[lowerText]) {
      return mockDefinitions[lowerText];
    }
    
    // Generic response for unknown words
    return {
      definition: `"${text}" - This term may have multiple meanings depending on context. It could be a technical term, proper noun, or specialized vocabulary from a particular field.`,
      example: `The word "${text}" appears in various contexts and may require additional information for a precise definition.`,
      etymology: 'Etymology information not available for this term.'
    };
  }
  
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        enabled: true,
        autoShow: true,
        position: 'right-center',
        theme: 'auto',
        cacheEnabled: true,
        apiProvider: 'mock',
        openaiApiKey: '',
        dictionaryApiKey: ''
      }, resolve);
    });
  }
  
  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newSettings, resolve);
    });
  }
  
  async getCachedDefinition(text) {
    return new Promise((resolve) => {
      const key = `cache_${text.toLowerCase()}`;
      chrome.storage.local.get([key], (result) => {
        const cached = result[key];
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          resolve(cached.definition);
        } else {
          resolve(null);
        }
      });
    });
  }
  
  async cacheDefinition(text, definition) {
    return new Promise((resolve) => {
      const key = `cache_${text.toLowerCase()}`;
      chrome.storage.local.set({
        [key]: {
          definition,
          timestamp: Date.now()
        }
      }, resolve);
    });
  }
}

// Initialize the background service
new BackgroundService();