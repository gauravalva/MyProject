// Background service worker for WordPeek - Digital Reading Enhancement Tool
// Handles API calls, storage, and extension lifecycle

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('WordPeek installed');
        
        // Set default settings
        chrome.storage.sync.set({
            enabled: true,
            apiProvider: 'mock', // 'openai', 'mock', 'dictionary-api'
            showEtymology: true,
            showExamples: true,
            animationsEnabled: true
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'fetchDefinition':
            fetchDefinition(request.word)
                .then(definition => sendResponse({ success: true, definition }))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Keep message channel open for async response
            
        case 'getSettings':
            chrome.storage.sync.get(['enabled', 'apiProvider', 'showEtymology', 'showExamples', 'animationsEnabled'], (result) => {
                sendResponse(result);
            });
            return true;
            
        case 'updateSettings':
            chrome.storage.sync.set(request.settings, () => {
                sendResponse({ success: true });
            });
            return true;
    }
});

// Fetch definition from various sources
async function fetchDefinition(word) {
    const settings = await getStorageData(['apiProvider', 'showEtymology', 'showExamples']);
    
    switch (settings.apiProvider) {
        case 'openai':
            return await fetchOpenAIDefinition(word, settings);
        case 'dictionary-api':
            return await fetchDictionaryAPIDefinition(word, settings);
        default:
            return getMockDefinition(word, settings);
    }
}

// Get data from Chrome storage
function getStorageData(keys) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
    });
}

// OpenAI API integration (requires API key)
async function fetchOpenAIDefinition(word, settings) {
    // This would require an OpenAI API key stored securely
    // For demo purposes, we'll use mock data
    
    const apiKey = await getStorageData(['openaiApiKey']);
    if (!apiKey.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
    }
    
    const prompt = `Define the word "${word}" in simple terms. ${settings.showEtymology ? 'Include etymology.' : ''} ${settings.showExamples ? 'Include a usage example.' : ''} Format as JSON with fields: definition, etymology, example.`;
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey.openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful dictionary that provides clear, concise definitions with etymology and examples when requested. Always respond in valid JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.3
            })
        });
        
        if (!response.ok) {
            throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (parseError) {
            // Fallback if JSON parsing fails
            return {
                definition: content,
                etymology: settings.showEtymology ? 'Etymology information may be included in the definition above.' : '',
                example: settings.showExamples ? 'Usage example may be included in the definition above.' : ''
            };
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}

// Dictionary API integration (free alternative)
async function fetchDictionaryAPIDefinition(word, settings) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            throw new Error('Dictionary API request failed');
        }
        
        const data = await response.json();
        const entry = data[0];
        
        if (!entry) {
            throw new Error('No definition found');
        }
        
        const meaning = entry.meanings[0];
        const definition = meaning.definitions[0];
        
        return {
            definition: definition.definition,
            etymology: settings.showEtymology && entry.origin ? entry.origin : '',
            example: settings.showExamples && definition.example ? definition.example : ''
        };
    } catch (error) {
        console.error('Dictionary API error:', error);
        throw error;
    }
}

