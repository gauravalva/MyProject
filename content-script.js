class AIDefinitionWidget {
  constructor() {
    this.widget = null;
    this.isVisible = false;
    this.currentSelection = '';
    this.cache = new Map();
    this.animationDuration = 300;
    
    this.init();
  }
  
  init() {
    this.createWidget();
    this.attachEventListeners();
    this.setupKeyboardNavigation();
  }
  
  createWidget() {
    // Create the main widget container
    this.widget = document.createElement('div');
    this.widget.id = 'ai-definition-widget';
    this.widget.className = 'ai-widget-hidden';
    this.widget.setAttribute('role', 'dialog');
    this.widget.setAttribute('aria-labelledby', 'widget-title');
    this.widget.setAttribute('aria-describedby', 'widget-content');
    
    this.widget.innerHTML = `
      <div class="widget-container">
        <div class="widget-header">
          <div class="widget-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="currentColor"/>
            </svg>
          </div>
          <button class="widget-close" aria-label="Close definition">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="widget-content">
          <div id="widget-title" class="selected-text"></div>
          <div id="widget-content" class="definition-content">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <span>Getting definition...</span>
            </div>
          </div>
        </div>
        
        <div class="widget-actions">
          <button class="action-btn copy-btn" aria-label="Copy definition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 2H6.5C5.67 2 5 2.67 5 3.5V4H2.5C1.67 4 1 4.67 1 5.5V12.5C1 13.33 1.67 14 2.5 14H9.5C10.33 14 11 13.33 11 12.5V12H13.5C14.33 12 15 11.33 15 10.5V3.5C15 2.67 14.33 2 13.5 2Z" fill="currentColor"/>
            </svg>
            Copy
          </button>
          <button class="action-btn share-btn" aria-label="Share definition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5.5C13.1 5.5 14 4.6 14 3.5S13.1 1.5 12 1.5 10 2.4 10 3.5C10 3.65 10.02 3.8 10.05 3.93L5.55 6.68C5.24 6.41 4.84 6.25 4.4 6.25C3.3 6.25 2.4 7.15 2.4 8.25S3.3 10.25 4.4 10.25C4.84 10.25 5.24 10.09 5.55 9.82L10.05 12.57C10.02 12.7 10 12.85 10 13C10 14.1 10.9 15 12 15S14 14.1 14 13 13.1 11 12 11C11.56 11 11.16 11.16 10.85 11.43L6.35 8.68C6.38 8.55 6.4 8.4 6.4 8.25S6.38 7.95 6.35 7.82L10.85 5.07C11.16 5.34 11.56 5.5 12 5.5Z" fill="currentColor"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.widget);
    this.attachWidgetEventListeners();
  }
  
  attachEventListeners() {
    // Text selection events
    document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
    document.addEventListener('touchend', (e) => this.handleTextSelection(e));
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Shift') {
        setTimeout(() => this.handleTextSelection(e), 10);
      }
    });
    
    // Hide widget when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isVisible && !this.widget.contains(e.target) && !this.isTextSelected()) {
        this.hideWidget();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.isVisible) {
        this.positionWidget();
      }
    });
    
    // Handle scroll
    window.addEventListener('scroll', () => {
      if (this.isVisible) {
        this.positionWidget();
      }
    });
  }
  
  attachWidgetEventListeners() {
    const closeBtn = this.widget.querySelector('.widget-close');
    const copyBtn = this.widget.querySelector('.copy-btn');
    const shareBtn = this.widget.querySelector('.share-btn');
    
    closeBtn.addEventListener('click', () => this.hideWidget());
    copyBtn.addEventListener('click', () => this.copyDefinition());
    shareBtn.addEventListener('click', () => this.shareDefinition());
    
    // Prevent widget from closing when clicking inside
    this.widget.addEventListener('click', (e) => e.stopPropagation());
  }
  
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hideWidget();
        e.preventDefault();
      }
    });
    
    // Make widget focusable and add keyboard navigation
    this.widget.addEventListener('keydown', (e) => {
      const focusableElements = this.widget.querySelectorAll('button');
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
      
      if (e.key === 'Tab') {
        e.preventDefault();
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
          : (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      }
    });
  }
  
  handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0 && selectedText !== this.currentSelection) {
      this.currentSelection = selectedText;
      this.showWidget(selectedText);
    } else if (!selectedText && this.isVisible) {
      setTimeout(() => {
        if (!window.getSelection().toString().trim()) {
          this.hideWidget();
        }
      }, 100);
    }
  }
  
  isTextSelected() {
    return window.getSelection().toString().trim().length > 0;
  }
  
  async showWidget(selectedText) {
    const selectedTextElement = this.widget.querySelector('.selected-text');
    const contentElement = this.widget.querySelector('.definition-content');
    
    selectedTextElement.textContent = selectedText;
    contentElement.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>Getting definition...</span>
      </div>
    `;
    
    this.positionWidget();
    this.widget.className = 'ai-widget-visible';
    this.isVisible = true;
    
    // Focus management for accessibility
    setTimeout(() => {
      this.widget.querySelector('.widget-close').focus();
    }, this.animationDuration);
    
    // Fetch definition
    try {
      const definition = await this.getDefinition(selectedText);
      this.displayDefinition(definition);
    } catch (error) {
      this.displayError(error.message);
    }
  }
  
  hideWidget() {
    this.widget.className = 'ai-widget-hidden';
    this.isVisible = false;
    this.currentSelection = '';
    
    // Return focus to the document
    document.activeElement.blur();
  }
  
  positionWidget() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    if (isMobile) {
      // On mobile, slide in from bottom
      this.widget.style.position = 'fixed';
      this.widget.style.bottom = '20px';
      this.widget.style.left = '10px';
      this.widget.style.right = '10px';
      this.widget.style.top = 'auto';
      this.widget.style.transform = 'none';
    } else {
      // On desktop/tablet, position on right side, vertically centered
      this.widget.style.position = 'fixed';
      this.widget.style.right = '20px';
      this.widget.style.top = '50%';
      this.widget.style.left = 'auto';
      this.widget.style.bottom = 'auto';
      this.widget.style.transform = 'translateY(-50%)';
    }
  }
  
  async getDefinition(text) {
    // Check cache first
    if (this.cache.has(text)) {
      return this.cache.get(text);
    }
    
    // Simulate AI API call (replace with actual API integration)
    const definition = await this.simulateAIDefinition(text);
    
    // Cache the result
    this.cache.set(text, definition);
    return definition;
  }
  
  async simulateAIDefinition(text) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is a mock implementation. In a real scenario, you would integrate with:
    // - OpenAI API
    // - Google's Dictionary API
    // - Merriam-Webster API
    // - Or any other definition service
    
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
      }
    };
    
    const lowerText = text.toLowerCase();
    
    if (mockDefinitions[lowerText]) {
      return mockDefinitions[lowerText];
    }
    
    // Generic AI-style response for unknown words
    return {
      definition: `"${text}" - This term may have multiple meanings depending on context. It could be a technical term, proper noun, or specialized vocabulary from a particular field.`,
      example: `The word "${text}" appears in various contexts and may require additional information for a precise definition.`,
      etymology: 'Etymology information not available for this term.'
    };
  }
  
  displayDefinition(definition) {
    const contentElement = this.widget.querySelector('.definition-content');
    
    contentElement.innerHTML = `
      <div class="definition">
        <p class="definition-text">${definition.definition}</p>
        ${definition.example ? `<div class="example"><strong>Example:</strong> <em>${definition.example}</em></div>` : ''}
        ${definition.etymology ? `<div class="etymology"><strong>Etymology:</strong> ${definition.etymology}</div>` : ''}
      </div>
    `;
  }
  
  displayError(message) {
    const contentElement = this.widget.querySelector('.definition-content');
    
    contentElement.innerHTML = `
      <div class="error">
        <p>Sorry, I couldn't fetch the definition right now.</p>
        <p class="error-message">${message}</p>
        <button class="retry-btn" onclick="this.closest('.ai-definition-widget').dispatchEvent(new CustomEvent('retry'))">
          Try Again
        </button>
      </div>
    `;
    
    // Add retry functionality
    this.widget.addEventListener('retry', () => {
      this.showWidget(this.currentSelection);
    }, { once: true });
  }
  
  async copyDefinition() {
    const definitionText = this.widget.querySelector('.definition-text');
    const selectedText = this.widget.querySelector('.selected-text').textContent;
    
    if (definitionText) {
      const textToCopy = `${selectedText}: ${definitionText.textContent}`;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        this.showToast('Definition copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showToast('Definition copied to clipboard!');
      }
    }
  }
  
  shareDefinition() {
    const definitionText = this.widget.querySelector('.definition-text');
    const selectedText = this.widget.querySelector('.selected-text').textContent;
    
    if (definitionText && navigator.share) {
      navigator.share({
        title: `Definition of "${selectedText}"`,
        text: `${selectedText}: ${definitionText.textContent}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      this.copyDefinition();
    }
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'ai-widget-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  }
}

// Initialize the widget when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AIDefinitionWidget();
  });
} else {
  new AIDefinitionWidget();
}