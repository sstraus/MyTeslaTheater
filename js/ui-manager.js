/**
 * MyTeslaTheater - UI Manager Module
 * Handle all UI interactions and display functions
 */

// Toggle fullscreen mode
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      showNotification('Error attempting to enable fullscreen mode: ' + err.message, true);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

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

// Update selected color option in the UI
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

// Toggle settings panel display
function toggleSettingsPanel() {
  const settingsPanel = document.getElementById('settings-panel');
  const toggleBtn = document.getElementById('toggle-settings-btn');
  
  if (!settingsPanel || !toggleBtn) {
    console.error('Settings panel or toggle button not found');
    return;
  }
  
  // Force browser to recalculate layout before toggling
  void settingsPanel.offsetHeight;
  
  if (settingsPanel.classList.contains('hidden')) {
    settingsPanel.classList.remove('hidden');
    toggleBtn.textContent = getLang('hideCustomization');
    toggleBtn.setAttribute('aria-expanded', 'true');
    console.log('Settings panel shown');
  } else {
    settingsPanel.classList.add('hidden');
    toggleBtn.textContent = getLang('showCustomization');
    toggleBtn.setAttribute('aria-expanded', 'false');
    console.log('Settings panel hidden');
  }
}

// Make toggleSettingsPanel available to other modules
window.uiManagerToggleSettingsPanel = toggleSettingsPanel;

// Toggle filter dialog display
function toggleFilterDialog() {
  const filterDialog = document.getElementById('filter-dialog');
  
  if (!filterDialog) {
    console.error('Filter dialog not found');
    return;
  }
  
  if (filterDialog.classList.contains('hidden')) {
    filterDialog.classList.remove('hidden');
    console.log('Filter dialog shown');
    
    // Sync the UI with current filter states
    document.querySelectorAll('.category-filter').forEach(filter => {
      const category = filter.getAttribute('data-category');
      const isActive = filter.getAttribute('data-active') === 'true';
      
      // Update UI to match current filter state
      if (isActive) {
        filter.classList.add('active');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
      } else {
        filter.classList.remove('active');
        filter.style.backgroundColor = '#1a1a1a';
        filter.style.opacity = '0.6';
      }
    });
    
    document.querySelectorAll('.country-filter').forEach(filter => {
      const country = filter.getAttribute('data-country');
      const isActive = filter.getAttribute('data-active') === 'true';
      
      // Update UI to match current filter state
      if (isActive) {
        filter.classList.add('active');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
      } else {
        filter.classList.remove('active');
        filter.style.backgroundColor = '#1a1a1a';
        filter.style.opacity = '0.6';
      }
    });
  } else {
    filterDialog.classList.add('hidden');
    console.log('Filter dialog hidden');
  }
}

// Make toggleFilterDialog available to other modules
window.uiManagerToggleFilterDialog = toggleFilterDialog;

// Toggle grid/list view
function toggleView() {
  const cardContainer = document.getElementById('card-container');
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  
  if (!cardContainer || !viewToggleBtn) return;
  
  if (cardContainer.classList.contains('list-view')) {
    cardContainer.classList.remove('list-view');
    viewToggleBtn.textContent = 'List View';
    localStorage.setItem('myteslatheater_view', 'grid');
  } else {
    cardContainer.classList.add('list-view');
    viewToggleBtn.textContent = 'Grid View';
    localStorage.setItem('myteslatheater_view', 'list');
  }
}

// Load the previously saved view (grid/list)
function loadSavedView() {
  const savedView = localStorage.getItem('myteslatheater_view');
  const cardContainer = document.getElementById('card-container');
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  
  if (!cardContainer || !viewToggleBtn) return;
  
  if (savedView === 'list') {
    cardContainer.classList.add('list-view');
    viewToggleBtn.textContent = 'Grid View';
  } else {
    cardContainer.classList.remove('list-view');
    viewToggleBtn.textContent = 'List View';
  }
}

