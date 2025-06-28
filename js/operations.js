/**
 * MyTeslaTheater - Operations Module
 * Basic operations for storage, display and card visibility
 */

// Global variables are now defined in globals.js
// Use window references throughout to avoid redeclaration

// Save user preferences in localStorage
window.saveUserPreferences = function() {
  const preferences = {
    cardColor: window.selectedCardColor,
    customLinks: window.customLinks,
    visibilitySettings: window.cardVisibilitySettings,  // Add visibility settings
    cardOrder: window.cardOrder // Save card order
  };
  localStorage.setItem('myteslatheater_preferences', JSON.stringify(preferences));
};

// Load user preferences from localStorage
window.loadUserPreferences = function() {
  const savedPrefs = localStorage.getItem('myteslatheater_preferences');
  
  if (savedPrefs) {
    try {
      const preferences = JSON.parse(savedPrefs);
      
      // Load custom links
      if (preferences.customLinks) {
        window.customLinks = preferences.customLinks;
      }
      
      // Load card visibility settings
      if (preferences.visibilitySettings) {
        window.cardVisibilitySettings = preferences.visibilitySettings;
      }
      
      // Load selected color
      if (preferences.cardColor) {
        window.selectedCardColor = preferences.cardColor;
        document.documentElement.style.setProperty('--card-color', window.selectedCardColor);
      }
      
      // Load custom card order
      if (preferences.cardOrder) {
        window.cardOrder = preferences.cardOrder;
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }
};

// Update selected color option
window.updateSelectedColorOption = function() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    if (option.getAttribute('data-color') === window.selectedCardColor) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
};

// Display custom links list
window.renderCustomLinksList = function() {
  const container = document.getElementById('custom-links-container');
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // If there are no custom links, show a message
  if (window.customLinks.length === 0) {
    container.innerHTML = `<p>${window.getLang('noCustomLinks')}</p>`;
    return;
  }
  
  // Generate elements for each custom link
  window.customLinks.forEach((link, index) => {
    const linkElement = document.createElement('div');
    linkElement.className = 'custom-link-item';
    
    // Check if visible or hidden
    const isVisible = window.cardVisibilitySettings[`custom-${index}`] !== false;
    const visibilityIcon = isVisible ? '👁️' : '👁️‍🗨️';
    
    // Add category badge if not private
    let categoryBadge = '';
    if (link.category && link.category !== 'private') {
      const categoryIcons = {
        'paid': '💰',
        'free': '🆓',
        'social': '👥'
      };
      const categoryIcon = categoryIcons[link.category] || '';
      categoryBadge = `<span style="background: #333; padding: 2px 6px; border-radius: 10px; font-size: 12px; margin-right: 8px;">${categoryIcon} ${link.category}</span>`;
    }
    
    linkElement.innerHTML = `
      <div class="custom-link-info">
        ${categoryBadge}<strong>${link.title}</strong> - ${link.url}
      </div>
      <div class="custom-link-actions">
        <button class="toggle-visibility-btn" data-card-id="custom-${index}">${visibilityIcon}</button>
        <button class="remove-link-btn" data-index="${index}">X</button>
      </div>
    `;
    container.appendChild(linkElement);
  });
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-link-btn').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      removeCustomLink(index);
    });
    
    // Touch support
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  });
  
  // Add event listeners to visibility buttons
  document.querySelectorAll('.toggle-visibility-btn').forEach(button => {
    button.addEventListener('click', function() {
      const cardId = this.getAttribute('data-card-id');
      window.toggleCardVisibility(cardId);
      window.renderCustomLinksList(); // Update list to reflect new state
    });
    
    // Touch support
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  });
};

// Remove a custom link
function removeCustomLink(index) {
  if (index >= 0 && index < window.customLinks.length) {
    window.customLinks.splice(index, 1);
    window.renderCustomLinksList();
    window.generateCards();
    window.saveUserPreferences();
  }
}

// Handle settings panel display
window.toggleSettingsPanel = function() {
  const settingsPanel = document.getElementById('settings-panel');
  const toggleBtn = document.getElementById('toggle-settings-btn');
  
  if (settingsPanel.classList.contains('hidden')) {
    settingsPanel.classList.remove('hidden');
    toggleBtn.textContent = window.getLang('hideCustomization');
  } else {
    settingsPanel.classList.add('hidden');
    toggleBtn.textContent = window.getLang('showCustomization');
  }
};

