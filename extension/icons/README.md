# Extension Icons Placeholder

Since we cannot create actual PNG files through this interface, you have two options:

## Option 1: Use Text Icons (Quick Fix)

Update `manifest.json` to remove icon references temporarily:

```json
{
  "manifest_version": 3,
  "name": "Reel Intelligence Scanner",
  "version": "1.0.0",
  "description": "Automatically scan Instagram Reels views",
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": [
    "https://www.instagram.com/*",
    "https://instagram.com/*"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://www.instagram.com/reel/*",
        "https://instagram.com/reel/*"
      ],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ]
}
```

## Option 2: Create Icons Manually

1. **Create `icons` folder** inside `extension/`

2. **Download free icons from:**
   - https://www.flaticon.com/free-icon/video_3039386
   - Or use any 🎬 emoji as icon

3. **Create 3 sizes:**
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

4. **Or use online tool:**
   - Go to: https://www.favicon-generator.org/
   - Upload any image
   - Download all sizes
   - Rename to icon16.png, icon48.png, icon128.png

## Option 3: Use Emoji as Icon (Easiest)

1. Go to: https://favicon.io/emoji-favicons/clapper-board/
2. Download the favicon
3. Rename files to icon16.png, icon48.png, icon128.png
4. Put in `extension/icons/` folder

---

## Quick Test Without Icons

You can test the extension without icons by using the updated manifest above (Option 1).

The extension will work perfectly, just won't have a custom icon in the toolbar.