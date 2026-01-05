// Reel Intelligence - Background Service Worker

console.log('🎬 Reel Intelligence Background Service Active');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('✅ Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      autoScan: false,
      showOverlay: true,
      apiUrl: 'http://localhost:5000/api'
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://github.com/adityacsk008/reel-intelligence'
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reelScanned') {
    console.log('✅ Reel scanned:', request.data);
    
    // Update badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 3000);
    
    sendResponse({ success: true });
  }
  
  return true;
});

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanReel',
    title: 'Scan This Reel',
    contexts: ['page'],
    documentUrlPatterns: ['*://www.instagram.com/reel/*', '*://instagram.com/reel/*']
  });
  
  chrome.contextMenus.create({
    id: 'openDashboard',
    title: 'Open Dashboard',
    contexts: ['action']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scanReel') {
    chrome.tabs.sendMessage(tab.id, { action: 'scanReel' });
  } else if (info.menuItemId === 'openDashboard') {
    chrome.tabs.create({ url: 'https://reel-intelligence.vercel.app/dashboard' });
  }
});