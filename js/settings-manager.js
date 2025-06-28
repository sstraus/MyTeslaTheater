/**
 * MyTeslaTheater - Settings Manager Module
 * Handle user preferences, settings storage and retrieval
 */

// Global variables
let userPreferences = {
  cardColor: '#444444',
  customLinks: [],
  visibilitySettings: {},
  cardOrder: {},
  jsonBlobEnabled: false,
  jsonBlobId: null
};

// Save user preferences in localStorage
function saveUserPreferences() {
  localStorage.setItem('myteslatheater_preferences', JSON.stringify(userPreferences));
  
  // If JSONBlob is enabled, save to JSONBlob as well
  if (userPreferences.jsonBlobEnabled && userPreferences.jsonBlobId) {
    saveToJSONBlob(userPreferences.jsonBlobId);
  }
}

// Load user preferences from localStorage
function loadUserPreferences() {
  const savedPrefs = localStorage.getItem('myteslatheater_preferences');
  
  if (savedPrefs) {
    try {
      const preferences = JSON.parse(savedPrefs);
      
      // Load custom links
      if (preferences.customLinks) {
        userPreferences.customLinks = preferences.customLinks;
      }
      
      // Load card visibility settings
      if (preferences.visibilitySettings) {
        userPreferences.visibilitySettings = preferences.visibilitySettings;
      }
      
      // Load selected color
      if (preferences.cardColor) {
        userPreferences.cardColor = preferences.cardColor;
        document.documentElement.style.setProperty('--card-color', preferences.cardColor);
      }
      
      // Load custom card order
      if (preferences.cardOrder) {
        userPreferences.cardOrder = preferences.cardOrder;
      }
      
      // Load JSONBlob settings
      if (preferences.jsonBlobEnabled !== undefined) {
        userPreferences.jsonBlobEnabled = preferences.jsonBlobEnabled;
      }
      
      if (preferences.jsonBlobId) {
        userPreferences.jsonBlobId = preferences.jsonBlobId;
      }
      
      // Update global variables for backward compatibility
      selectedCardColor = userPreferences.cardColor;
      customLinks = userPreferences.customLinks;
      cardVisibilitySettings = userPreferences.visibilitySettings;
      cardOrder = userPreferences.cardOrder;
      
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }
  
  // Apply preferences to UI
  updateSelectedColorOption();
  updateCardColors();
}

// Create a new JSONBlob for storing preferences
function createNewJSONBlob() {
  showNotification('Creating new JSONBlob...');
  
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
      throw new Error('Network response was not ok');
    }
    
    // Extract the blob ID from the Location header
    const location = response.headers.get('Location');
    if (location) {
      const blobId = location.split('/').pop();
      userPreferences.jsonBlobId = blobId;
      
      // Update the UI with the new blob ID
      const jsonBlobIdInput = document.getElementById('jsonblob-id');
      if (jsonBlobIdInput) {
        jsonBlobIdInput.value = blobId;
      }
      
      // Update URL with jsonblob parameter
      const url = new URL(window.location.href);
      url.searchParams.set('jsonblob', blobId);
      window.history.replaceState({}, '', url.toString());
      
      saveUserPreferences();
      showNotification('New JSONBlob created! ID: ' + blobId);
    }
  })
  .catch(error => {
    console.error('Error creating JSONBlob:', error);
    showNotification('Error creating JSONBlob: ' + error.message, true);
  });
}

// Save preferences to JSONBlob
function saveToJSONBlob(blobId) {
  if (!blobId) return;
  
  fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userPreferences)
  })
  .catch(error => {
    console.error('Error saving to JSONBlob:', error);
  });
}

// Load preferences from JSONBlob
function loadFromJSONBlob(blobId) {
  if (!blobId) return;
  
  showNotification('Loading settings from JSONBlob...');
  
  fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load JSONBlob: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Update preferences with loaded data
      userPreferences = { ...userPreferences, ...data };
      
      // Update global variables for backward compatibility
      selectedCardColor = userPreferences.cardColor;
      customLinks = userPreferences.customLinks;
      cardVisibilitySettings = userPreferences.visibilitySettings;
      cardOrder = userPreferences.cardOrder;
      
      // Update UI
      document.documentElement.style.setProperty('--card-color', userPreferences.cardColor);
      updateSelectedColorOption();
      
      // Update URL with jsonblob parameter
      const url = new URL(window.location.href);
      url.searchParams.set('jsonblob', blobId);
      window.history.replaceState({}, '', url.toString());
      
      // Store the blob ID
      userPreferences.jsonBlobId = blobId;
      userPreferences.jsonBlobEnabled = true;
      
      // Update UI
      renderCustomLinksList();
      generateCards();
      
      showNotification('Settings loaded from JSONBlob successfully!');
      
      // Save to localStorage
      saveUserPreferences();
    })
    .catch(error => {
      console.error('Error loading from JSONBlob:', error);
      showNotification('Error loading from JSONBlob: ' + error.message, true);
    });
}

