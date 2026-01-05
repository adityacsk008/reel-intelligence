// Reel Intelligence - Content Script
// Automatically detects and extracts Instagram Reel view counts

console.log('🎬 Reel Intelligence Scanner Active');

let currentReel = null;
let scanningEnabled = false;

// Check if scanning is enabled
chrome.storage.sync.get(['scanningEnabled', 'apiUrl', 'authToken'], (data) => {
  scanningEnabled = data.scanningEnabled || false;
  if (scanningEnabled) {
    console.log('✅ Auto-scanning enabled');
    initializeScanner();
  }
});

// Initialize the scanner
function initializeScanner() {
  // Create floating overlay
  createOverlay();
  
  // Start observing for reel changes
  observeReelChanges();
  
  // Extract current reel data
  extractReelData();
}

// Create floating overlay UI
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'reel-intelligence-overlay';
  overlay.innerHTML = `
    <div class="ri-overlay-content">
      <div class="ri-header">
        <span class="ri-logo">🎬</span>
        <span class="ri-title">Reel Intelligence</span>
      </div>
      <div class="ri-stats">
        <div class="ri-stat-item">
          <span class="ri-label">Views:</span>
          <span class="ri-value" id="ri-views">-</span>
        </div>
        <div class="ri-stat-item">
          <span class="ri-label">Status:</span>
          <span class="ri-status" id="ri-status">Ready</span>
        </div>
      </div>
      <div class="ri-actions">
        <button id="ri-scan-btn" class="ri-btn ri-btn-primary">
          <span class="ri-btn-icon">📊</span>
          Scan Reel
        </button>
        <button id="ri-toggle-btn" class="ri-btn ri-btn-secondary">
          <span class="ri-btn-icon">✓</span>
          <span id="ri-toggle-text">Selected</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Add event listeners
  document.getElementById('ri-scan-btn').addEventListener('click', scanCurrentReel);
  document.getElementById('ri-toggle-btn').addEventListener('click', toggleReelSelection);
}

// Extract reel data from page
function extractReelData() {
  try {
    // Get reel ID from URL
    const urlParts = window.location.pathname.split('/');
    const reelId = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
    
    // Get view count - Instagram uses different selectors
    let viewCount = 0;
    
    // Try multiple selectors for view count
    const viewSelectors = [
      'span.x193iq5w span',
      'span._ac2a',
      'span.html-span',
      'div._aacl._aaco._aacu._aacx._aad6._aade span'
    ];
    
    for (const selector of viewSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent.trim();
        // Check if text contains "views" or numbers with K/M
        if (text.includes('views') || /[\d,]+[KM]?\s*views?/i.test(text)) {
          viewCount = parseViewCount(text);
          if (viewCount > 0) break;
        }
      }
      if (viewCount > 0) break;
    }
    
    // Fallback: Try to find any number followed by "views"
    if (viewCount === 0) {
      const bodyText = document.body.innerText;
      const viewMatch = bodyText.match(/([\d,]+(?:\.\d+)?[KM]?)\s*views?/i);
      if (viewMatch) {
        viewCount = parseViewCount(viewMatch[1]);
      }
    }
    
    currentReel = {
      reelId: reelId,
      reelUrl: window.location.href,
      viewCount: viewCount,
      timestamp: new Date().toISOString()
    };
    
    // Update overlay
    updateOverlay(viewCount);
    
    console.log('📊 Reel Data:', currentReel);
    
    return currentReel;
    
  } catch (error) {
    console.error('❌ Error extracting reel data:', error);
    return null;
  }
}

// Parse view count from text (handles K, M suffixes)
function parseViewCount(text) {
  if (!text) return 0;
  
  // Remove commas and spaces
  text = text.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
  
  // Extract number
  const match = text.match(/([\d.]+)([km])?/i);
  if (!match) return 0;
  
  let number = parseFloat(match[1]);
  const suffix = match[2];
  
  if (suffix === 'k') {
    number *= 1000;
  } else if (suffix === 'm') {
    number *= 1000000;
  }
  
  return Math.round(number);
}

// Update overlay with current data
function updateOverlay(viewCount) {
  const viewsElement = document.getElementById('ri-views');
  if (viewsElement) {
    viewsElement.textContent = viewCount > 0 ? viewCount.toLocaleString() : 'Not found';
  }
}

// Scan current reel and send to backend
async function scanCurrentReel() {
  const statusElement = document.getElementById('ri-status');
  const scanBtn = document.getElementById('ri-scan-btn');
  
  try {
    statusElement.textContent = 'Scanning...';
    statusElement.style.color = '#fbbf24';
    scanBtn.disabled = true;
    
    // Extract fresh data
    const reelData = extractReelData();
    
    if (!reelData || reelData.viewCount === 0) {
      throw new Error('Could not extract view count');
    }
    
    // Get API settings
    const settings = await chrome.storage.sync.get(['apiUrl', 'authToken']);
    
    if (!settings.authToken) {
      throw new Error('Please login first');
    }
    
    // Send to backend
    const response = await fetch(`${settings.apiUrl}/reels/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.authToken}`
      },
      body: JSON.stringify({
        reels: [reelData]
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send data');
    }
    
    const result = await response.json();
    
    statusElement.textContent = '✓ Scanned';
    statusElement.style.color = '#10b981';
    
    // Show success notification
    showNotification('Reel scanned successfully!', 'success');
    
    console.log('✅ Scan result:', result);
    
  } catch (error) {
    console.error('❌ Scan error:', error);
    statusElement.textContent = '✗ Error';
    statusElement.style.color = '#ef4444';
    showNotification(error.message, 'error');
  } finally {
    scanBtn.disabled = false;
    setTimeout(() => {
      statusElement.textContent = 'Ready';
      statusElement.style.color = '#94a3b8';
    }, 3000);
  }
}

// Toggle reel selection
function toggleReelSelection() {
  const toggleBtn = document.getElementById('ri-toggle-btn');
  const toggleText = document.getElementById('ri-toggle-text');
  const isSelected = toggleBtn.classList.contains('selected');
  
  if (isSelected) {
    toggleBtn.classList.remove('selected');
    toggleText.textContent = 'Select';
  } else {
    toggleBtn.classList.add('selected');
    toggleText.textContent = 'Selected';
    
    // Auto-scan if enabled
    chrome.storage.sync.get(['autoScan'], (data) => {
      if (data.autoScan) {
        scanCurrentReel();
      }
    });
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `ri-notification ri-notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Observe reel changes (when user scrolls to next reel)
function observeReelChanges() {
  let lastUrl = window.location.href;
  
  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('🔄 Reel changed');
      
      // Wait for content to load
      setTimeout(() => {
        extractReelData();
      }, 1000);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractReel') {
    const data = extractReelData();
    sendResponse({ success: true, data: data });
  } else if (request.action === 'scanReel') {
    scanCurrentReel();
    sendResponse({ success: true });
  }
  return true;
});