// Function to add a custom link
window.addCustomLink = function() {
  const nameInput = document.getElementById('custom-link-name');
  const urlInput = document.getElementById('custom-link-url');
  const descInput = document.getElementById('custom-link-desc');
  const logoInput = document.getElementById('custom-link-logo');
  const categorySelect = document.getElementById('custom-link-category');
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  const description = descInput.value.trim();
  const logoUrl = logoInput.value.trim();
  const category = categorySelect ? categorySelect.value : 'private';
  
  if (!name || !url) {
    alert(window.getLang('errorEmptyFields'));
    return;
  }
  
  // Modified to accept both http and https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert(window.getLang('errorUrlRequired'));
    return;
  }
  
  // Add the new custom link
  window.customLinks.push({
    title: name,
    description: description || window.getLang('customLinkDefaultDesc'),
    url: url,
    logoUrl: logoUrl || null,
    category: category
  });
  
  // Clear input fields
  nameInput.value = '';
  urlInput.value = '';
  descInput.value = '';
  logoInput.value = '';
  if (categorySelect) categorySelect.value = 'private';
  
  // Update cards, custom links list and save preferences
  window.renderCustomLinksList();
  window.generateCards();
  window.saveUserPreferences();
};

// Update colors of all cards
window.updateCardColors = function() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.backgroundColor = window.selectedCardColor;
  });
};

// Toggle card visibility
window.toggleCardVisibility = function(cardId) {
  if (Object.prototype.hasOwnProperty.call(window.cardVisibilitySettings, cardId)) {
    window.cardVisibilitySettings[cardId] = !window.cardVisibilitySettings[cardId];
  } else {
    window.cardVisibilitySettings[cardId] = false;
  }
  
  window.saveUserPreferences();
  window.generateCards();
};

