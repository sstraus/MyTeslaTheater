/**
 * MyTeslaTheater - Framework Module
 * Core framework functions for UI interactions and application setup
 */

// Note: selectedCardColor is defined in operations.js
// Note: darkTheme is defined as a global variable
let darkTheme = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing application...');
  
  // Load user preferences (including filter settings)
  window.loadUserPreferences && window.loadUserPreferences();
  
  // Apply saved filter settings
  window.applyFilterSettings && window.applyFilterSettings();
  
  // Setup UI
  window.setupUI && window.setupUI();
  
  // Process URL parameters
  processURLParameters();
  
  // Load cards
  window.initializeCards && window.initializeCards();
  
  // Apply filters based on saved preferences
  window.updateCardVisibility && window.updateCardVisibility();
  
  // Check screen size
  checkScreenSize();
  
  // Update UI with preferences
  window.updateUIFromPreferences && window.updateUIFromPreferences();
  
  console.log('Application initialization complete');
});

// Setup fullscreen behavior and dialog
function setupFullscreenBehavior(isFromYoutube) {
  const fullscreenDialog = document.getElementById('fullscreen-dialog');
  const yesButton = document.getElementById('fullscreen-yes');
  const noButton = document.getElementById('fullscreen-no');
  const footer = document.getElementById('footer');
  
  let isFullscreen = false;

  // If not coming from YouTube, show fullscreen dialog
  if (!isFromYoutube) {
    if (fullscreenDialog) {
      fullscreenDialog.classList.remove('hidden');
    }
    
    if (yesButton) {
      yesButton.addEventListener('click', function() {
        // Use current URL for redirect
        const currentURL = window.location.href;
        location.href = 'https://www.youtube.com/redirect?q=' + encodeURIComponent(currentURL);
      });
      
      // Improve touch support
      yesButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
      });
    }
    
    if (noButton) {
      noButton.addEventListener('click', function() {
        if (fullscreenDialog) {
          fullscreenDialog.classList.add('hidden');
        }
      });
      
      // Improve touch support
      noButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
      });
    }
  } else {
    isFullscreen = true;
    if (footer) {
      footer.classList.add('padded-bottom');
    }
  }
}

// Setup color selector and related events
function setupColorSelector() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      selectedCardColor = color;
      
      // Update visual selection
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update colors of all cards
      updateCardColors();
      
      // Save preferences
      saveUserPreferences();
    });
    
    // Improve touch support
    option.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Prevent zoom on double tap
      this.click();
    });
  });
}

// Setup custom link buttons and events
function setupCustomLinkButtons() {
  // Add custom link button
  const addCustomLinkButton = document.getElementById('add-custom-link');
  if (addCustomLinkButton) {
    addCustomLinkButton.addEventListener('click', addCustomLink);
    
    // Improve touch support
    addCustomLinkButton.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  }
  
  // Toggle settings panel button
  const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
  if (toggleSettingsBtn) {
    toggleSettingsBtn.addEventListener('click', toggleSettingsPanel);
    
    // Touch support
    toggleSettingsBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  }
}

// Add a custom link to storage and display it
function addCustomLink() {
  const nameInput = document.getElementById('custom-link-name');
  const urlInput = document.getElementById('custom-link-url');
  const descInput = document.getElementById('custom-link-desc');
  const logoInput = document.getElementById('custom-link-logo');
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  const description = descInput.value.trim() || getLang('customLinkDefaultDesc');
  const logo = logoInput.value.trim() || 'assets/img/default-logo.png'; // Default logo
  
  // Validate required fields
  if (!name || !url) {
    alert(getLang('errorEmptyFields'));
    return;
  }
  
  // Validate URL format
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert(getLang('errorUrlRequired'));
    return;
  }
  
  // Create custom link object
  const customLink = {
    id: Date.now().toString(), // Unique ID based on timestamp
    name: name,
    url: url,
    description: description,
    logo: logo,
    custom: true
  };
  
  // Get existing custom links from storage
  const customLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
  
  // Add new custom link
  customLinks.push(customLink);
  
  // Save updated list back to storage
  localStorage.setItem('customLinks', JSON.stringify(customLinks));
  
  // Reset form
  nameInput.value = '';
  urlInput.value = '';
  descInput.value = '';
  logoInput.value = '';
  
  // Refresh display of custom links
  renderCustomLinksList();
  
  // Refresh cards to include new link
  createAllCards();
}