// Toggle a specific panel's visibility
function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  
  // Close all other panels first
  document.querySelectorAll('.panel').forEach(p => {
    if (p.id !== panelId) {
      p.classList.add('hidden');
    }
  });
  
  // Toggle the requested panel
  panel.classList.toggle('hidden');
}

// Show notification message
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');
  
  if (!notification || !notificationText) return;
  
  notificationText.textContent = message;
  
  if (isError) {
    notification.classList.add('error');
  } else {
    notification.classList.remove('error');
  }
  
  notification.classList.add('visible');
  
  // Hide notification after timeout
  setTimeout(() => {
    notification.classList.remove('visible');
  }, 5000);
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
  
  // Toggle filter dialog button
  const filterCardsBtn = document.getElementById('filter-cards-btn');
  if (filterCardsBtn) {
    filterCardsBtn.addEventListener('click', toggleFilterDialog);
    
    // Touch support
    filterCardsBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  }
  
  // Setup filter dialog buttons
  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const closeFiltersBtn = document.getElementById('close-filters-btn');
  
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
      // Apply filters by updating data-active attributes based on active class
      document.querySelectorAll('.category-filter').forEach(filter => {
        const isActive = filter.classList.contains('active');
        filter.setAttribute('data-active', isActive.toString());
      });
      
      document.querySelectorAll('.country-filter').forEach(filter => {
        const isActive = filter.classList.contains('active');
        filter.setAttribute('data-active', isActive.toString());
      });
      
      // Apply filters to update card visibility
      window.updateCardVisibility();
      
      // Save preferences
      window.saveUserPreferences();
      
      // Close dialog after applying
      toggleFilterDialog();
    });
  }
  
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
      // Reset all filters to active state
      document.querySelectorAll('.category-filter, .country-filter').forEach(filter => {
        filter.classList.add('active');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
        filter.setAttribute('data-active', 'true');
      });
    });
  }
  
  if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener('click', toggleFilterDialog);
  }
}

// Generate options for the select dropdown
function generateSelectOptions(selectElement, options, selectedValue = null) {
  if (!selectElement) return;
  
  // Clear existing options
  selectElement.innerHTML = '';
  
  // Add new options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    
    if (selectedValue && option.value === selectedValue) {
      optionElement.selected = true;
    }
    
    selectElement.appendChild(optionElement);
  });
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

// Update UI texts with detected language
function updateUITexts() {
  // Update all text elements with data-lang attributes
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    element.textContent = getLang(key);
  });
  
  // Update placeholders for inputs
  document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
    const key = element.getAttribute('data-lang-placeholder');
    element.placeholder = getLang(key);
  });
  
  // Update button texts
  document.querySelectorAll('button[data-lang-text]').forEach(button => {
    const key = button.getAttribute('data-lang-text');
    button.textContent = getLang(key);
  });
  
  // Update specific elements without data attributes if needed
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  if (viewToggleBtn) {
    const cardContainer = document.getElementById('card-container');
    if (cardContainer && cardContainer.classList.contains('list-view')) {
      viewToggleBtn.textContent = getLang('gridView');
    } else {
      viewToggleBtn.textContent = getLang('listView');
    }
  }
}