// Helper function to determine if a color is light or dark
function isLightColor(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

// Initialize drag and drop for the visibility manager
function initVisibilityManagerDragDrop() {
  const sortableItems = document.querySelectorAll('.sortable-item');
  let draggedVisibilityItem = null;
  let isDragging = false;
  let lastTouchY = 0;
  let autoScrollInterval;
  
  // Helper function to handle auto-scroll during drag
  function handleAutoScroll(e) {
    const container = document.getElementById('sortable-visibility-options');
    const containerRect = container.getBoundingClientRect();
    const scrollSpeed = 5;
    const scrollTriggerArea = 60; // px from edge to trigger scroll
    
    let clientY = e.clientY;
    if (e.touches && e.touches[0]) {
      clientY = e.touches[0].clientY;
    }
    
    clearInterval(autoScrollInterval);
    
    // Auto-scroll when near the edges
    if (clientY < containerRect.top + scrollTriggerArea) {
      // Scroll up
      autoScrollInterval = setInterval(() => {
        container.scrollTop -= scrollSpeed;
      }, 20);
    } else if (clientY > containerRect.bottom - scrollTriggerArea) {
      // Scroll down
      autoScrollInterval = setInterval(() => {
        container.scrollTop += scrollSpeed;
      }, 20);
    }
  }
  
  sortableItems.forEach(item => {
    // Add mouse events
    item.addEventListener('dragstart', function(e) {
      draggedVisibilityItem = this;
      isDragging = true;
      this.classList.add('dragging');
      
      // Create a ghost image for the drag operation
      const ghostElement = this.cloneNode(true);
      ghostElement.style.opacity = '0.8';
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 20, 20);
      
      // Remove ghost after drag starts
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
      
      e.dataTransfer.effectAllowed = 'move';
    });
    
    item.addEventListener('dragend', function() {
      isDragging = false;
      this.classList.remove('dragging');
      clearInterval(autoScrollInterval);
      sortableItems.forEach(item => {
        item.classList.remove('drag-over');
      });
    });
    
    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      handleAutoScroll(e);
      return false;
    });
    
    item.addEventListener('dragenter', function() {
      if (isDragging && this !== draggedVisibilityItem) {
        this.classList.add('drag-over');
      }
    });
    
    item.addEventListener('dragleave', function() {
      this.classList.remove('drag-over');
    });
    
    item.addEventListener('drop', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      if (draggedVisibilityItem !== this) {
        const container = document.getElementById('sortable-visibility-options');
        const allItems = Array.from(container.querySelectorAll('.sortable-item'));
        const draggedIndex = allItems.indexOf(draggedVisibilityItem);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
          container.insertBefore(draggedVisibilityItem, this.nextSibling);
        } else {
          container.insertBefore(draggedVisibilityItem, this);
        }
        
        // Handle multiple selected items if any
        const selectedItems = container.querySelectorAll('.sortable-item.selected');
        if (selectedItems.length > 1 && draggedVisibilityItem.classList.contains('selected')) {
          // Calculate new position for all selected items
          const newPosition = Array.from(container.querySelectorAll('.sortable-item')).indexOf(draggedVisibilityItem);
          const selectedNotDragged = Array.from(selectedItems).filter(item => item !== draggedVisibilityItem);
          
          // Move all other selected items to be adjacent to the dragged item
          selectedNotDragged.forEach(item => {
            container.insertBefore(item, draggedVisibilityItem.nextSibling);
          });
        }
      }
      
      this.classList.remove('drag-over');
      return false;
    });
    
    // Add touch events support for mobile devices
    item.addEventListener('touchstart', function(e) {
      // Only handle touch on drag indicator
      const touchTarget = e.target;
      if (touchTarget.classList.contains('drag-indicator') || touchTarget.closest('.drag-indicator')) {
        e.preventDefault();
        draggedVisibilityItem = this;
        isDragging = true;
        this.classList.add('dragging');
        lastTouchY = e.touches[0].clientY;
        
        // Save initial scroll position
        const container = document.getElementById('sortable-visibility-options');
        initialScrollTop = container.scrollTop;
      }
    });
    
    item.addEventListener('touchmove', function(e) {
      if (!isDragging || !draggedVisibilityItem) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const container = document.getElementById('sortable-visibility-options');
      
      // Handle auto-scroll
      handleAutoScroll(e);
      
      // Find element under touch point
      const elementsUnderTouch = document.elementsFromPoint(touch.clientX, touch.clientY);
      const targetElement = elementsUnderTouch.find(el => 
        el.classList.contains('sortable-item') && el !== draggedVisibilityItem
      );
      
      // Update dragging visual cue
      sortableItems.forEach(item => {
        if (item === targetElement) {
          item.classList.add('drag-over');
        } else {
          item.classList.remove('drag-over');
        }
      });
      
      if (targetElement) {
        const allItems = Array.from(container.querySelectorAll('.sortable-item'));
        const draggedIndex = allItems.indexOf(draggedVisibilityItem);
        const targetIndex = allItems.indexOf(targetElement);
        
        // Determine position to place the dragged item
        if (draggedIndex < targetIndex) {
          container.insertBefore(draggedVisibilityItem, targetElement.nextSibling);
        } else {
          container.insertBefore(draggedVisibilityItem, targetElement);
        }
        
        // Move all selected items if dragging a selected item
        if (draggedVisibilityItem.classList.contains('selected')) {
          const selectedItems = Array.from(container.querySelectorAll('.sortable-item.selected'))
            .filter(item => item !== draggedVisibilityItem);
            
          // Move all other selected items to be adjacent to the dragged item
          selectedItems.forEach(item => {
            container.insertBefore(item, draggedVisibilityItem.nextSibling);
          });
        }
      }
      
      lastTouchY = touch.clientY;
    });
    
    item.addEventListener('touchend', function() {
      if (isDragging) {
        this.classList.remove('dragging');
        sortableItems.forEach(item => {
          item.classList.remove('drag-over');
        });
        isDragging = false;
        draggedVisibilityItem = null;
        clearInterval(autoScrollInterval);
      }
    });
    
    // Add click handler for item selection
    item.addEventListener('click', function(e) {
      // Don't trigger selection when clicking on checkbox or its label
      if (e.target.type === 'checkbox' || e.target.closest('.custom-checkbox') || 
          e.target.tagName === 'LABEL' || e.target.classList.contains('drag-indicator') ||
          e.target.closest('.drag-indicator')) {
        return;
      }
      
      // Handle multi-selection with Shift key
      if (e.shiftKey) {
        const container = document.getElementById('sortable-visibility-options');
        const allItems = Array.from(container.querySelectorAll('.sortable-item'));
        
        // Find the last selected item
        const lastSelected = allItems.find(item => item.classList.contains('last-selected'));
        
        if (lastSelected) {
          const startIdx = allItems.indexOf(lastSelected);
          const endIdx = allItems.indexOf(this);
          
          // Select all items between the last selected and this one
          const [min, max] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
          for (let i = min; i <= max; i++) {
            allItems[i].classList.add('selected');
          }
        } else {
          this.classList.toggle('selected');
        }
      } 
      // Handle multi-selection with Ctrl/Cmd key
      else if (e.ctrlKey || e.metaKey) {
        this.classList.toggle('selected');
      } 
      // Normal click
      else {
        sortableItems.forEach(item => {
          item.classList.remove('selected');
        });
        this.classList.add('selected');
      }
      
      // Update last selected item
      sortableItems.forEach(item => {
        item.classList.remove('last-selected');
      });
      this.classList.add('last-selected');
      
      // Show or hide the multi-action buttons based on selection
      updateBulkActionVisibility();
    });
  });
  
  // Function to update bulk action buttons visibility
  function updateBulkActionVisibility() {
    const bulkActionsContainer = document.getElementById('bulk-actions-container');
    if (!bulkActionsContainer) return;
    
    const selectedItems = document.querySelectorAll('.sortable-item.selected');
    
    if (selectedItems.length > 1) {
      bulkActionsContainer.style.display = 'flex';
      // Update selected count
      const selectedCountElement = document.getElementById('selected-count');
      if (selectedCountElement) {
        selectedCountElement.textContent = selectedItems.length;
      }
    } else {
      bulkActionsContainer.style.display = 'none';
    }
  }
  
  // Initialize keyboard shortcuts for selection
  document.addEventListener('keydown', function(e) {
    // Only handle when visibility manager is open
    const dialog = document.querySelector('.fullscreen-dialog');
    if (!dialog) return;
    
    const container = document.getElementById('sortable-visibility-options');
    if (!container) return;
    
    const allItems = Array.from(container.querySelectorAll('.sortable-item'));
    const lastSelected = allItems.find(item => item.classList.contains('last-selected'));
    
    // Ctrl+A or Cmd+A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      allItems.forEach(item => {
        item.classList.add('selected');
      });
      updateBulkActionVisibility();
    }
    
    // Escape to clear selection
    if (e.key === 'Escape') {
      allItems.forEach(item => {
        item.classList.remove('selected');
        item.classList.remove('last-selected');
      });
      updateBulkActionVisibility();
    }
    
    // Arrow navigation
    if (lastSelected && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      
      const currentIndex = allItems.indexOf(lastSelected);
      let newIndex;
      
      if (e.key === 'ArrowUp') {
        newIndex = Math.max(0, currentIndex - 1);
      } else {
        newIndex = Math.min(allItems.length - 1, currentIndex + 1);
      }
      
      // If shift is pressed, extend selection
      if (e.shiftKey) {
        allItems[newIndex].classList.add('selected');
      } else {
        // Clear previous selection
        allItems.forEach(item => {
          item.classList.remove('selected');
          item.classList.remove('last-selected');
        });
        allItems[newIndex].classList.add('selected');
      }
      
      allItems[newIndex].classList.add('last-selected');
      allItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      updateBulkActionVisibility();
    }
  });
}

