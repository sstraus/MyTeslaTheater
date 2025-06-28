/**
 * MyTeslaTheater - Storage Module
 * Handles localStorage and JSONBlob backup functionality
 */

// Debug flag to enable/disable logging
let DEBUG_STORAGE = false;

// Enable storage debugging through console or URL parameter
function enableStorageDebug() {
  DEBUG_STORAGE = true;
  console.log('[STORAGE] Debug mode enabled');
  return 'Storage debug mode enabled';
}

// Disable storage debugging
function disableStorageDebug() {
  DEBUG_STORAGE = false;
  console.log('[STORAGE] Debug mode disabled');
  return 'Storage debug mode disabled';
}

// Toggle storage debugging - can be called from the console with toggleStorageDebug()
function toggleStorageDebug() {
  DEBUG_STORAGE = !DEBUG_STORAGE;
  console.log(`[STORAGE] Debug mode ${DEBUG_STORAGE ? 'enabled' : 'disabled'}`);
  return `Storage debug mode ${DEBUG_STORAGE ? 'enabled' : 'disabled'}`;
}

// Check for debug parameter in URL
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug')) {
    const debugParam = urlParams.get('debug');
    // Enable debugging if 'storage' is in the debug parameter (allows for multiple debug types)
    if (debugParam.includes('storage') || debugParam === 'all') {
      enableStorageDebug();
    }
  }
})();

// User preferences default structure
window.userPreferences = {
  cardColor: '#1f1f1f',
  cardsVisibility: {}, // Holds the visibility state of each card
  categoryFilters: ['paid', 'free', 'social'], // Default all categories visible
  countryFilters: ['intl', 'us', 'uk', 'de', 'fr', 'it', 'es'], // Default all countries visible
  customLinks: [] // Array to store custom links
};

// Helper function to log debug messages
function logStorage(action, data) {
  if (DEBUG_STORAGE) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS format
    console.log(`%c[STORAGE ${timestamp}]%c ${action}:`, 'color: #0066cc; font-weight: bold;', 'color: #333;', data);
  }
}

// Add debug info to console on page load
(function() {
  console.info('Storage debugging can be enabled with enableStorageDebug() or by adding ?debug=storage to the URL');
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug')) {
    const debugParam = urlParams.get('debug');
    // Enable debugging if 'storage' is in the debug parameter (allows for multiple debug types)
    if (debugParam.includes('storage') || debugParam === 'all') {
      enableStorageDebug();
    }
  }
})();

// Load user preferences from localStorage
window.loadUserPreferences = function() {
  try {
    // Load the consolidated preferences first
    const savedPrefs = localStorage.getItem('myteslatheater_preferences');
    
    if (savedPrefs) {
      const loadedPrefs = JSON.parse(savedPrefs);
      logStorage('Loading consolidated preferences', loadedPrefs);
      
      // Update userPreferences object with saved values
      if (loadedPrefs.selectedColor) window.selectedCardColor = loadedPrefs.selectedColor;
      if (loadedPrefs.cardVisibility) window.cardVisibilitySettings = loadedPrefs.cardVisibility;
      if (loadedPrefs.cardOrder) window.cardOrder = loadedPrefs.cardOrder;
      if (loadedPrefs.customLinks) window.customLinks = loadedPrefs.customLinks;
      
      // Load filter states into the userPreferences object
      if (loadedPrefs.categoryFilters) window.userPreferences.categoryFilters = loadedPrefs.categoryFilters;
      if (loadedPrefs.countryFilters) window.userPreferences.countryFilters = loadedPrefs.countryFilters;
      
      logStorage('Loaded filters from consolidated preferences', {
        categoryFilters: window.userPreferences.categoryFilters,
        countryFilters: window.userPreferences.countryFilters
      });
    }
    
    // For backward compatibility, also check the legacy format
    const legacyPrefs = localStorage.getItem('userPreferences');
    if (legacyPrefs) {
      const legacyData = JSON.parse(legacyPrefs);
      logStorage('Loading legacy preferences', legacyData);
      
      // If we have category/country filters in the legacy format but not in the new format, use those
      if (legacyData.activeCategoryFilters && (!window.userPreferences.categoryFilters || window.userPreferences.categoryFilters.length === 0)) {
        window.userPreferences.categoryFilters = legacyData.activeCategoryFilters;
        logStorage('Using legacy category filters', legacyData.activeCategoryFilters);
      }
      
      if (legacyData.activeCountryFilters && (!window.userPreferences.countryFilters || window.userPreferences.countryFilters.length === 0)) {
        window.userPreferences.countryFilters = legacyData.activeCountryFilters;
        logStorage('Using legacy country filters', legacyData.activeCountryFilters);
      }
    }
    
    logStorage('Final loaded preferences', window.userPreferences);
    
    // Apply the saved filter settings after loading all preferences
    // Use a timeout to ensure the DOM is fully ready and filter buttons are created
    setTimeout(() => {
      if (window.applyFilterSettings) {
        window.applyFilterSettings();
        logStorage('Filter settings applied from loadUserPreferences', {
          categoryFilters: window.userPreferences.categoryFilters,
          countryFilters: window.userPreferences.countryFilters
        });
      } else {
        console.warn('applyFilterSettings function not available yet');
        // Try again after a longer delay
        setTimeout(() => {
          if (window.applyFilterSettings) {
            window.applyFilterSettings();
            logStorage('Filter settings applied with extended delay', {
              categoryFilters: window.userPreferences.categoryFilters,
              countryFilters: window.userPreferences.countryFilters
            });
          } else {
            console.error('Failed to apply filter settings, function not available');
          }
        }, 500);
      }
    }, 250);
    
  } catch (error) {
    console.error('Error loading user preferences:', error);
    logStorage('Error in loadUserPreferences', error);
  }
}

