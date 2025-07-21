class WordPeekTool {
    constructor() {
        this.popup = document.getElementById('definition-popup');
        this.selectedWordEl = document.querySelector('.selected-word');
        this.definitionTextEl = document.querySelector('.definition-text');
        this.etymologyEl = document.querySelector('.etymology');
        this.usageExampleEl = document.querySelector('.usage-example');
        this.loadingEl = document.querySelector('.loading');
        this.copyBtn = document.querySelector('.copy-btn');
        this.shareBtn = document.querySelector('.share-btn');
        this.closeBtn = document.querySelector('.close-btn');
        
        this.currentSelection = '';
        this.isPopupVisible = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupKeyboardNavigation();
    }
    
    bindEvents() {
        // Text selection events
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
        // Make popup focusable for accessibility
        this.popup.setAttribute('tabindex', '-1');
        
        // Trap focus within popup when visible
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
        // Small delay to ensure selection is complete
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText && selectedText.length > 0) {
                // Filter out very short selections or numbers only
                if (selectedText.length < 2 || /^\d+$/.test(selectedText)) {
                    return;
                }
                
                // Clean up the selected text
                const cleanText = this.cleanSelectedText(selectedText);
                if (cleanText && cleanText !== this.currentSelection) {
                    this.currentSelection = cleanText;
                    this.showPopup(cleanText);
                }
            } else if (this.isPopupVisible) {
                // Hide popup if no text is selected and clicking outside
                const isClickingInsidePopup = this.popup.contains(e.target);
                if (!isClickingInsidePopup) {
                    this.hidePopup();
                }
            }
        }, 100);
    }
    
    cleanSelectedText(text) {
        // Remove extra whitespace and punctuation
        return text
            .replace(/[^\w\s-]/g, '') // Remove punctuation except hyphens
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
            .toLowerCase();
    }
    
    async showPopup(selectedText) {
        // Update selected word display
        this.selectedWordEl.textContent = selectedText;
        
        // Show popup with loading state
        this.showLoadingState();
        this.popup.classList.add('show');
        this.popup.setAttribute('aria-hidden', 'false');
        this.isPopupVisible = true;
        
        // Focus the popup for accessibility
        this.popup.focus();
        
        // Adjust position for mobile
        this.adjustPopupPosition();
        
        // Fetch definition
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
        
        // Clear selection
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
            // On mobile, popup slides up from bottom
            this.popup.style.position = 'fixed';
            this.popup.style.bottom = '20px';
            this.popup.style.left = '10px';
            this.popup.style.right = '10px';
            this.popup.style.top = 'auto';
            this.popup.style.transform = 'none';
        } else {
            // On desktop/tablet, popup is centered vertically on the right
            this.popup.style.position = 'fixed';
            this.popup.style.right = '20px';
            this.popup.style.top = '50%';
            this.popup.style.left = 'auto';
            this.popup.style.bottom = 'auto';
            this.popup.style.transform = 'translateY(-50%)';
        }
    }
    
    async fetchDefinition(word) {
        // Simulate AI-powered definition fetching
        // In a real implementation, this would call an AI API like OpenAI's GPT-4
        return new Promise((resolve) => {
            setTimeout(() => {
                const definitions = this.getMockDefinition(word);
                resolve(definitions);
            }, 800 + Math.random() * 400); // Simulate network delay
        });
    }
    
    getMockDefinition(word) {
        // Mock definitions for demonstration
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
            'quantum mechanics': {
                definition: 'A fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.',
                etymology: 'From Latin "quantum" (how much) + Greek "mechanikos" (relating to machines)',
                example: 'Quantum mechanics explains phenomena that classical physics cannot.'
            },
            'superposition': {
                definition: 'A fundamental principle of quantum mechanics where a particle can exist in multiple states simultaneously until it is observed or measured.',
                etymology: 'From Latin "super" (above) + "positio" (position)',
                example: 'In quantum superposition, an electron can be in multiple energy states at once.'
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
            'ecosystem': {
                definition: 'A biological community of interacting organisms and their physical environment, functioning as a system.',
                etymology: 'From Greek "oikos" (house) + "systema" (organized whole)',
                example: 'A coral reef ecosystem supports thousands of marine species.'
            },
            'cryptography': {
                definition: 'The practice and study of techniques for secure communication in the presence of adversaries, involving creating and analyzing protocols.',
                etymology: 'From Greek "kryptos" (hidden) + "graphein" (to write)',
                example: 'Modern cryptography protects online banking transactions.'
            },
            'cryptanalysis': {
                definition: 'The study of analyzing information systems to understand hidden aspects of the systems, particularly breaking cryptographic security systems.',
                etymology: 'From Greek "kryptos" (hidden) + "analyein" (to break down)',
                example: 'Cryptanalysis helped Allied forces break enemy codes during WWII.'
            },
            'biochemical': {
                definition: 'Relating to or involving chemical processes within living organisms.',
                etymology: 'From Greek "bios" (life) + "chemical"',
                example: 'Enzymes facilitate biochemical reactions in cells.'
            }
        };
        
        const lowerWord = word.toLowerCase();
        
        // Try exact match first
        if (definitions[lowerWord]) {
            return definitions[lowerWord];
        }
        
        // Try partial matches
        for (const [key, def] of Object.entries(definitions)) {
            if (key.includes(lowerWord) || lowerWord.includes(key)) {
                return def;
            }
        }
        
        // Generic definition for unknown words
        return {
            definition: `"${word}" - A term that may have specialized meaning in its context. This word might be technical, scientific, or domain-specific.`,
            etymology: 'Etymology information not available for this term.',
            example: `The word "${word}" appears in specialized or technical contexts.`
        };
    }
    
    displayDefinition(definition) {
        this.loadingEl.style.display = 'none';
        
        // Display main definition
        this.definitionTextEl.textContent = definition.definition;
        this.definitionTextEl.style.display = 'block';
        
        // Display etymology if available
        if (definition.etymology && definition.etymology !== 'Etymology information not available for this term.') {
            this.etymologyEl.textContent = definition.etymology;
            this.etymologyEl.style.display = 'block';
        } else {
            this.etymologyEl.style.display = 'none';
        }
        
        // Display usage example if available
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
            // Fallback: copy to clipboard
            this.copyDefinition();
        }
    }
    
    showToast(message) {
        // Create and show a temporary toast notification
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
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize WordPeek when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordPeekTool();
});

// Handle page visibility changes to hide popup when tab becomes inactive
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.wordPeek && window.wordPeek.isPopupVisible) {
        window.wordPeek.hidePopup();
    }
});

// Store reference globally for debugging
window.addEventListener('load', () => {
    window.wordPeek = new WordPeekTool();
});