// Function to show card visibility manager
window.showCardVisibilityManager = function() {
  // Create a dialog to manage card visibility
  const dialog = document.createElement('div');
  dialog.className = 'fullscreen-dialog';
  dialog.style.display = 'flex';
  
  // Create dialog content with dark theme matching the app
  let dialogContent = `
    <div class="dialog-content" style="max-width: 600px; width: 90%; background-color: #1f1f1f; color: white;">
      <h2>${window.getLang('cardVisibilityTitle') || 'Manage Cards'}</h2>
      <p>${window.getLang('cardVisibilitySubtitle') || 'Select which cards to show and change their order'}</p>
      <div class="visibility-manager" style="text-align: left; margin: 20px 0;">
      <p style="margin-bottom: 15px; font-style: italic; color: #aaa;">${window.getLang('dragDropInstructions') || 'Drag and drop items to reorder them.'}</p>
      <div id="sortable-visibility-options" style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
  `;
  
  // Create a copy of defaultCardData sorted by order
  let sortedDefaultCards = [...defaultCardData];
  
  // Sort by order if order exists or use custom order if available
  sortedDefaultCards.sort((a, b) => {
    // First use custom order from cardOrder if available
    if (window.cardOrder[a.id] !== undefined && window.cardOrder[b.id] !== undefined) {
      return window.cardOrder[a.id] - window.cardOrder[b.id];
    }
    // Then fall back to original order
    return (a.order || 999) - (b.order || 999);
  });
  
  // Add sortable card options from default cards
  sortedDefaultCards.forEach(card => {
    const isVisible = window.cardVisibilitySettings[card.id] !== false;
    const cardLogoHtml = card.logoUrl ? 
      `<img src="${card.logoUrl}" alt="" style="width: 30px; height: 30px; margin-right: 10px; object-fit: contain;">` : 
      `<div style="width: 30px; height: 30px; margin-right: 10px; background-color: ${card.brandColor || '#666'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${card.title.substr(0,2).toUpperCase()}</div>`;
    
    dialogContent += `
      <div class="visibility-option sortable-item" 
           style="margin: 10px 0; display: flex; align-items: center; padding: 15px; border-radius: 8px; background-color: #333; cursor: move;"
           draggable="true" 
           data-card-id="${card.id}" 
           data-order="${card.order || 0}">
        <div class="drag-indicator" style="margin-right: 15px; color: #888; font-size: 20px;">≡</div>
        ${cardLogoHtml}
        <label style="display: flex; align-items: center; flex-grow: 1; font-size: 16px; cursor: pointer;">
          <div class="custom-checkbox" style="position: relative; min-width: 24px; height: 24px; background-color: ${isVisible ? '#0066cc' : '#555'}; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            ${isVisible ? '<span style="color: white; font-size: 16px;">✓</span>' : ''}
          </div>
          <input type="checkbox" id="vis-${card.id}" data-card-id="${card.id}" ${isVisible ? 'checked' : ''} style="position: absolute; opacity: 0; width: 24px; height: 24px; margin: 0; cursor: pointer;">
          <span style="margin-left: 5px;">${card.title}</span>
        </label>
      </div>
    `;
  });
  
  // Add options for custom cards
  window.customLinks.forEach((link, index) => {
    const cardId = `custom-${index}`;
    const isVisible = window.cardVisibilitySettings[cardId] !== false;
    const cardOrderValue = 1000 + index; // Put custom links after default cards
    const cardLogoHtml = link.logoUrl ? 
      `<img src="${link.logoUrl}" alt="" style="width: 30px; height: 30px; margin-right: 10px; object-fit: contain;">` : 
      `<div style="width: 30px; height: 30px; margin-right: 10px; background-color: ${window.selectedCardColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${window.isLightColor(window.selectedCardColor) ? 'black' : 'white'}; font-weight: bold;">${link.title.substr(0,2).toUpperCase()}</div>`;
    
    dialogContent += `
      <div class="visibility-option sortable-item" 
           style="margin: 10px 0; display: flex; align-items: center; padding: 15px; border-radius: 8px; background-color: #333; cursor: move;"
           draggable="true" 
           data-card-id="${cardId}" 
           data-order="${cardOrderValue}">
        <div class="drag-indicator" style="margin-right: 15px; color: #888; font-size: 20px;">≡</div>
        ${cardLogoHtml}
        <label style="display: flex; align-items: center; flex-grow: 1; font-size: 16px; cursor: pointer;">
          <div class="custom-checkbox" style="position: relative; min-width: 24px; height: 24px; background-color: ${isVisible ? '#0066cc' : '#555'}; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            ${isVisible ? '<span style="color: white; font-size: 16px;">✓</span>' : ''}
          </div>
          <input type="checkbox" id="vis-${cardId}" data-card-id="${cardId}" ${isVisible ? 'checked' : ''} style="position: absolute; opacity: 0; width: 24px; height: 24px; margin: 0; cursor: pointer;">
          <span style="margin-left: 5px;">${link.title} <span style="opacity: 0.7; font-size: 14px;">(${window.getLang('customLinkLabel') || 'Custom'})</span></span>
        </label>
      </div>
    `;
  });
  
  // Complete dialog with buttons
  dialogContent += `
      </div>
      </div>
      <div style="margin-top: 25px; display: flex; justify-content: space-between;">
        <button id="cancel-visibility" style="background-color: #555; color: white; border: none; border-radius: 8px; padding: 15px 20px; font-size: 16px; min-width: 120px; cursor: pointer;">${window.getLang('cancel') || 'Cancel'}</button>
        <button id="save-visibility" style="background-color: #0066cc; color: white; border: none; border-radius: 8px; padding: 15px 20px; font-size: 16px; min-width: 120px; cursor: pointer;">${window.getLang('save') || 'Save'}</button>
      </div>
    </div>
  `;
  
  dialog.innerHTML = dialogContent;
  document.body.appendChild(dialog);
  
  // Add click handlers for custom checkboxes
  dialog.querySelectorAll('.custom-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      const input = this.nextElementSibling;
      input.checked = !input.checked;
      
      // Update visual appearance
      if (input.checked) {
        this.style.backgroundColor = '#0066cc';
        this.innerHTML = '<span style="color: white; font-size: 16px;">✓</span>';
      } else {
        this.style.backgroundColor = '#555';
        this.innerHTML = '';
      }
    });
  });
  
  // Initialize drag-and-drop for the visibility options
  initVisibilityManagerDragDrop();
  
  // Handle settings saving
  document.getElementById('save-visibility').addEventListener('click', function() {
    // Collect settings from all checkboxes
    const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const cardId = checkbox.getAttribute('data-card-id');
      window.cardVisibilitySettings[cardId] = checkbox.checked;
    });
    
    // Save the new order from the sortable items
    const sortableItems = dialog.querySelectorAll('.sortable-item');
    sortableItems.forEach((item, index) => {
      const cardId = item.getAttribute('data-card-id');
      window.cardOrder[cardId] = index;
    });
    
    // Save settings and regenerate cards
    window.saveUserPreferences();
    window.generateCards();
    window.renderCustomLinksList();
    
    // Close dialog
    document.body.removeChild(dialog);
  });
  
  // Handle cancellation
  document.getElementById('cancel-visibility').addEventListener('click', function() {
    document.body.removeChild(dialog);
  });
};

