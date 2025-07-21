# AI Definition Widget

A cross-platform browser extension that provides AI-powered contextual definitions for selected text with a sleek, responsive popup interface.

## ✨ Features

- **Smart Text Selection**: Automatically detects when you highlight words or phrases
- **AI-Powered Definitions**: Get intelligent definitions, examples, and etymology
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Right-Side Positioning**: Clean, non-intrusive popup positioned at the right center of your screen
- **Multiple API Sources**: Support for OpenAI, Dictionary API, or demo mode
- **Caching System**: Stores definitions locally for faster access
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark Mode**: Automatic theme detection with manual override options
- **Copy & Share**: Easy sharing and copying of definitions

## 🚀 Installation

### From Browser Store (Recommended)
1. Visit the Chrome Web Store / Firefox Add-ons / Edge Add-ons
2. Search for "AI Definition Widget"
3. Click "Add to Browser"

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/ai-definition-widget.git
   cd ai-definition-widget
   ```

2. Load the extension in your browser:
   
   **Chrome/Edge:**
   - Open `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder
   
   **Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

## 🎯 How to Use

1. **Basic Usage**:
   - Select any word or phrase on a webpage
   - The definition popup appears automatically on the right side
   - Click the X button or press Escape to close

2. **Quick Test**:
   - Open the included `demo.html` file in your browser
   - Try selecting highlighted words like "photosynthesis" or "serendipity"
   - Click the test word buttons for instant selection

3. **Settings**:
   - Click the extension icon in your browser toolbar
   - Customize position, theme, and API provider
   - Configure your API keys for enhanced definitions

## ⚙️ Configuration

### API Providers

**Demo Mode (Default)**:
- No setup required
- Includes sample definitions for common words
- Perfect for testing and demonstration

**Free Dictionary API**:
- No API key required
- Uses the free Dictionary API service
- Good for basic word definitions

**OpenAI GPT**:
- Requires OpenAI API key
- Most intelligent and contextual definitions
- Includes examples and detailed explanations

### Settings Options

- **Enable Widget**: Toggle the entire extension on/off
- **Auto-show on Selection**: Automatically display popup when text is selected
- **Position**: Choose popup placement (right-center, right-top, etc.)
- **Theme**: Auto, light, or dark mode
- **Caching**: Enable/disable local definition storage

## 🛠️ Development

### Project Structure
```
ai-definition-widget/
├── manifest.json          # Extension manifest
├── content-script.js      # Main widget logic
├── widget-styles.css      # Styling and responsive design
├── background.js          # Service worker
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── demo.html             # Test page
├── icons/                # Extension icons
└── README.md             # Documentation
```

### Key Components

**AIDefinitionWidget Class** (`content-script.js`):
- Handles text selection events
- Creates and manages the popup UI
- Fetches definitions from various sources
- Implements responsive positioning

**BackgroundService Class** (`background.js`):
- Manages API integrations
- Handles caching and storage
- Provides context menu integration
- Manages extension settings

### Building for Production

1. **Test the extension**:
   - Load it in developer mode
   - Test on various websites
   - Verify responsive behavior

2. **Package for distribution**:
   ```bash
   # Create a zip file excluding development files
   zip -r ai-definition-widget.zip . -x "*.git*" "*.DS_Store*" "node_modules/*"
   ```

3. **Submit to browser stores**:
   - Chrome Web Store: [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Firefox Add-ons: [Developer Hub](https://addons.mozilla.org/developers/)
   - Edge Add-ons: [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)

## 🎨 Customization

### Styling
Modify `widget-styles.css` to customize:
- Colors and gradients
- Animation timings
- Popup dimensions
- Responsive breakpoints

### API Integration
Add new definition sources in `background.js`:
```javascript
async getCustomAPIDefinition(text, settings) {
  // Your custom API integration
  const response = await fetch(`https://your-api.com/define/${text}`);
  // Process and return definition object
}
```

## 🔧 Troubleshooting

### Common Issues

**Widget doesn't appear**:
- Check if the extension is enabled
- Verify the website allows content scripts
- Try refreshing the page

**API errors**:
- Verify your API key is correct
- Check your internet connection
- Try switching to demo mode

**Positioning issues**:
- Adjust position settings in the popup
- Check for CSS conflicts with the website
- Try different responsive breakpoints

### Debug Mode
1. Open browser developer tools
2. Check the console for error messages
3. Inspect the widget element in the DOM
4. Test API responses in the Network tab

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API integration
- Free Dictionary API for word definitions
- The browser extension community for best practices
- Contributors and beta testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/ai-definition-widget/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/ai-definition-widget/discussions)
- **Email**: support@your-domain.com

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Cross-platform browser support
- Multiple API provider integration
- Responsive design with mobile support
- Accessibility features
- Caching system
- Dark mode support

---

Made with ❤️ for better reading experiences. Happy defining! 🎉
