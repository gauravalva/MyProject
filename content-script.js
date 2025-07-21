// Content script for the Digital Reading Enhancement Tool
// This script runs on all web pages to provide word definition functionality

class ReadingEnhancementExtension {
    constructor() {
        this.popup = null;
        this.isPopupVisible = false;
        this.currentSelection = '';
        this.shadowRoot = null;
        
        this.init();
    }
    
    init() {
        this.createShadowDOM();
        this.bindEvents();
        this.setupKeyboardNavigation();
    }
    
    createShadowDOM() {
        // Create a shadow DOM to isolate our styles
        const container = document.createElement('div');
        container.id = 'reading-enhancement-extension';
        document.body.appendChild(container);
        
        this.shadowRoot = container.attachShadow({ mode: 'closed' });
        
        // Create popup HTML
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    all: initial;
                }
                
                .popup-container {
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 2147483647;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }
                
                .popup-container.show {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: all;
                }
                
                .popup-container.show .popup-content {
                    transform: translateX(0) scale(1);
                }
                
                .popup-content {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    width: 320px;
                    max-width: calc(100vw - 40px);
                    transform: translateX(20px) scale(0.9);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .popup-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }
                
                .popup-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.2s ease;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .popup-body {
                    padding: 1.25rem;
                }
                
                .selected-word {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 1rem;
                    text-transform: capitalize;
                }
                