// Apply the selected filter and update card visibility
window.applyFilters = function() {
  // Get currently active filters
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
  
  // Update userPreferences with current filter selections
  window.userPreferences.categoryFilters = activeCategories;
  window.userPreferences.countryFilters = activeCountries;
  
  // Save the user preferences to persist filters
  window.saveUserPreferences();
  
  // Update card visibility based on new filter settings
  window.updateCardVisibility();
};

// Update card visibility based on active filters and visibility settings
window.updateCardVisibility = function() {
  // Get active filters
  const activeCategories = [];
  document.querySelectorAll('.category-filter[data-active="true"]').forEach(button => {
    activeCategories.push(button.getAttribute('data-category'));
  });
  
  const activeCountries = [];
  document.querySelectorAll('.country-filter[data-active="true"]').forEach(button => {
    activeCountries.push(button.getAttribute('data-country'));
  });
  
  // Get all cards
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    // First, check if the card is set to be hidden in visibility settings
    const cardId = card.getAttribute('data-id');
    if (window.cardVisibilitySettings[cardId] === false) {
      card.style.display = 'none';
      return;
    }
    
    // Check if card matches the active filters
    const cardCategory = card.getAttribute('data-category');
    const cardCountry = card.getAttribute('data-country');
    
    let categoryMatch = true;
    let countryMatch = true;
    
    // If we have active category filters, check if the card matches any
    if (activeCategories.length > 0) {
      categoryMatch = activeCategories.includes(cardCategory);
    }
    
    // If we have active country filters, check if the card matches any
    if (activeCountries.length > 0) {
      countryMatch = activeCountries.includes(cardCountry);
    }
    
    // Card is visible if it matches both category and country filters
    if (categoryMatch && countryMatch) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show or hide "no results" message
  const noResultsMessage = document.getElementById('no-results-message');
  if (noResultsMessage) {
    if (visibleCount === 0) {
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
  }
};

// Show the card visibility manager
function showCardVisibilityManager() {
  const cardData = getCardData();
  const userCardOrder = getUserCardOrder();
  const userCardVisibility = getUserCardVisibility();
  
  // Create dialog container
  const dialogContainer = document.createElement('div');
  dialogContainer.className = 'fullscreen-dialog';
  dialogContainer.id = 'visibility-manager-dialog';
  
  // Create dialog content with improved layout
  dialogContainer.innerHTML = `
    <div class="dialog-content visibility-manager">
      <div class="dialog-header">
        <h2>${getLang('manageCards')}</h2>
        <div class="dialog-actions">
          <button id="close-visibility-dialog" class="icon-button">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      
      <div id="bulk-actions-container" style="display: none;" class="bulk-actions">
        <span class="selection-info">
          <span id="selected-count">0</span> ${getLang('itemsSelected')}
        </span>
        <div class="bulk-buttons">
          <button id="show-selected" class="action-button">
            <span class="material-icons">visibility</span>
            ${getLang('showSelected')}
          </button>
          <button id="hide-selected" class="action-button">
            <span class="material-icons">visibility_off</span>
            ${getLang('hideSelected')}
          </button>
        </div>
      </div>

      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="material-icons">search</span>
          <input type="text" id="visibility-search" placeholder="${getLang('searchCards')}">
          <button id="clear-search" class="icon-button" style="display: none;">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      
      <div class="dialog-body">
        <div id="sortable-visibility-options" class="sortable-container">
          <!-- Card items will be added here dynamically -->
        </div>
      </div>
      
      <div class="dialog-footer">
        <div class="left-actions">
          <button id="select-all" class="text-button">
            ${getLang('selectAll')}
          </button>
          <button id="deselect-all" class="text-button">
            ${getLang('deselectAll')}
          </button>
        </div>
        <div class="right-actions">
          <button id="reset-order" class="text-button">
            ${getLang('resetOrder')}
          </button>
          <button id="reset-visibility" class="text-button">
            ${getLang('resetVisibility')}
          </button>
          <button id="save-visibility" class="primary-button">
            ${getLang('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialogContainer);
  
  // Get the container element
  const sortableContainer = document.getElementById('sortable-visibility-options');
  
  // Sort cards based on user's saved order
  const sortedCards = userCardOrder.length > 0 
    ? userCardOrder.map(id => cardData.find(card => card.id === id)).filter(Boolean)
    : [...cardData];
  
  // Add cards that exist in cardData but not in userCardOrder
  const missingCards = cardData.filter(card => !userCardOrder.includes(card.id));
  sortedCards.push(...missingCards);
  
  // Create sortable items
  sortedCards.forEach(card => {
    const isVisible = userCardVisibility[card.id] !== false;
    
    const item = document.createElement('div');
    item.className = 'sortable-item';
    item.setAttribute('data-id', card.id);
    item.draggable = true;
    
    // Use card logo if available, otherwise show the title
    const logoHTML = card.logo 
      ? `<img src="assets/logos/${card.logo}" alt="${card.title}" class="card-logo">`
      : '';
    
    item.innerHTML = `
      <div class="drag-indicator">
        <span class="material-icons">drag_indicator</span>
      </div>
      <div class="custom-checkbox">
        <input type="checkbox" id="vis-${card.id}" ${isVisible ? 'checked' : ''}>
        <label for="vis-${card.id}"></label>
      </div>
      <div class="item-content">
        ${logoHTML}
        <div class="item-details">
          <span class="item-title">${card.title}</span>
          <span class="item-url">${card.url}</span>
        </div>
      </div>
    `;
    
    sortableContainer.appendChild(item);
  });
  
  // Initialize drag and drop functionality
  initVisibilityManagerDragDrop();
  
  // Event listeners for the dialog controls
  document.getElementById('close-visibility-dialog').addEventListener('click', () => {
    dialogContainer.remove();
  });
  
  document.getElementById('save-visibility').addEventListener('click', () => {
    saveCardVisibilityOrder();
    dialogContainer.remove();
    refreshCardDisplay();
  });
  
  const visibilitySearch = document.getElementById('visibility-search');
  const clearSearchButton = document.getElementById('clear-search');
  
  // Search functionality
  visibilitySearch.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    clearSearchButton.style.display = searchTerm ? 'block' : 'none';
    
    const items = sortableContainer.querySelectorAll('.sortable-item');
    items.forEach(item => {
      const cardId = item.getAttribute('data-id');
      const card = cardData.find(card => card.id === cardId);
      
      const titleMatch = card.title.toLowerCase().includes(searchTerm);
      const urlMatch = card.url.toLowerCase().includes(searchTerm);
      
      item.style.display = (titleMatch || urlMatch) ? 'flex' : 'none';
    });
  });
  
  // Clear search
  clearSearchButton.addEventListener('click', function() {
    visibilitySearch.value = '';
    clearSearchButton.style.display = 'none';
    
    const items = sortableContainer.querySelectorAll('.sortable-item');
    items.forEach(item => {
      item.style.display = 'flex';
    });
    
    visibilitySearch.focus();
  });
  
  // Bulk actions
  document.getElementById('show-selected').addEventListener('click', function() {
    const selectedItems = sortableContainer.querySelectorAll('.sortable-item.selected');
    selectedItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = true;
    });
  });
  
  document.getElementById('hide-selected').addEventListener('click', function() {
    const selectedItems = sortableContainer.querySelectorAll('.sortable-item.selected');
    selectedItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = false;
    });
  });
  
  // Selection controls
  document.getElementById('select-all').addEventListener('click', function() {
    const visibleItems = Array.from(sortableContainer.querySelectorAll('.sortable-item'))
      .filter(item => item.style.display !== 'none');
      
    visibleItems.forEach(item => {
      item.classList.add('selected');
    });
    
    // Update last selected to the last visible item
    if (visibleItems.length > 0) {
      sortableContainer.querySelectorAll('.sortable-item').forEach(item => {
        item.classList.remove('last-selected');
      });
      visibleItems[visibleItems.length - 1].classList.add('last-selected');
    }
    
    // Update bulk actions visibility
    const bulkActionsContainer = document.getElementById('bulk-actions-container');
    if (visibleItems.length > 1) {
      bulkActionsContainer.style.display = 'flex';
      document.getElementById('selected-count').textContent = visibleItems.length;
    }
  });
  
  document.getElementById('deselect-all').addEventListener('click', function() {
    sortableContainer.querySelectorAll('.sortable-item').forEach(item => {
      item.classList.remove('selected');
      item.classList.remove('last-selected');
    });
    
    // Hide bulk actions
    document.getElementById('bulk-actions-container').style.display = 'none';
  });
  
  // Reset order
  document.getElementById('reset-order').addEventListener('click', function() {
    // Clear the container
    sortableContainer.innerHTML = '';
    
    // Sort cards by original order in cardData
    const originalOrderCards = [...cardData];
    
    // Re-create items in original order
    originalOrderCards.forEach(card => {
      const isVisible = userCardVisibility[card.id] !== false;
      
      const item = document.createElement('div');
      item.className = 'sortable-item';
      item.setAttribute('data-id', card.id);
      item.draggable = true;
      
      const logoHTML = card.logo 
        ? `<img src="assets/logos/${card.logo}" alt="${card.title}" class="card-logo">`
        : '';
      
      item.innerHTML = `
        <div class="drag-indicator">
          <span class="material-icons">drag_indicator</span>
        </div>
        <div class="custom-checkbox">
          <input type="checkbox" id="vis-${card.id}" ${isVisible ? 'checked' : ''}>
          <label for="vis-${card.id}"></label>
        </div>
        <div class="item-content">
          ${logoHTML}
          <div class="item-details">
            <span class="item-title">${card.title}</span>
            <span class="item-url">${card.url}</span>
          </div>
        </div>
      `;
      
      sortableContainer.appendChild(item);
    });
    
    // Re-initialize drag and drop
    initVisibilityManagerDragDrop();
  });
  
  // Reset visibility (make all visible)
  document.getElementById('reset-visibility').addEventListener('click', function() {
    sortableContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = true;
    });
  });
}

// Save the current card visibility and order
function saveCardVisibilityOrder() {
  const sortableContainer = document.getElementById('sortable-visibility-options');
  const items = sortableContainer.querySelectorAll('.sortable-item');
  
  // Save order
  const newOrder = [];
  
  // Save visibility state
  const newVisibility = {};
  
  items.forEach(item => {
    const cardId = item.getAttribute('data-id');
    const checkbox = item.querySelector('input[type="checkbox"]');
    
    newOrder.push(cardId);
    newVisibility[cardId] = checkbox.checked;
  });
  
  // Save to localStorage
  localStorage.setItem('userCardOrder', JSON.stringify(newOrder));
  localStorage.setItem('userCardVisibility', JSON.stringify(newVisibility));
  
  // Show a success notification
  showNotification(getLang('cardSettingsSaved'), 'success');
}