/**
 * MyTeslaTheater - View Manager Module
 * Handles UI-specific operations and visual components
 */

// Initialize visibility toggle event listeners
window.initVisibilityToggleListeners = function() {
  document.querySelectorAll('.visibility-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const cardId = this.getAttribute('data-card-id');
      window.toggleCardVisibility(cardId);
    });
  });
};

// Setup color picker and UI elements
function setupColorPicker() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    // Set background color for each option
    const color = option.getAttribute('data-color');
    option.style.backgroundColor = color;
    
    // Check if this is the currently selected color
    if (color === window.selectedCardColor) {
      option.classList.add('selected');
    }
    
    // Add event listener
    option.addEventListener('click', function() {
      const newColor = this.getAttribute('data-color');
      window.selectedCardColor = newColor;
      
      // Update CSS variable
      document.documentElement.style.setProperty('--card-color', newColor);
      
      // Update UI
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update card colors
      updateCardColors();
      
      // Save preferences
      saveUserPreferences();
    });
  });
}

// Setup event listeners for settings panel
function setupSettingsListeners() {
  // Toggle settings panel
  const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
  if (toggleSettingsBtn) {
    toggleSettingsBtn.addEventListener('click', toggleSettingsPanel);
  }
  
  // Custom link form
  const addLinkForm = document.getElementById('add-link-form');
  if (addLinkForm) {
    addLinkForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addCustomLink();
    });
  }
  
  // Card visibility manager
  const manageVisibilityBtn = document.getElementById('manage-visibility-btn');
  if (manageVisibilityBtn) {
    manageVisibilityBtn.addEventListener('click', function() {
      showCardVisibilityManager();
    });
  }
}

// Generate a card element
window.generateCardElement = function(card) {
  const isCustomCard = card.id && card.id.startsWith('custom');
  const cardColor = isCustomCard ? window.selectedCardColor : (card.brandColor || window.selectedCardColor);
  const textColor = window.isLightColor(cardColor) ? 'black' : 'white';
  
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.id = card.id;
  cardElement.setAttribute('data-order', card.order || 999);
  cardElement.setAttribute('data-category', card.category || 'private');
  cardElement.style.backgroundColor = cardColor;
  cardElement.style.color = textColor;
  
  // Generate logo or initial
  let logoHtml = '';
  if (card.logoUrl) {
    logoHtml = `<img src="${card.logoUrl}" alt="${card.title}" class="card-logo">`;
  } else {
    const initials = card.title.substring(0, 2).toUpperCase();
    logoHtml = `<div class="card-logo-placeholder" style="background-color: ${card.brandColor || '#555'}">${initials}</div>`;
  }
  
  // Generate card content
  cardElement.innerHTML = `
    <a href="${card.url}" target="_blank" class="card-link">
      <div class="card-inner">
        <div class="card-header">
          ${logoHtml}
          <h3 class="card-title">${card.title}</h3>
        </div>
        <p class="card-description">${card.description}</p>
      </div>
    </a>
    <button class="visibility-toggle" data-card-id="${card.id}" aria-label="${window.getLang('toggleVisibility') || 'Toggle visibility'}">
      <span class="toggle-icon">👁️</span>
    </button>
  `;
  
  return cardElement;
};

// Display confirmation dialog
function showConfirmDialog(message, confirmCallback, cancelCallback) {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  // Create modal content
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  dialog.style.cssText = `
    background: #222;
    color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    width: 400px;
    text-align: center;
  `;
  
  // Add message
  const messageElem = document.createElement('p');
  messageElem.textContent = message;
  messageElem.style.margin = '0 0 20px 0';
  dialog.appendChild(messageElem);
  
  // Add buttons container
  const buttons = document.createElement('div');
  buttons.style.cssText = `
    display: flex;
    justify-content: space-between;
    gap: 10px;
  `;
  
  // Add confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = window.getLang('confirm') || 'Confirm';
  confirmBtn.style.cssText = `
    background: #0066cc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;
  `;
  confirmBtn.addEventListener('click', function() {
    if (confirmCallback) confirmCallback();
    document.body.removeChild(modal);
  });
  
  // Add cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = window.getLang('cancel') || 'Cancel';
  cancelBtn.style.cssText = `
    background: #555;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;
  `;
  cancelBtn.addEventListener('click', function() {
    if (cancelCallback) cancelCallback();
    document.body.removeChild(modal);
  });
  
  // Add buttons to container
  buttons.appendChild(cancelBtn);
  buttons.appendChild(confirmBtn);
  dialog.appendChild(buttons);
  
  // Add dialog to modal
  modal.appendChild(dialog);
  
  // Add modal to body
  document.body.appendChild(modal);
}

// Filter visible cards based on category
function filterCardsByCategory(category) {
  const cards = document.querySelectorAll('.card');
  
  if (category === 'all') {
    cards.forEach(card => {
      card.style.display = '';
    });
  } else {
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Update active filter button
  const filterButtons = document.querySelectorAll('.category-filter');
  filterButtons.forEach(button => {
    if (button.getAttribute('data-category') === category) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Setup category filter buttons
window.setupCategoryFilters = function() {
  const filterButtons = document.querySelectorAll('.category-filter');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filterCardsByCategory(category);
    });
  });
};

// Display error message
function showErrorMessage(message, duration = 5000) {
  const errorContainer = document.getElementById('error-container') || createErrorContainer();
  
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.innerHTML = `
    <span class="error-icon">⚠️</span>
    <span class="error-text">${message}</span>
    <button class="error-close">×</button>
  `;
  
  // Add close button functionality
  errorMessage.querySelector('.error-close').addEventListener('click', function() {
    errorContainer.removeChild(errorMessage);
    if (errorContainer.childElementCount === 0) {
      errorContainer.style.display = 'none';
    }
  });
  
  // Add to container
  errorContainer.appendChild(errorMessage);
  errorContainer.style.display = 'block';
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (errorMessage.parentNode === errorContainer) {
        errorContainer.removeChild(errorMessage);
        if (errorContainer.childElementCount === 0) {
          errorContainer.style.display = 'none';
        }
      }
    }, duration);
  }
}

// Create error container if it doesn't exist
function createErrorContainer() {
  let container = document.getElementById('error-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'error-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      z-index: 1000;
      display: none;
    `;
    document.body.appendChild(container);
  }
  
  return container;
}

// Apply a display animation to an element
window.animateElement = function(element, animationType) {
  const animations = {
    'fadeIn': [
      { opacity: 0 },
      { opacity: 1 }
    ],
    'slideIn': [
      { transform: 'translateY(-20px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    'popIn': [
      { transform: 'scale(0.8)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ]
  };
  
  const timing = {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards'
  };
  
  if (animations[animationType]) {
    element.animate(animations[animationType], timing);
  }
};

// Initialize all UI elements
function initUI() {
  setupColorPicker();
  setupSettingsListeners();
  window.setupCategoryFilters();
  window.initVisibilityToggleListeners();
}