// Export settings as a JSON file
function exportSettings() {
  const dataStr = JSON.stringify(userPreferences, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'myteslatheater_settings.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import settings from a JSON file
function importSettings(fileInput) {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedSettings = JSON.parse(e.target.result);
      
      // Validate imported data structure
      if (!importedSettings || typeof importedSettings !== 'object') {
        throw new Error('Invalid settings format');
      }
      
      // Update preferences with imported data
      userPreferences = { ...userPreferences, ...importedSettings };
      
      // Update global variables for backward compatibility
      selectedCardColor = userPreferences.cardColor;
      customLinks = userPreferences.customLinks;
      cardVisibilitySettings = userPreferences.visibilitySettings;
      cardOrder = userPreferences.cardOrder;
      
      // Update UI
      document.documentElement.style.setProperty('--card-color', userPreferences.cardColor);
      updateSelectedColorOption();
      renderCustomLinksList();
      generateCards();
      
      // Save to localStorage
      saveUserPreferences();
      
      showNotification('Settings imported successfully!');
    } catch (error) {
      console.error('Error importing settings:', error);
      showNotification('Error importing settings: ' + error.message, true);
    }
  };
  reader.readAsText(file);
}

// Reset all settings to default
function resetSettings() {
  if (confirm(getLang('confirmReset'))) {
    // Reset preferences to defaults
    userPreferences = {
      cardColor: '#444444',
      customLinks: [],
      visibilitySettings: {},
      cardOrder: {},
      jsonBlobEnabled: false,
      jsonBlobId: null
    };
    
    // Update global variables for backward compatibility
    selectedCardColor = userPreferences.cardColor;
    customLinks = userPreferences.customLinks;
    cardVisibilitySettings = userPreferences.visibilitySettings;
    cardOrder = userPreferences.cardOrder;
    
    // Update UI
    document.documentElement.style.setProperty('--card-color', userPreferences.cardColor);
    updateSelectedColorOption();
    renderCustomLinksList();
    generateCards();
    
    // Remove jsonblob parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('jsonblob');
    window.history.replaceState({}, '', url.toString());
    
    // Reset checkbox
    const enableJsonBlobCheckbox = document.getElementById('enable-jsonblob');
    if (enableJsonBlobCheckbox) {
      enableJsonBlobCheckbox.checked = false;
    }
    
    // Hide JSONBlob controls
    const jsonBlobControls = document.getElementById('jsonblob-controls');
    if (jsonBlobControls) {
      jsonBlobControls.classList.add('hidden');
    }
    
    // Save to localStorage
    localStorage.removeItem('myteslatheater_preferences');
    
    showNotification('All settings have been reset to default.');
  }
}

// Apply saved filter preferences to the UI
window.updateUIFromPreferences = function() {
  // Apply category filters from preferences
  if (window.userPreferences.categoryFilters) {
    document.querySelectorAll('.category-filter').forEach(button => {
      const category = button.getAttribute('data-category');
      if (window.userPreferences.categoryFilters.includes(category)) {
        button.setAttribute('data-active', 'true');
        button.classList.add('active');
      } else {
        button.setAttribute('data-active', 'false');
        button.classList.remove('active');
      }
    });
  }
  
  // Apply country filters from preferences
  if (window.userPreferences.countryFilters) {
    document.querySelectorAll('.country-filter').forEach(button => {
      const country = button.getAttribute('data-country');
      if (window.userPreferences.countryFilters.includes(country)) {
        button.setAttribute('data-active', 'true');
        button.classList.add('active');
      } else {
        button.setAttribute('data-active', 'false');
        button.classList.remove('active');
      }
    });
  }
  
  // Update card visibility based on current filter settings
  window.updateCardVisibility && window.updateCardVisibility();
}