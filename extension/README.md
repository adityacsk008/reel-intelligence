# 🎬 Reel Intelligence - Chrome Extension

**Automatically scan Instagram Reel views and send to Reel Intelligence platform**

## ✨ Features

- 🎯 **Auto-Detect Views**: Automatically extracts view counts from Instagram Reels
- 📊 **Floating Overlay**: Beautiful overlay showing reel stats in real-time
- 🚀 **One-Click Scan**: Scan current reel with single click
- 🔄 **Auto-Scan Mode**: Automatically scan reels as you scroll
- 💾 **Direct Backend Sync**: Sends data directly to your Reel Intelligence account
- 🎨 **Dark Theme UI**: Matches Instagram's dark mode

---

## 📦 Installation

### Method 1: Load Unpacked (Development)

1. **Download Extension:**
   ```bash
   git clone https://github.com/adityacsk008/reel-intelligence.git
   cd reel-intelligence/extension
   ```

2. **Open Chrome Extensions:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)

3. **Load Extension:**
   - Click "Load unpacked"
   - Select the `extension` folder
   - Extension installed! ✅

### Method 2: Download ZIP

1. Download: [extension.zip](https://github.com/adityacsk008/reel-intelligence/archive/refs/heads/main.zip)
2. Extract the ZIP file
3. Follow Method 1 steps 2-3

---

## 🚀 How to Use

### Step 1: Login

1. Click extension icon in Chrome toolbar
2. Enter your Reel Intelligence credentials:
   - Email
   - Password
   - API URL (default: `http://localhost:5000/api`)
3. Click "Login"

### Step 2: Scan Reels

**Option A: Manual Scan**
1. Open any Instagram Reel
2. Click extension icon
3. Click "📊 Scan Current Reel"
4. Done! ✅

**Option B: Auto-Scan**
1. Enable "Auto-Scan" in extension popup
2. Browse Instagram Reels normally
3. Extension automatically scans each reel
4. View stats in dashboard

**Option C: Floating Overlay**
1. Open any Instagram Reel
2. See floating overlay on top-right
3. Click "Scan Reel" button
4. View count updates in real-time

---

## 🎯 Features Explained

### 1. Floating Overlay

Beautiful overlay appears on every Instagram Reel showing:
- Current view count
- Scan status
- Quick action buttons

### 2. Auto-Scan Mode

Enable in settings to automatically scan reels as you browse:
- No manual clicking needed
- Scans in background
- Updates dashboard in real-time

### 3. View Count Detection

Smart algorithm detects view counts using multiple methods:
- DOM element parsing
- Text pattern matching
- Handles K/M suffixes (e.g., "1.5M views")

### 4. Backend Integration

Directly sends data to your Reel Intelligence backend:
- Secure JWT authentication
- Real-time sync
- Automatic retry on failure

---

## ⚙️ Configuration

### API URL

Default: `http://localhost:5000/api`

For production:
```
https://your-backend-url.railway.app/api
```

### Settings

- **Auto-Scan**: Automatically scan reels while browsing
- **Show Overlay**: Display floating overlay on reels
- **Scans Remaining**: Track your scan limit

---

## 🔧 Development

### File Structure

```
extension/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── content.js          # Instagram page script
├── content.css         # Overlay styles
├── background.js       # Background service worker
└── icons/              # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Testing Locally

1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click "Reload" button on extension
4. Test on Instagram Reels

### Debug Console

- **Popup**: Right-click extension icon → "Inspect popup"
- **Content Script**: Open Instagram → F12 → Console
- **Background**: `chrome://extensions/` → "Inspect views: background page"

---

## 🐛 Troubleshooting

### Extension not detecting views

**Solution:**
- Refresh Instagram page
- Check if you're on a Reel page (URL contains `/reel/`)
- Open browser console for errors

### Login failed

**Solution:**
- Verify API URL is correct
- Check backend is running
- Verify credentials are correct

### Overlay not showing

**Solution:**
- Check "Show Overlay" is enabled in settings
- Refresh Instagram page
- Clear browser cache

### CORS errors

**Solution:**
- Update backend `CORS_ORIGIN` to include `chrome-extension://`
- Or use `CORS_ORIGIN=*` for development

---

## 🔐 Permissions

Extension requires these permissions:

- **activeTab**: Access current Instagram tab
- **storage**: Save login credentials
- **scripting**: Inject overlay on Instagram
- **host_permissions**: Access Instagram.com

All permissions are used only for core functionality. No data is collected or shared.

---

## 📊 Stats Tracking

Extension tracks:
- ✅ Number of reels scanned
- ✅ Scans remaining (based on account limit)
- ✅ Last scan status

All data is stored locally and synced with your Reel Intelligence account.

---

## 🎨 Screenshots

### Extension Popup
![Popup](https://via.placeholder.com/400x300?text=Extension+Popup)

### Floating Overlay
![Overlay](https://via.placeholder.com/400x300?text=Floating+Overlay)

### Auto-Scan Mode
![Auto-Scan](https://via.placeholder.com/400x300?text=Auto-Scan+Mode)

---

## 🚀 Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox extension support
- [ ] Bulk scan mode
- [ ] Export scanned reels
- [ ] Offline mode
- [ ] Custom overlay themes

---

## 📝 License

MIT License - see [LICENSE](../LICENSE)

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/adityacsk008/reel-intelligence/issues)
- **Docs**: [Main README](../README.md)

---

**Made with ❤️ for creators and agencies**

⭐ Star the repo if you find it useful!