// Delete a custom link
function deleteCustomLink(linkId) {
  // Get existing custom links from storage
  let customLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
  
  // Remove the link with matching ID
  customLinks = customLinks.filter(link => link.id !== linkId);
  
  // Save updated list back to storage
  localStorage.setItem('customLinks', JSON.stringify(customLinks));
  
  // Refresh display of custom links
  renderCustomLinksList();
  
  // Refresh cards to remove deleted link
  createAllCards();
}

// Update active color selection
function updateSelectedColorOption() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    if (option.getAttribute('data-color') === selectedCardColor) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Update colors of all cards
function updateCardColors() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.backgroundColor = selectedCardColor;
  });
}

// Handle settings panel display
function toggleSettingsPanel() {
  // Call the implementation in ui-manager.js to avoid duplicate code
  // and ensure consistent behavior
  if (typeof window.uiManagerToggleSettingsPanel === 'function') {
    window.uiManagerToggleSettingsPanel();
  } else {
    // Fallback implementation if the ui-manager version isn't available
    const settingsPanel = document.getElementById('settings-panel');
    const toggleBtn = document.getElementById('toggle-settings-btn');
    
    if (!settingsPanel || !toggleBtn) {
      console.error('Settings panel or toggle button not found');
      return;
    }
    
    if (settingsPanel.classList.contains('hidden')) {
      settingsPanel.classList.remove('hidden');
      toggleBtn.textContent = getLang('hideCustomization');
    } else {
      settingsPanel.classList.add('hidden');
      toggleBtn.textContent = getLang('showCustomization');
    }
  }
}

// Update interface texts with current language
function updateUITexts() {
  // Update texts in input forms
  const elements = {
    'custom-link-name': 'addLinkNamePlaceholder',
    'custom-link-url': 'addLinkUrlPlaceholder',
    'custom-link-desc': 'addLinkDescPlaceholder',
    'custom-link-logo': 'addLinkLogoPlaceholder',
    'add-custom-link': 'addLinkButton',
    'toggle-settings-btn': 'showCustomization',
    'fullscreen-yes': 'yes',
    'fullscreen-no': 'no'
  };

  // Update placeholders and button texts
  for (const [id, messageKey] of Object.entries(elements)) {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === 'INPUT') {
        element.placeholder = getLang(messageKey);
      } else {
        element.textContent = getLang(messageKey);
      }
    }
  }

  // Update titles and subtitles in fullscreen dialog
  const fullscreenTitle = document.querySelector('#fullscreen-dialog h2');
  if (fullscreenTitle) {
    fullscreenTitle.textContent = getLang('fullscreenDialogTitle');
  }

  const fullscreenSubtitle = document.querySelector('#fullscreen-dialog p');
  if (fullscreenSubtitle) {
    fullscreenSubtitle.textContent = getLang('fullscreenDialogSubtitle');
  }

  // Update titles in settings panel
  const customizationTitle = document.querySelector('#settings-panel h2');
  if (customizationTitle) {
    customizationTitle.textContent = getLang('customizationTitle');
  }
  
  const cardColorTitle = document.querySelector('#settings-panel h3:first-of-type');
  if (cardColorTitle) {
    cardColorTitle.textContent = getLang('cardColorTitle');
  }
  
  const customLinkTitle = document.querySelector('.custom-link-form h3');
  if (customLinkTitle) {
    customLinkTitle.textContent = getLang('addLinkTitle');
  }

  const savedLinksTitle = document.querySelector('#custom-links-list h3');
  if (savedLinksTitle) {
    savedLinksTitle.textContent = getLang('savedCustomLinks');
  }
  
  // Update copyright in footer
  const footerCopyright = document.querySelector('#footer p');
  if (footerCopyright) {
    footerCopyright.textContent = getLang('footerCopyright');
  }
}

/**
 * MyTeslaTheater - Framework Module
 * Core UI functionality and initialization
 */

// Category filter state
categoryFilters = {
  paid: true,    // Default: show paid subscription sites
  free: true,    // Default: show free content sites
  social: true   // Default: show social media sites
};

