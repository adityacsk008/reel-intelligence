// Reel Intelligence - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎬 Popup loaded');
  
  // Check if user is logged in
  const settings = await chrome.storage.sync.get(['authToken', 'userEmail', 'apiUrl']);
  
  console.log('Settings:', { hasToken: !!settings.authToken, email: settings.userEmail });
  
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
  
  console.log('✅ Event listeners attached');
});

// Show login section
function showLoginSection() {
  console.log('Showing login section');
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('mainSection').classList.add('hidden');
}

// Show main section
function showMainSection() {
  console.log('Showing main section');
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('mainSection').classList.remove('hidden');
}

// Handle login
async function handleLogin() {
  console.log('🔐 Login button clicked');
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const apiUrl = document.getElementById('apiUrl').value.trim() || 'http://localhost:5000/api';
  
  console.log('Login attempt:', { email, apiUrl });
  
  if (!email || !password) {
    showStatus('Please enter email and password', 'error');
    console.error('❌ Missing credentials');
    return;
  }
  
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  
  try {
    console.log('📡 Sending login request to:', `${apiUrl}/auth/login`);
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('✅ Login successful:', data);
    
    // Save credentials
    await chrome.storage.sync.set({
      authToken: data.data.token,
      userEmail: email,
      apiUrl: apiUrl,
      scanLimit: data.data.user.scanLimit,
      scansUsed: data.data.user.scansUsed
    });
    
    console.log('💾 Credentials saved');
    
    showStatus('Login successful!', 'success');
    
    setTimeout(() => {
      showMainSection();
      loadUserStats();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Show detailed error
    let errorMessage = error.message;
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Cannot connect to backend. Is it running on ' + apiUrl + '?';
    }
    
    showStatus(errorMessage, 'error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

// Handle logout
async function handleLogout() {
  console.log('🚪 Logging out');
  await chrome.storage.sync.clear();
  showLoginSection();
  showStatus('Logged out successfully', 'info');
}

// Load user stats
async function loadUserStats() {
  console.log('📊 Loading user stats');
  const settings = await chrome.storage.sync.get(['scanLimit', 'scansUsed']);
  
  const scannedCount = settings.scansUsed || 0;
  const scansRemaining = (settings.scanLimit || 100) - scannedCount;
  
  console.log('Stats:', { scannedCount, scansRemaining });
  
  document.getElementById('scannedCount').textContent = scannedCount;
  document.getElementById('scansRemaining').textContent = scansRemaining;
}

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get(['autoScan', 'showOverlay']);
  
  document.getElementById('autoScanToggle').checked = settings.autoScan || false;
  document.getElementById('overlayToggle').checked = settings.showOverlay !== false;
  
  console.log('⚙️ Settings loaded:', settings);
}

// Handle auto-scan toggle
async function handleAutoScanToggle(e) {
  console.log('🔄 Auto-scan toggled:', e.target.checked);
  await chrome.storage.sync.set({ autoScan: e.target.checked });
  showStatus(
    e.target.checked ? 'Auto-scan enabled' : 'Auto-scan disabled',
    'info'
  );
}

// Handle overlay toggle
async function handleOverlayToggle(e) {
  console.log('👁️ Overlay toggled:', e.target.checked);
  await chrome.storage.sync.set({ showOverlay: e.target.checked });
  showStatus(
    e.target.checked ? 'Overlay enabled' : 'Overlay disabled',
    'info'
  );
  
  // Reload content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url && tab.url.includes('instagram.com/reel')) {
    chrome.tabs.reload(tab.id);
  }
}

// Scan current reel
async function scanCurrentReel() {
  console.log('📊 Scan button clicked');
  
  const scanBtn = document.getElementById('scanCurrentBtn');
  scanBtn.disabled = true;
  scanBtn.textContent = '⏳ Scanning...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    console.log('Current tab:', tab?.url);
    
    if (!tab || !tab.url || !tab.url.includes('instagram.com/reel')) {
      throw new Error('Please open an Instagram Reel first');
    }
    
    console.log('📡 Sending scan message to content script');
    
    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scanReel' });
    
    console.log('Response from content script:', response);
    
    if (response && response.success) {
      showStatus('Reel scanned successfully!', 'success');
      
      // Update stats
      const settings = await chrome.storage.sync.get(['scansUsed']);
      await chrome.storage.sync.set({ scansUsed: (settings.scansUsed || 0) + 1 });
      loadUserStats();
    } else {
      throw new Error('Scan failed');
    }
    
  } catch (error) {
    console.error('❌ Scan error:', error);
    showStatus(error.message, 'error');
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '📊 Scan Current Reel';
  }
}

// Open dashboard
function openDashboard() {
  console.log('🌐 Opening dashboard');
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
}

// Show status message
function showStatus(message, type = 'info') {
  console.log(`📢 Status [${type}]:`, message);
  
  const statusDiv = document.getElementById('statusMessage');
  statusDiv.textContent = message;
  statusDiv.className = `status status-${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}