// Handle JSONBlob UI interactions
function handleJSONBlobUI() {
  const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
  const jsonBlobControls = document.getElementById('jsonblob-controls');
  
  if (!enableJsonBlobCheckbox || !jsonBlobControls) return;
  
  // Show/hide controls based on checkbox state
  enableJsonBlobCheckbox.addEventListener('change', () => {
    if (enableJsonBlobCheckbox.checked) {
      jsonBlobControls.classList.remove('hidden');
      userPreferences.jsonBlobEnabled = true;
      
      // Create new JSONBlob if one doesn't exist
      if (!userPreferences.jsonBlobId) {
        createNewJSONBlob();
      }
    } else {
      jsonBlobControls.classList.add('hidden');
      userPreferences.jsonBlobEnabled = false;
      
      // Remove jsonblob parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('jsonblob');
      window.history.replaceState({}, '', url.toString());
    }
    
    saveUserPreferences();
  });
  
  // Initialize JSON Blob ID from URL parameter if present
  const urlParams = new URLSearchParams(window.location.search);
  const jsonBlobIdFromURL = urlParams.get('jsonblob');
  
  if (jsonBlobIdFromURL) {
    enableJsonBlobCheckbox.checked = true;
    jsonBlobControls.classList.remove('hidden');
    
    const jsonBlobIdInput = document.getElementById('jsonblob-id');
    if (jsonBlobIdInput) {
      jsonBlobIdInput.value = jsonBlobIdFromURL;
    }
    
    loadFromJSONBlob(jsonBlobIdFromURL);
  } else if (userPreferences.jsonBlobEnabled && userPreferences.jsonBlobId) {
    // If JSONBlob is enabled in preferences but not in URL
    enableJsonBlobCheckbox.checked = true;
    jsonBlobControls.classList.remove('hidden');
    
    const jsonBlobIdInput = document.getElementById('jsonblob-id');
    if (jsonBlobIdInput) {
      jsonBlobIdInput.value = userPreferences.jsonBlobId;
    }
  }
  
  // Handle create new JSONBlob button
  const createJsonBlobBtn = document.getElementById('create-jsonblob');
  if (createJsonBlobBtn) {
    createJsonBlobBtn.addEventListener('click', () => {
      createNewJSONBlob();
    });
  }
  
  // Handle load existing JSONBlob button
  const loadJsonBlobBtn = document.getElementById('load-jsonblob');
  const jsonBlobIdInput = document.getElementById('jsonblob-id');
  
  if (loadJsonBlobBtn && jsonBlobIdInput) {
    loadJsonBlobBtn.addEventListener('click', () => {
      const blobId = jsonBlobIdInput.value.trim();
      if (blobId) {
        loadFromJSONBlob(blobId);
      } else {
        showNotification('Please enter a valid JSONBlob ID', true);
      }
    });
  }
}

// Initialize UI components
function initializeUI() {
  console.log("Initializing UI components...");
  
  // Call all setup functions
  setupColorSelector();
  setupCustomLinkButtons();
  handleJSONBlobUI();
  
  // Add event listeners to filter options
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
  
  // Initialize manage cards button
  const manageVisibilityBtn = document.getElementById('manage-visibility-btn');
  if (manageVisibilityBtn) {
    manageVisibilityBtn.addEventListener('click', function() {
      const manageCardsDialog = document.getElementById('manage-cards-dialog');
      if (manageCardsDialog) {
        manageCardsDialog.classList.remove('hidden');
      }
    });
  }
  
  // Initialize manage cards dialog buttons
  const saveVisibilityBtn = document.getElementById('save-visibility-btn');
  const cancelVisibilityBtn = document.getElementById('cancel-visibility-btn');
  
  if (saveVisibilityBtn) {
    saveVisibilityBtn.addEventListener('click', function() {
      // Save visibility settings
      saveUserPreferences();
      const manageCardsDialog = document.getElementById('manage-cards-dialog');
      if (manageCardsDialog) {
        manageCardsDialog.classList.add('hidden');
      }
    });
  }
  
  if (cancelVisibilityBtn) {
    cancelVisibilityBtn.addEventListener('click', function() {
      const manageCardsDialog = document.getElementById('manage-cards-dialog');
      if (manageCardsDialog) {
        manageCardsDialog.classList.add('hidden');
      }
    });
  }
  
  console.log("UI initialization complete");
}

// Add the initialization to the window load event
window.addEventListener('DOMContentLoaded', function() {
  initializeUI();
});

// Make key functions accessible from window
window.toggleSettingsPanel = toggleSettingsPanel;
window.toggleFilterDialog = toggleFilterDialog;
window.showNotification = showNotification;
window.updateUITexts = updateUITexts;
window.setupColorSelector = setupColorSelector;