                .definition-content {
                    min-height: 80px;
                }
                
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #666;
                    font-size: 0.95rem;
                }
                
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .definition-text {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #444;
                    margin-bottom: 1rem;
                }
                
                .etymology {
                    font-size: 0.9rem;
                    color: #666;
                    font-style: italic;
                    margin-bottom: 0.75rem;
                    padding: 0.75rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 3px solid #667eea;
                }
                
                .usage-example {
                    font-size: 0.9rem;
                    color: #555;
                    padding: 0.75rem;
                    background: #f0f8ff;
                    border-radius: 8px;
                    border-left: 3px solid #764ba2;
                }
                
                .usage-example::before {
                    content: "💡 Example: ";
                    font-weight: 600;
                    color: #764ba2;
                }
                
                .popup-footer {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0 1.25rem 1.25rem;
                }
                
                .action-btn {
                    flex: 1;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                    color: #666;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .action-btn:hover {
                    background: #e9ecef;
                    color: #333;
                    transform: translateY(-1px);
                }
                
                /* Mobile responsive */
                @media (max-width: 768px) {
                    .popup-container {
                        right: 10px;
                        left: 10px;
                        top: auto;
                        bottom: 20px;
                        transform: none;
                        width: auto;
                    }
                    
                    .popup-container.show .popup-content {
                        transform: translateY(0) scale(1);
                    }
                    
                    .popup-content {
                        width: 100%;
                        max-width: none;
                        transform: translateY(20px) scale(0.95);
                        border-radius: 15px;
                    }
                }
                
                .close-btn:focus,
                .action-btn:focus {
                    outline: 2px solid #667eea;
                    outline-offset: 2px;
                }
            </style>
            
            <div class="popup-container" id="definition-popup" aria-hidden="true">
                <div class="popup-content">
                    <div class="popup-header">
                        <div class="popup-icon">📚</div>
                        <button class="close-btn" aria-label="Close definition">✕</button>
                    </div>
                    <div class="popup-body">
                        <div class="selected-word"></div>
                        <div class="definition-content">
                            <div class="loading">
                                <div class="spinner"></div>
                                <span>Getting definition...</span>
                            </div>
                            <div class="definition-text" style="display: none;"></div>
                            <div class="etymology" style="display: none;"></div>
                            <div class="usage-example" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="popup-footer">
                        <button class="action-btn copy-btn" aria-label="Copy definition">
                            📋 Copy
                        </button>
                        <button class="action-btn share-btn" aria-label="Share definition">
                            📤 Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.popup = this.shadowRoot.querySelector('#definition-popup');
        this.selectedWordEl = this.shadowRoot.querySelector('.selected-word');
        this.definitionTextEl = this.shadowRoot.querySelector('.definition-text');
        this.etymologyEl = this.shadowRoot.querySelector('.etymology');
        this.usageExampleEl = this.shadowRoot.querySelector('.usage-example');
        this.loadingEl = this.shadowRoot.querySelector('.loading');
        this.copyBtn = this.shadowRoot.querySelector('.copy-btn');
        this.shareBtn = this.shadowRoot.querySelector('.share-btn');
        this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    }
    
    bindEvents() {
        // Text selection events on the main document
        document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
        document.addEventListener('touchend', (e) => this.handleTextSelection(e));
        
        // Popup controls
        this.closeBtn.addEventListener('click', () => this.hidePopup());
        this.copyBtn.addEventListener('click', () => this.copyDefinition());
        this.shareBtn.addEventListener('click', () => this.shareDefinition());
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isPopupVisible && !this.popup.contains(e.target)) {
                this.hidePopup();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupVisible) {
                this.hidePopup();
            }
        });
        
        // Prevent popup from closing when clicking inside it
        this.popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Handle window resize for responsive positioning
        window.addEventListener('resize', () => {
            if (this.isPopupVisible) {
                this.adjustPopupPosition();
            }
        });
    }
    
    setupKeyboardNavigation() {
        this.popup.setAttribute('tabindex', '-1');
        
        this.popup.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }
    
    trapFocus(e) {
        const focusableElements = this.popup.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    handleTextSelection(e) {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText && selectedText.length > 1) {
                if (selectedText.length < 2 || /^\d+$/.test(selectedText)) {
                    return;
                }
                
                const cleanText = this.cleanSelectedText(selectedText);
                if (cleanText && cleanText !== this.currentSelection) {
                    this.currentSelection = cleanText;
                    this.showPopup(cleanText);
                }
            } else if (this.isPopupVisible) {
                const isClickingInsidePopup = this.shadowRoot.contains(e.target);
                if (!isClickingInsidePopup) {
                    this.hidePopup();
                }
            }
        }, 100);
    }
    
    cleanSelectedText(text) {
        return text
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }
    
    async showPopup(selectedText) {
        this.selectedWordEl.textContent = selectedText;
        
        this.showLoadingState();
        this.popup.classList.add('show');
        this.popup.setAttribute('aria-hidden', 'false');
        this.isPopupVisible = true;
        
        this.popup.focus();
        this.adjustPopupPosition();
        
        try {
            const definition = await this.fetchDefinition(selectedText);
            this.displayDefinition(definition);
        } catch (error) {
            console.error('Error fetching definition:', error);
            this.displayError();
        }
    }
    
    hidePopup() {
        this.popup.classList.remove('show');
        this.popup.setAttribute('aria-hidden', 'true');
        this.isPopupVisible = false;
        this.currentSelection = '';
        
        window.getSelection().removeAllRanges();
    }
    
    showLoadingState() {
        this.loadingEl.style.display = 'flex';
        this.definitionTextEl.style.display = 'none';
        this.etymologyEl.style.display = 'none';
        this.usageExampleEl.style.display = 'none';
    }
    
    adjustPopupPosition() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.popup.style.position = 'fixed';
            this.popup.style.bottom = '20px';
            this.popup.style.left = '10px';
            this.popup.style.right = '10px';
            this.popup.style.top = 'auto';
            this.popup.style.transform = 'none';
        } else {
            this.popup.style.position = 'fixed';
            this.popup.style.right = '20px';
            this.popup.style.top = '50%';
            this.popup.style.left = 'auto';
            this.popup.style.bottom = 'auto';
            this.popup.style.transform = 'translateY(-50%)';
        }
    }
    
    async fetchDefinition(word) {
        // In a real implementation, this would use the background script
        // to make API calls to OpenAI or another definition service
        return new Promise((resolve) => {
            setTimeout(() => {
                const definition = this.getMockDefinition(word);
                resolve(definition);
            }, 800 + Math.random() * 400);
        });
    }
    
    getMockDefinition(word) {
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
            }
        };
        
        const lowerWord = word.toLowerCase();
        
        if (definitions[lowerWord]) {
            return definitions[lowerWord];
        }
        
        for (const [key, def] of Object.entries(definitions)) {
            if (key.includes(lowerWord) || lowerWord.includes(key)) {
                return def;
            }
        }
        
        return {
            definition: `"${word}" - A term that may have specialized meaning in its context. This word might be technical, scientific, or domain-specific.`,
            etymology: 'Etymology information not available for this term.',
            example: `The word "${word}" appears in specialized or technical contexts.`
        };
    }
    
    displayDefinition(definition) {
        this.loadingEl.style.display = 'none';
        
        this.definitionTextEl.textContent = definition.definition;
        this.definitionTextEl.style.display = 'block';
        
        if (definition.etymology && definition.etymology !== 'Etymology information not available for this term.') {
            this.etymologyEl.textContent = definition.etymology;
            this.etymologyEl.style.display = 'block';
        } else {
            this.etymologyEl.style.display = 'none';
        }
        
        if (definition.example) {
            this.usageExampleEl.textContent = definition.example.replace('💡 Example: ', '');
            this.usageExampleEl.style.display = 'block';
        } else {
            this.usageExampleEl.style.display = 'none';
        }
    }
    
    displayError() {
        this.loadingEl.style.display = 'none';
        this.definitionTextEl.textContent = 'Sorry, we couldn\'t fetch the definition at this time. Please try again later.';
        this.definitionTextEl.style.display = 'block';
        this.etymologyEl.style.display = 'none';
        this.usageExampleEl.style.display = 'none';
    }
    
    async copyDefinition() {
        const definition = this.definitionTextEl.textContent;
        const word = this.selectedWordEl.textContent;
        const textToCopy = `${word}: ${definition}`;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showToast('Definition copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showToast('Failed to copy definition');
        }
    }
    
    shareDefinition() {
        const definition = this.definitionTextEl.textContent;
        const word = this.selectedWordEl.textContent;
        const shareText = `${word}: ${definition}`;
        
        if (navigator.share) {
            navigator.share({
                title: `Definition of ${word}`,
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            this.copyDefinition();
        }
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 2147483648;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the extension when the page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ReadingEnhancementExtension();
    });
} else {
    new ReadingEnhancementExtension();
}