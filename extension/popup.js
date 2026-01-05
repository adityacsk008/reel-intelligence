// Reel Intelligence - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const settings = await chrome.storage.sync.get(['authToken', 'userEmail', 'apiUrl']);
  
  if (settings.authToken) {
    showMainSection();
    loadUserStats();
  } else {
    showLoginSection();
  }
  
  // Load settings
  loadSettings();
  
  // Event listeners
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('scanCurrentBtn').addEventListener('click', scanCurrentReel);
  document.getElementById('openDashboardBtn').addEventListener('click', openDashboard);
  document.getElementById('autoScanToggle').addEventListener('change', handleAutoScanToggle);
  document.getElementById('overlayToggle').addEventListener('change', handleOverlayToggle);
});

// Show login section
function showLoginSection() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('mainSection').classList.add('hidden');
}

// Show main section
function showMainSection() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('mainSection').classList.remove('hidden');
}

// Handle login
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const apiUrl = document.getElementById('apiUrl').value || 'http://localhost:5000/api';
  
  if (!email || !password) {
    showStatus('Please enter email and password', 'error');
    return;
  }
  
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Save credentials
    await chrome.storage.sync.set({
      authToken: data.data.token,
      userEmail: email,
      apiUrl: apiUrl,
      scanLimit: data.data.user.scanLimit,
      scansUsed: data.data.user.scansUsed
    });
    
    showStatus('Login successful!', 'success');
    
    setTimeout(() => {
      showMainSection();
      loadUserStats();
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    showStatus(error.message, 'error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

// Handle logout
async function handleLogout() {
  await chrome.storage.sync.clear();
  showLoginSection();
  showStatus('Logged out successfully', 'info');
}

// Load user stats
async function loadUserStats() {
  const settings = await chrome.storage.sync.get(['scanLimit', 'scansUsed']);
  
  const scannedCount = settings.scansUsed || 0;
  const scansRemaining = (settings.scanLimit || 100) - scannedCount;
  
  document.getElementById('scannedCount').textContent = scannedCount;
  document.getElementById('scansRemaining').textContent = scansRemaining;
}

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get(['autoScan', 'showOverlay']);
  
  document.getElementById('autoScanToggle').checked = settings.autoScan || false;
  document.getElementById('overlayToggle').checked = settings.showOverlay !== false;
}

// Handle auto-scan toggle
async function handleAutoScanToggle(e) {
  await chrome.storage.sync.set({ autoScan: e.target.checked });
  showStatus(
    e.target.checked ? 'Auto-scan enabled' : 'Auto-scan disabled',
    'info'
  );
}

// Handle overlay toggle
async function handleOverlayToggle(e) {
  await chrome.storage.sync.set({ showOverlay: e.target.checked });
  showStatus(
    e.target.checked ? 'Overlay enabled' : 'Overlay disabled',
    'info'
  );
  
  // Reload content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url.includes('instagram.com/reel')) {
    chrome.tabs.reload(tab.id);
  }
}

// Scan current reel
async function scanCurrentReel() {
  const scanBtn = document.getElementById('scanCurrentBtn');
  scanBtn.disabled = true;
  scanBtn.textContent = '⏳ Scanning...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url.includes('instagram.com/reel')) {
      throw new Error('Please open an Instagram Reel first');
    }
    
    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scanReel' });
    
    if (response.success) {
      showStatus('Reel scanned successfully!', 'success');
      
      // Update stats
      const settings = await chrome.storage.sync.get(['scansUsed']);
      await chrome.storage.sync.set({ scansUsed: (settings.scansUsed || 0) + 1 });
      loadUserStats();
    } else {
      throw new Error('Scan failed');
    }
    
  } catch (error) {
    console.error('Scan error:', error);
    showStatus(error.message, 'error');
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '📊 Scan Current Reel';
  }
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({ url: 'https://reel-intelligence.vercel.app/dashboard' });
}

// Show status message
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.textContent = message;
  statusDiv.className = `status status-${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}