// Initialize UI elements and event listeners
function initUI() {
  // Card color selection
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      selectedCardColor = this.getAttribute('data-color');
      updateSelectedColorOption();
      saveUserPreferences();
      generateCards();
    });
  });
  
  // Settings panel toggle
  const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
  if (toggleSettingsBtn) {
    toggleSettingsBtn.addEventListener('click', toggleSettingsPanel);
  }
  
  // Custom link form
  const addCustomLinkBtn = document.getElementById('add-custom-link');
  if (addCustomLinkBtn) {
    addCustomLinkBtn.addEventListener('click', addCustomLink);
  }
  
  // Create category filters
  createCategoryFilters();
  
  // Initialize JSONBlob functionality
  initJSONBlobBackup();
}

// Create category filter buttons
function createCategoryFilters() {
  const filterContainer = document.getElementById('category-filters');
  if (!filterContainer) return;
  
  // Clear any existing filters
  filterContainer.innerHTML = '';
  
  // Create filter buttons for each category
  const categories = [
    { id: 'paid', label: 'Paid Subscriptions', icon: '💰' },
    { id: 'free', label: 'Free Content', icon: '🆓' },
    { id: 'social', label: 'Social Media', icon: '👥' }
  ];
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-filter-btn ${categoryFilters[category.id] ? 'active' : ''}`;
    button.dataset.category = category.id;
    button.innerHTML = `${category.icon} ${category.label}`;
    
    button.addEventListener('click', function() {
      // Toggle the filter state
      categoryFilters[category.id] = !categoryFilters[category.id];
      
      // Update button appearance
      this.classList.toggle('active');
      
      // Save filter preferences
      saveUserPreferences();
      
      // Regenerate cards with new filter applied
      generateCards();
    });
    
    filterContainer.appendChild(button);
  });
  
  // Add a note about private cards
  const note = document.createElement('div');
  note.style.fontSize = '12px';
  note.style.opacity = '0.7';
  note.style.marginTop = '5px';
  note.style.width = '100%';
  note.style.textAlign = 'center';
  note.innerHTML = 'Private cards are always visible';
  
  filterContainer.appendChild(note);
}

// Show notification messages
function showNotification(message, isError = false) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    document.body.removeChild(notification);
  });
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'error' : 'success'}`;
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Initialize JSONBlob backup functionality
function initJSONBlobBackup() {
  const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
  const jsonBlobControls = document.getElementById('jsonblob-controls');
  const jsonBlobIdInput = document.getElementById('jsonblob-id');
  const loadJsonBlobBtn = document.getElementById('load-jsonblob');
  const jsonBlobShareLink = document.getElementById('jsonblob-share-link');
  
  if (!enableJsonBlobCheckbox || !jsonBlobControls || !jsonBlobIdInput || !loadJsonBlobBtn) return;
  
  // Check if JSONBlob is enabled in preferences
  const jsonBlobEnabled = userPreferences.jsonBlobEnabled || false;
  const jsonBlobId = userPreferences.jsonBlobId || '';
  
  // Set initial state
  enableJsonBlobCheckbox.checked = jsonBlobEnabled;
  jsonBlobIdInput.value = jsonBlobId;
  jsonBlobControls.classList.toggle('hidden', !jsonBlobEnabled);
  
  // Update share link if we have an ID
  if (jsonBlobId) {
    const bookmarkUrl = `${window.location.origin}${window.location.pathname}?jsonblob=${jsonBlobId}`;
    jsonBlobShareLink.href = bookmarkUrl;
    jsonBlobShareLink.textContent = 'Bookmark Link';
  }
  
  // Toggle JSONBlob functionality
  enableJsonBlobCheckbox.addEventListener('change', function() {
    const isEnabled = this.checked;
    jsonBlobControls.classList.toggle('hidden', !isEnabled);
    
    // Update preferences
    userPreferences.jsonBlobEnabled = isEnabled;
    saveUserPreferences();
    
    // If enabled and we have an ID, sync to JSONBlob
    if (isEnabled && jsonBlobId) {
      syncToJSONBlob(jsonBlobId);
    }
    
    // If enabled but no ID, create a new blob
    if (isEnabled && !jsonBlobId) {
      createNewJSONBlob();
    }
  });
  
  // Load data from JSONBlob
  loadJsonBlobBtn.addEventListener('click', function() {
    const id = jsonBlobIdInput.value.trim();
    if (id) {
      loadFromJSONBlob(id);
    } else {
      showNotification('Please enter a valid JSONBlob ID', true);
    }
  });
  
  // Check URL for JSONBlob ID parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlJsonBlobId = urlParams.get('jsonblob');
  
  if (urlJsonBlobId) {
    // If we have an ID in the URL, enable JSONBlob and load data
    enableJsonBlobCheckbox.checked = true;
    jsonBlobControls.classList.remove('hidden');
    jsonBlobIdInput.value = urlJsonBlobId;
    userPreferences.jsonBlobEnabled = true;
    userPreferences.jsonBlobId = urlJsonBlobId;
    saveUserPreferences();
    
    // Load data from the provided ID
    loadFromJSONBlob(urlJsonBlobId);
  } else if (jsonBlobEnabled && jsonBlobId) {
    // If JSONBlob is enabled and we have an ID, check for updates
    loadFromJSONBlob(jsonBlobId);
  }
}

// Helper function to determine if a color is light or dark
function isLightColor(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

/**
 * MyTeslaTheater - Framework Module
 * Handles UI components and base functions
 */

// Global settings and variables
// selectedCardColor declaration removed to fix duplicate variable error
// cardVisibilitySettings declaration removed to fix duplicate variable error
categoryFilters = {
  paid: true,
  free: true,
  social: true
};

// Initialize the application
function initApp() {
  // Load user preferences from storage
  loadUserPreferences();
  
  // Setup UI components
  initUIComponents();
  
  // Generate cards based on loaded preferences
  generateCards();
  
  // Check URL parameters
  checkURLParameters();
}

// Initialize UI components
function initUIComponents() {
  // Setup event listeners for settings panel toggle
  const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  
  if (toggleSettingsBtn && settingsPanel) {
    toggleSettingsBtn.addEventListener('click', function() {
      settingsPanel.classList.toggle('hidden');
      toggleSettingsBtn.textContent = settingsPanel.classList.contains('hidden') 
        ? 'Show Customization' 
        : 'Hide Customization';
    });
  }
  
  // Setup color selection
  initColorSelection();
  
  // Setup custom link form
  initCustomLinkForm();
  
  // Initialize category filter buttons
  initCategoryFilters();
  
  // Initialize JSONBlob backup feature
  initJSONBlobBackup();
}

// Initialize color selection
function initColorSelection() {
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      selectedCardColor = this.getAttribute('data-color');
      updateSelectedColorOption();
      generateCards();
      saveUserPreferences();
    });
  });
}

