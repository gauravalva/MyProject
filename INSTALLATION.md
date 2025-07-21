# Installation Guide - AI Definition Widget

This guide will help you install and set up the AI Definition Widget browser extension on Chrome, Firefox, or Edge.

## 📋 Prerequisites

- A modern web browser (Chrome 88+, Firefox 78+, or Edge 88+)
- Basic understanding of browser extensions
- Optional: API keys for enhanced functionality

## 🔧 Installation Methods

### Method 1: Browser Store Installation (Recommended)

#### Chrome Web Store
1. Open Chrome and visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "AI Definition Widget"
3. Click "Add to Chrome"
4. Confirm by clicking "Add Extension"

#### Firefox Add-ons
1. Open Firefox and visit [Firefox Add-ons](https://addons.mozilla.org)
2. Search for "AI Definition Widget"
3. Click "Add to Firefox"
4. Confirm by clicking "Add"

#### Microsoft Edge Add-ons
1. Open Edge and visit [Edge Add-ons](https://microsoftedge.microsoft.com/addons)
2. Search for "AI Definition Widget"
3. Click "Get"
4. Confirm by clicking "Add Extension"

### Method 2: Manual Installation (Development)

#### For Chrome/Edge:

1. **Download the Extension**:
   ```bash
   git clone https://github.com/your-repo/ai-definition-widget.git
   cd ai-definition-widget
   ```

2. **Open Extension Management**:
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `ai-definition-widget` folder
   - The extension should now appear in your extensions list

#### For Firefox:

1. **Download the Extension** (same as above)

2. **Open Add-on Debugging**:
   - Navigate to `about:debugging#/runtime/this-firefox`

3. **Load Temporary Add-on**:
   - Click "Load Temporary Add-on..."
   - Navigate to the extension folder
   - Select the `manifest.json` file

## ⚙️ Initial Setup

### 1. Verify Installation

After installation, you should see the AI Definition Widget icon in your browser toolbar. If you don't see it:

- **Chrome/Edge**: Click the puzzle piece icon and pin the extension
- **Firefox**: Right-click the toolbar and customize to add the icon

### 2. Test Basic Functionality

1. Open the included `demo.html` file in your browser, or visit any webpage
2. Select a word like "photosynthesis" by highlighting it
3. The definition popup should appear on the right side of your screen
4. Try closing it with the X button or Escape key

### 3. Configure Settings

1. Click the extension icon in your toolbar
2. The settings popup will open
3. Configure your preferences:
   - **Enable Widget**: Keep this on for normal operation
   - **Auto-show on Selection**: Recommended for best experience
   - **Position**: Choose where the popup appears
   - **Theme**: Select auto, light, or dark mode
   - **API Provider**: Start with "Demo Mode" for testing

## 🔑 API Configuration (Optional)

For enhanced definitions, you can configure API providers:

### OpenAI GPT (Recommended for Best Results)

1. **Get an API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key

2. **Configure in Extension**:
   - Click the extension icon
   - Change "API Provider" to "OpenAI GPT"
   - Enter your API key in the text field
   - Click "Save Settings"

### Free Dictionary API (No Key Required)

1. **Configure in Extension**:
   - Click the extension icon
   - Change "API Provider" to "Free Dictionary API"
   - No API key needed
   - Click "Save Settings"

## 🧪 Testing Your Installation

### Quick Test Checklist

- [ ] Extension icon appears in toolbar
- [ ] Settings popup opens when clicked
- [ ] Text selection triggers definition popup
- [ ] Popup appears in correct position
- [ ] Copy and share buttons work
- [ ] Escape key closes popup
- [ ] Mobile/responsive behavior works

### Test on Different Websites

Try the extension on various sites to ensure compatibility:
- News websites (CNN, BBC, etc.)
- Wikipedia articles
- Blog posts
- Academic papers
- E-books or reading platforms

### Test Responsive Behavior

1. **Desktop**: Normal right-side positioning
2. **Tablet**: Adjust browser window to tablet size
3. **Mobile**: Use browser's mobile view or actual mobile device

## 🔧 Troubleshooting

### Extension Not Working

**Problem**: Widget doesn't appear when selecting text
**Solutions**:
- Refresh the webpage and try again
- Check if the extension is enabled in browser settings
- Verify the website allows content scripts (some sites block extensions)
- Try the demo.html file to confirm basic functionality

**Problem**: Extension icon not visible
**Solutions**:
- Check if extension is installed in `chrome://extensions/`
- Pin the extension to toolbar
- Restart your browser

### API Issues

**Problem**: Definitions not loading
**Solutions**:
- Check your internet connection
- Verify API key is correct (for OpenAI)
- Try switching to "Demo Mode" temporarily
- Check browser console for error messages

**Problem**: Slow definition loading
**Solutions**:
- Enable caching in settings
- Try a different API provider
- Check if you've exceeded API rate limits

### Display Issues

**Problem**: Popup appears in wrong position
**Solutions**:
- Adjust position setting in extension popup
- Try different position options
- Check for CSS conflicts with website
- Test on different websites

**Problem**: Popup too small/large on mobile
**Solutions**:
- The extension automatically adapts to screen size
- Try refreshing the page
- Check if website has viewport restrictions

## 🔄 Updating the Extension

### Store-Installed Extensions
- Updates happen automatically
- You'll get notifications for major updates
- Check extension details for version info

### Manually-Installed Extensions
1. Pull latest changes from repository
2. Reload extension in browser settings
3. Test functionality after update

## 🗑️ Uninstallation

### Complete Removal

1. **Remove Extension**:
   - Chrome/Edge: Go to extensions page, click "Remove"
   - Firefox: Go to Add-ons Manager, click "Remove"

2. **Clear Data** (Optional):
   - Extension data is automatically removed
   - API keys and cache are cleared
   - No manual cleanup needed

## 📞 Getting Help

If you encounter issues:

1. **Check this guide** for common solutions
2. **Visit the demo page** to test basic functionality
3. **Check browser console** for error messages
4. **Report issues** on [GitHub Issues](https://github.com/your-repo/ai-definition-widget/issues)
5. **Join discussions** on [GitHub Discussions](https://github.com/your-repo/ai-definition-widget/discussions)

## 🎉 You're Ready!

Congratulations! Your AI Definition Widget is now installed and configured. Start exploring the web with enhanced reading capabilities!

### Pro Tips:
- Try selecting phrases, not just individual words
- Use the copy button to save definitions for later
- Experiment with different API providers
- Adjust settings based on your reading habits

Happy reading! 📚✨