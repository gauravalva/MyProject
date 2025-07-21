# 📚 WordPeek

Your AI-powered reading companion! WordPeek is a cross-platform browser extension and web tool that provides instant AI-powered definitions for unfamiliar words and phrases while reading digital content. Features a beautiful, responsive contextual popup that appears when you highlight text.

![Demo](demo-screenshot.png)

## ✨ Features

### 🎯 Core Functionality
- **Instant Definitions**: Highlight any word or phrase to get immediate definitions
- **AI-Powered**: Multiple definition sources including OpenAI GPT-4, Dictionary API, and curated definitions
- **Contextual Popup**: Beautiful right-centered popup (desktop) or bottom-sliding popup (mobile)
- **Etymology & Examples**: Optional word origins and usage examples
- **Smart Text Processing**: Automatic text cleaning and intelligent word matching

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and loading states
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, minimalist design with gradient backgrounds
- **Dark/Light Adaptive**: Respects system preferences

### 🔧 Advanced Features
- **Multiple Definition Sources**: Choose between demo, free API, or premium AI definitions
- **Customizable Settings**: Toggle etymology, examples, and animations
- **Copy & Share**: Easy sharing and clipboard functionality
- **Privacy-Focused**: No personal data collection, local storage only
- **Cross-Browser**: Works on Chrome, Edge, Firefox, and Safari

## 🚀 Quick Start

### Web Demo
1. Open `index.html` in your browser
2. Highlight any word in the sample text
3. Watch the definition popup appear!

### Browser Extension
1. Load the extension in Chrome/Edge:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this folder
2. The extension will automatically work on all websites
3. Click the extension icon to configure settings

## 📱 Device Support

### Desktop & Laptop
- **Popup Position**: Right-centered, vertically aligned
- **Interaction**: Mouse selection and hover
- **Size**: 320px width, adaptive height

### Tablet
- **Popup Position**: Right-centered with responsive margins
- **Interaction**: Touch selection
- **Size**: Adaptive width with max constraints

### Mobile
- **Popup Position**: Bottom-sliding overlay
- **Interaction**: Touch selection with haptic feedback
- **Size**: Full-width with rounded corners

## 🔧 Configuration

### Definition Sources

#### 1. Demo Definitions (Free)
- Pre-loaded definitions for common academic terms
- Perfect for testing and demonstration
- No API key required

#### 2. Dictionary API (Free)
- Real dictionary definitions from multiple sources
- Etymology and pronunciation included
- No API key required
- Rate limited but sufficient for personal use

#### 3. OpenAI GPT-4 (Premium)
- AI-generated definitions in simple language
- Context-aware explanations
- Requires OpenAI API key
- Best quality but costs per request

### Settings Options

```javascript
{
  enabled: true,                    // Enable/disable extension
  apiProvider: 'mock',              // 'mock', 'dictionary-api', 'openai'
  showEtymology: true,              // Show word origins
  showExamples: true,               // Show usage examples
  animationsEnabled: true,          // Enable smooth animations
  openaiApiKey: 'sk-...'           // OpenAI API key (if using GPT-4)
}
```

## 🛠️ Development

### Project Structure
```
├── index.html              # Web demo page
├── styles.css              # Main stylesheet
├── script.js               # Web demo JavaScript
├── manifest.json           # Browser extension manifest
├── content-script.js       # Extension content script
├── background.js           # Extension background script
├── popup.html              # Extension settings popup
├── popup.js                # Extension popup JavaScript
├── icons/                  # Extension icons
└── README.md               # This file
```

### Local Development
1. Clone the repository
2. Open `index.html` for web demo
3. Load as unpacked extension for browser testing
4. Make changes and reload extension

### Adding New Definition Sources
1. Add provider option in `background.js`
2. Implement `fetchXXXDefinition()` function
3. Update settings UI in `popup.html`
4. Test with various word types

## 🎯 Usage Examples

### Basic Usage
```javascript
// User highlights "photosynthesis"
// Popup appears with:
{
  definition: "The process by which green plants use sunlight to make food from carbon dioxide and water.",
  etymology: "From Greek 'photos' (light) + 'synthesis' (putting together)",
  example: "Plants rely on photosynthesis to convert sunlight into energy for growth."
}
```

### API Integration
```javascript
// OpenAI API call example
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Define "${word}" in simple terms with etymology and example.`
    }],
    max_tokens: 300
  })
});
```

## 🔒 Privacy & Security

### Data Handling
- **No Tracking**: No analytics or user behavior tracking
- **Local Storage**: All settings stored locally in browser
- **API Keys**: Encrypted storage in Chrome sync storage
- **No Personal Data**: Only selected words are processed

### Security Features
- **Content Security Policy**: Prevents XSS attacks
- **Shadow DOM**: Isolates extension UI from page content
- **Secure Communication**: HTTPS-only API calls
- **Input Validation**: All user inputs sanitized

## 🌐 Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|--------|
| Chrome | 88+ | ✅ Full | Recommended |
| Edge | 88+ | ✅ Full | Chromium-based |
| Firefox | 109+ | ⚠️ Partial | Manifest V2 needed |
| Safari | 14+ | ⚠️ Partial | Different APIs |

## 📊 Performance

### Metrics
- **Load Time**: < 100ms initialization
- **Definition Fetch**: 200-800ms (depending on source)
- **Memory Usage**: < 5MB
- **CPU Impact**: Minimal, event-driven

### Optimizations
- **Lazy Loading**: Components loaded on demand
- **Debounced Selection**: Prevents excessive API calls
- **Cached Definitions**: Recently looked up words cached
- **Shadow DOM**: Isolated rendering for performance

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers and devices
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure accessibility compliance
- Update documentation

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser version and steps to reproduce
- Provide screenshots for UI issues
- Check existing issues first

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Dictionary API** for free definitions
- **Font Awesome** for icons
- **MDN Web Docs** for web standards reference

## 📞 Support

- **Documentation**: This README and inline comments
- **Issues**: GitHub Issues tab
- **Email**: support@wordpeek.com
- **Discord**: Join our community server

---

**Made with ❤️ for better reading experiences**

*WordPeek - Your AI-powered reading companion*

*Last updated: December 2024*