// Update selected color option
function updateSelectedColorOption() {
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    if (option.getAttribute('data-color') === selectedCardColor) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Initialize category filter buttons
function initCategoryFilters() {
  const categoryFiltersContainer = document.getElementById('category-filters');
  if (!categoryFiltersContainer) return;
  
  // Clear container
  categoryFiltersContainer.innerHTML = '';
  
  // Create filter buttons
  const categories = [
    { id: 'paid', label: 'Paid 💰', active: categoryFilters.paid },
    { id: 'free', label: 'Free 🆓', active: categoryFilters.free },
    { id: 'social', label: 'Social 👥', active: categoryFilters.social }
  ];
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-filter-btn ${category.active ? 'active' : ''}`;
    button.dataset.category = category.id;
    button.textContent = category.label;
    
    button.addEventListener('click', function() {
      // Toggle active state
      categoryFilters[category.id] = !categoryFilters[category.id];
      this.classList.toggle('active');
      
      // Regenerate cards with new filter
      generateCards();
      
      // Save the preferences
      saveUserPreferences();
    });
    
    categoryFiltersContainer.appendChild(button);
  });
}

// Initialize JSONBlob backup feature
function initJSONBlobBackup() {
  const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
  const jsonBlobControls = document.getElementById('jsonblob-controls');
  const jsonBlobIdInput = document.getElementById('jsonblob-id');
  const loadJsonBlobBtn = document.getElementById('load-jsonblob');
  
  // Setup info tooltip toggle
  const jsonBlobInfoBtn = document.querySelector('.info-icon');
  
  if (jsonBlobInfoBtn) {
    jsonBlobInfoBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const tooltip = this.querySelector('.info-tooltip');
      if (tooltip) {
        tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
      }
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', function() {
      const tooltip = jsonBlobInfoBtn.querySelector('.info-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    });
  }
  
  // Check for existing JSONBlob settings
  if (enableJsonBlobCheckbox && jsonBlobControls) {
    // Set initial state from preferences
    enableJsonBlobCheckbox.checked = userPreferences.jsonBlobEnabled;
    
    if (userPreferences.jsonBlobEnabled) {
      jsonBlobControls.classList.remove('hidden');
    }
    
    // Add event listener for checkbox
    enableJsonBlobCheckbox.addEventListener('change', function() {
      userPreferences.jsonBlobEnabled = this.checked;
      
      if (this.checked) {
        jsonBlobControls.classList.remove('hidden');
        
        // If no ID exists, create a new blob
        if (!userPreferences.jsonBlobId) {
          createNewJSONBlob();
        } else {
          syncToJSONBlob(userPreferences.jsonBlobId);
        }
      } else {
        jsonBlobControls.classList.add('hidden');
      }
      
      saveUserPreferences();
    });
  }
  
  // Setup JSONBlob ID input
  if (jsonBlobIdInput && userPreferences.jsonBlobId) {
    jsonBlobIdInput.value = userPreferences.jsonBlobId;
  }
  
  // Setup load button
  if (loadJsonBlobBtn && jsonBlobIdInput) {
    loadJsonBlobBtn.addEventListener('click', function() {
      const blobId = jsonBlobIdInput.value.trim();
      if (blobId) {
        loadFromJSONBlob(blobId);
      } else {
        showNotification('Please enter a valid JSONBlob ID', true);
      }
    });
  }
}

// Check URL parameters for JSONBlob ID
function checkURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const jsonBlobId = urlParams.get('jsonblob');
  
  if (jsonBlobId) {
    const jsonBlobIdInput = document.getElementById('jsonblob-id');
    const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
    const jsonBlobControls = document.getElementById('jsonblob-controls');
    
    if (jsonBlobIdInput) {
      jsonBlobIdInput.value = jsonBlobId;
    }
    
    if (enableJsonBlobCheckbox) {
      enableJsonBlobCheckbox.checked = true;
    }
    
    if (jsonBlobControls) {
      jsonBlobControls.classList.remove('hidden');
    }
    
    // Load data from the provided ID
    loadFromJSONBlob(jsonBlobId);
  }
}

// Helper function to check if a color is light
function isLightColor(color) {
  // Convert hex to RGB
  let hex = color.replace('#', '');
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using the formula
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // If brightness is greater than 128, color is light
  return brightness > 128;
}

// Show notification to user
function showNotification(message, isError = false) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'error' : 'success'}`;
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize the custom link form with event listeners
function initCustomLinkForm() {
  const customLinkForm = document.getElementById('custom-link-form');
  const addButton = document.getElementById('add-custom-link-btn');
  
  if (addButton) {
    addButton.addEventListener('click', function(e) {
      e.preventDefault();
      addCustomLink();
    });
  }
  
  // Initialize the custom links list display
  renderCustomLinksList();
}

// Render the saved custom links in the custom links list section
function renderCustomLinksList() {
  const customLinksList = document.getElementById('custom-links-list');
  if (!customLinksList) return;
  
  // Get existing custom links from storage
  const customLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
  
  if (customLinks.length === 0) {
    customLinksList.innerHTML = `<div class="no-links-message">${getLang('noCustomLinks')}</div>`;
    return;
  }
  
  // Create HTML for each custom link
  let html = '';
  customLinks.forEach(link => {
    html += `
      <div class="custom-link-item" data-id="${link.id}">
        <img src="${link.logo}" alt="${link.name}" class="custom-link-logo">
        <div class="custom-link-info">
          <div class="custom-link-name">${link.name}</div>
          <div class="custom-link-url">${link.url}</div>
        </div>
        <button class="delete-custom-link-btn" data-id="${link.id}">✕</button>
      </div>
    `;
  });
  
  customLinksList.innerHTML = html;
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-custom-link-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const linkId = this.getAttribute('data-id');
      deleteCustomLink(linkId);
    });
  });
}

// Document ready event listener
document.addEventListener('DOMContentLoaded', initApp);

// Initialize app
window.initializeApp = function() {
  // Load user preferences
  window.loadUserPreferences();
  
  // Set color theme based on preferences
  document.documentElement.style.setProperty('--card-color', window.selectedCardColor);
  window.updateSelectedColorOption();
  
  // Generate cards based on data
  window.generateCards();

  // Apply filter settings from user preferences
  window.applyFilterSettings && window.applyFilterSettings();
  
  // Setup event listeners
  setupEventListeners();
  
  // Set initial theme
  updateThemeBasedOnTime();
  
  // Apply card colors
  window.updateCardColors();
};