// Save user preferences to localStorage
window.saveUserPreferences = function() {
  logStorage('Saving preferences', 'Started');
  
  // Get current filter states from DOM
  const activeCategories = [];
  document.querySelectorAll('.category-filter').forEach(button => {
    if (button.getAttribute('data-active') === 'true') {
      activeCategories.push(button.getAttribute('data-category'));
    }
  });
  
  const activeCountries = [];
  document.querySelectorAll('.country-filter').forEach(button => {
    if (button.getAttribute('data-active') === 'true') {
      activeCountries.push(button.getAttribute('data-country'));
    }
  });
  
  // Create an object to store all preferences
  const prefsToSave = {
    selectedColor: window.selectedCardColor,
    cardVisibility: window.cardVisibilitySettings,
    cardOrder: window.cardOrder,
    customLinks: window.customLinks,
    categoryFilters: activeCategories,
    countryFilters: activeCountries
  };
  
  // Update the userPreferences object for other functions to use
  window.userPreferences.categoryFilters = activeCategories;
  window.userPreferences.countryFilters = activeCountries;
  
  // Save to localStorage - using a consistent storage key
  localStorage.setItem('myteslatheater_preferences', JSON.stringify(prefsToSave));
  
  // Also save a simplified version for backward compatibility
  const simplePrefs = {
    activeCategoryFilters: activeCategories,
    activeCountryFilters: activeCountries
  };
  localStorage.setItem('userPreferences', JSON.stringify(simplePrefs));
  
  logStorage('Preferences saved to localStorage', prefsToSave);
}

// Create a new JSONBlob
function createNewJSONBlob() {
  logStorage('Creating new JSONBlob', 'Started');
  
  fetch('https://jsonblob.com/api/jsonBlob', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userPreferences)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to create JSONBlob');
    }
    
    // Extract the blob ID from Location header
    const locationHeader = response.headers.get('Location');
    if (locationHeader) {
      const blobId = locationHeader.split('/').pop();
      userPreferences.jsonBlobId = blobId;
      
      logStorage('JSONBlob created', blobId);
      
      // Update input field
      const jsonBlobIdInput = document.getElementById('jsonblob-id');
      if (jsonBlobIdInput) {
        jsonBlobIdInput.value = blobId;
      }
      
      // Update URL for bookmarking
      updateURLWithJsonBlobId(blobId);
      
      // Save preferences
      saveUserPreferences();
      
      showNotification('JSONBlob created successfully. Bookmark this page to save your settings!');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error creating JSONBlob:', error);
    logStorage('Error creating JSONBlob', error.message);
    showNotification('Failed to create JSONBlob: ' + error.message, true);
  });
}

// Sync preferences to JSONBlob
function syncToJSONBlob(blobId) {
  if (!blobId) return;
  
  logStorage('Syncing to JSONBlob', blobId);
  
  fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userPreferences)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update JSONBlob');
    }
    logStorage('JSONBlob updated successfully', blobId);
    return response.json();
  })
  .then(data => {
    console.log('JSONBlob updated successfully');
  })
  .catch(error => {
    console.error('Error updating JSONBlob:', error);
    logStorage('Error updating JSONBlob', error.message);
    
    // If the blob doesn't exist anymore, create a new one
    if (error.message.includes('404')) {
      showNotification('JSONBlob expired. Creating a new one...', true);
      createNewJSONBlob();
    } else {
      showNotification('Failed to update JSONBlob: ' + error.message, true);
    }
  });
}