// Mock definition for demonstration
function getMockDefinition(word, settings) {
    const definitions = {
        'photosynthesis': {
            definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water, producing oxygen as a byproduct.',
            etymology: 'From Greek "photos" (light) + "synthesis" (putting together)',
            example: 'Plants rely on photosynthesis to convert sunlight into energy for growth.'
        },
        'metamorphosis': {
            definition: 'A biological process by which an animal physically develops after birth or hatching, involving a conspicuous and relatively abrupt change in body structure.',
            etymology: 'From Greek "meta" (change) + "morphe" (form)',
            example: 'The caterpillar undergoes metamorphosis to become a butterfly.'
        },
        'quantum': {
            definition: 'The minimum amount of any physical entity involved in an interaction, especially in quantum mechanics.',
            etymology: 'From Latin "quantum" meaning "how much"',
            example: 'Energy exists in discrete quantum packets called photons.'
        },
        'algorithm': {
            definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.',
            etymology: 'From Arabic "al-Khwarizmi" after Persian mathematician',
            example: 'Search engines use complex algorithms to rank web pages.'
        },
        'sustainability': {
            definition: 'The ability to be maintained at a certain rate or level without depleting natural resources or causing ecological damage.',
            etymology: 'From Latin "sustinere" meaning "to hold up"',
            example: 'Companies are adopting sustainability practices to reduce environmental impact.'
        },
        'neuroscience': {
            definition: 'The scientific study of the nervous system, including the brain, spinal cord, and networks of sensory and motor nerve cells.',
            etymology: 'From Greek "neuron" (nerve) + Latin "scientia" (knowledge)',
            example: 'Advances in neuroscience have improved our understanding of brain disorders.'
        },
        'neuroplasticity': {
            definition: 'The ability of neural networks in the brain to change through growth and reorganization, allowing the brain to adapt throughout life.',
            etymology: 'From Greek "neuron" (nerve) + "plastikos" (moldable)',
            example: 'Neuroplasticity enables stroke patients to recover lost functions.'
        },
        'biodiversity': {
            definition: 'The variety of life in the world or in a particular habitat or ecosystem, including diversity within species, between species, and of ecosystems.',
            etymology: 'From Greek "bios" (life) + Latin "diversitas" (variety)',
            example: 'Rainforests contain the highest levels of biodiversity on Earth.'
        },
        'cryptography': {
            definition: 'The practice and study of techniques for secure communication in the presence of adversaries, involving creating and analyzing protocols.',
            etymology: 'From Greek "kryptos" (hidden) + "graphein" (to write)',
            example: 'Modern cryptography protects online banking transactions.'
        },
        'ecosystem': {
            definition: 'A biological community of interacting organisms and their physical environment, functioning as a system.',
            etymology: 'From Greek "oikos" (house) + "systema" (organized whole)',
            example: 'A coral reef ecosystem supports thousands of marine species.'
        }
    };
    
    const lowerWord = word.toLowerCase();
    
    // Try exact match first
    if (definitions[lowerWord]) {
        const def = definitions[lowerWord];
        return {
            definition: def.definition,
            etymology: settings.showEtymology ? def.etymology : '',
            example: settings.showExamples ? def.example : ''
        };
    }
    
    // Try partial matches
    for (const [key, def] of Object.entries(definitions)) {
        if (key.includes(lowerWord) || lowerWord.includes(key)) {
            return {
                definition: def.definition,
                etymology: settings.showEtymology ? def.etymology : '',
                example: settings.showExamples ? def.example : ''
            };
        }
    }
    
    // Generic definition for unknown words
    return {
        definition: `"${word}" - A term that may have specialized meaning in its context. This word might be technical, scientific, or domain-specific.`,
        etymology: settings.showEtymology ? 'Etymology information not available for this term.' : '',
        example: settings.showExamples ? `The word "${word}" appears in specialized or technical contexts.` : ''
    };
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Toggle extension on/off for the current tab
    chrome.storage.sync.get(['enabled'], (result) => {
        const newState = !result.enabled;
        chrome.storage.sync.set({ enabled: newState }, () => {
            // Update icon based on state
            chrome.action.setIcon({
                path: newState ? {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                } : {
                    "16": "icons/icon16-disabled.png",
                    "32": "icons/icon32-disabled.png",
                    "48": "icons/icon48-disabled.png",
                    "128": "icons/icon128-disabled.png"
                }
            });
            
            // Notify content script of state change
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggleExtension',
                enabled: newState
            }).catch(() => {
                // Ignore errors if content script isn't loaded
            });
        });
    });
});

// Context menu integration
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'defineWord',
        title: 'Define "%s"',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'defineWord' && info.selectionText) {
        // Send message to content script to show definition
        chrome.tabs.sendMessage(tab.id, {
            action: 'showDefinition',
            word: info.selectionText.trim()
        }).catch(() => {
            console.error('Could not send message to content script');
        });
    }
});

// Analytics and usage tracking (privacy-conscious)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'trackUsage') {
        // Simple usage analytics (no personal data)
        chrome.storage.local.get(['usageStats'], (result) => {
            const stats = result.usageStats || {
                definitionsRequested: 0,
                wordsLookedUp: [],
                lastUsed: null
            };
            
            stats.definitionsRequested++;
            stats.lastUsed = Date.now();
            
            // Keep only last 50 words for privacy
            if (stats.wordsLookedUp.length >= 50) {
                stats.wordsLookedUp.shift();
            }
            stats.wordsLookedUp.push(request.word);
            
            chrome.storage.local.set({ usageStats: stats });
        });
    }
});