// Load preferences from JSONBlob
function loadFromJSONBlob(blobId) {
  if (!blobId) return;
  
  logStorage('Loading from JSONBlob', blobId);
  
  fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load JSONBlob');
    }
    return response.json();
  })
  .then(data => {
    logStorage('JSONBlob loaded successfully', data);
    
    // Update preferences
    userPreferences = { ...userPreferences, ...data };
    userPreferences.jsonBlobId = blobId;
    userPreferences.jsonBlobEnabled = true;
    
    // Update UI
    selectedCardColor = userPreferences.selectedColor || '#1f1f1f';
    cardVisibilitySettings = userPreferences.cardVisibility || {};
    
    // Set category filters
    if (userPreferences.categoryFilters) {
      categoryFilters = userPreferences.categoryFilters;
    }
    
    // Update color selection UI
    updateSelectedColorOption();
    
    // Update category filter buttons
    updateCategoryFilterButtons();
    
    // Update visible cards
    generateCards();
    
    // Update URL for bookmarking
    updateURLWithJsonBlobId(blobId);
    
    // Update JSONBlob UI controls
    const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
    const jsonBlobControls = document.getElementById('jsonblob-controls');
    
    if (enableJsonBlobCheckbox) {
      enableJsonBlobCheckbox.checked = true;
    }
    
    if (jsonBlobControls) {
      jsonBlobControls.classList.remove('hidden');
    }
    
    // Save to localStorage
    saveUserPreferences();
    
    showNotification('JSONBlob loaded successfully');
  })
  .catch(error => {
    console.error('Error loading JSONBlob:', error);
    logStorage('Error loading JSONBlob', error.message);
    showNotification('Failed to load JSONBlob: ' + error.message, true);
  });
}

// Sync from JSONBlob to ensure it doesn't expire
function syncFromJSONBlob(blobId) {
  if (!blobId) return;
  
  logStorage('Syncing from JSONBlob', blobId);
  
  fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to access JSONBlob');
    }
    
    // Successfully accessed the blob, which resets the expiry time
    logStorage('JSONBlob accessed successfully', 'Expiry time reset');
    
    // Update URL for bookmarking
    updateURLWithJsonBlobId(blobId);
    
    return response.json();
  })
  .catch(error => {
    console.error('Error accessing JSONBlob:', error);
    logStorage('Error accessing JSONBlob', error.message);
    
    // If the blob doesn't exist anymore, create a new one
    if (error.message.includes('404')) {
      showNotification('JSONBlob expired. Creating a new one...', true);
      userPreferences.jsonBlobId = '';
      createNewJSONBlob();
    }
  });
}

// Update URL with JSONBlob ID for bookmarking
function updateURLWithJsonBlobId(blobId) {
  if (!blobId) return;
  
  logStorage('Updating URL with JSONBlob ID', blobId);
  
  const url = new URL(window.location.href);
  url.searchParams.set('jsonblob', blobId);
  
  // Update URL without reloading page
  window.history.replaceState({}, '', url.toString());
}

// Update category filter buttons based on preferences
function updateCategoryFilterButtons() {
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  
  categoryButtons.forEach(button => {
    const category = button.dataset.category;
    if (category && categoryFilters[category]) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Apply saved filter settings when the page loads
window.applyFilterSettings = function() {
  if (!window.userPreferences) return;
  
  logStorage('Applying filter settings', window.userPreferences);
  
  // Apply category filter states
  if (window.userPreferences.categoryFilters && Array.isArray(window.userPreferences.categoryFilters)) {
    const categoryFilters = document.querySelectorAll('.category-filter');
    
    // First set all filters to inactive
    categoryFilters.forEach(filter => {
      filter.setAttribute('data-active', 'false');
      filter.classList.remove('active');
      filter.style.backgroundColor = '#1a1a1a';
      filter.style.opacity = '0.6';
    });
    
    // Then activate only the ones in the saved preferences
    categoryFilters.forEach(filter => {
      const category = filter.getAttribute('data-category');
      if (category && window.userPreferences.categoryFilters.includes(category)) {
        filter.setAttribute('data-active', 'true');
        filter.classList.add('active');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
      }
    });
  }
  
  // Apply country filter states
  if (window.userPreferences.countryFilters && Array.isArray(window.userPreferences.countryFilters)) {
    const countryFilters = document.querySelectorAll('.country-filter');
    
    // First set all filters to inactive
    countryFilters.forEach(filter => {
      filter.setAttribute('data-active', 'false');
      filter.classList.remove('active');
      filter.style.backgroundColor = '#1a1a1a';
      filter.style.opacity = '0.6';
    });
    
    // Then activate only the ones in the saved preferences
    countryFilters.forEach(filter => {
      const country = filter.getAttribute('data-country');
      if (country && window.userPreferences.countryFilters.includes(country)) {
        filter.setAttribute('data-active', 'true');
        filter.classList.add('active');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
      }
    });
  }
  
  // Update card visibility based on restored filters
  setTimeout(() => {
    if (window.updateCardVisibility) {
      window.updateCardVisibility();
      logStorage('Card visibility updated based on filters', window.userPreferences);
    } else {
      console.warn('updateCardVisibility function not available');
      // Try again after a short delay
      setTimeout(() => {
        if (window.updateCardVisibility) {
          window.updateCardVisibility();
          logStorage('Card visibility updated with delay', window.userPreferences);
        }
      }, 200);
    }
  }, 100);
};