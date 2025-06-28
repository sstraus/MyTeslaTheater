/**
 * MyTeslaTheater - Card Manager Module
 * Handles the creation, filtering, and management of content cards
 */

// Generate cards from default data and custom links
window.generateCards = function() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Combine default cards and custom links
  let allCards = [...defaultCardData];
  
  // Add custom links as cards
  if (window.customLinks && Array.isArray(window.customLinks)) {
    window.customLinks.forEach((link, index) => {
      const customCard = {
        id: `custom-${index}`,
        title: link.title,
        description: link.description || window.getLang('customLinkDefaultDesc'),
        url: link.url,
        logoUrl: link.logoUrl || null,
        category: link.category || 'private',
        order: 1000 + index // Start custom cards after defaults
      };
      allCards.push(customCard);
    });
  }
  
  // Apply visibility settings
  allCards = allCards.filter(card => {
    // If card has a visibility setting and it's false, hide it
    if (window.cardVisibilitySettings && 
        Object.prototype.hasOwnProperty.call(window.cardVisibilitySettings, card.id) && 
        window.cardVisibilitySettings[card.id] === false) {
      return false;
    }
    return true;
  });
  
  // Apply custom ordering
  allCards.sort((a, b) => {
    // First use custom order from cardOrder if available
    if (window.cardOrder && 
        window.cardOrder[a.id] !== undefined && 
        window.cardOrder[b.id] !== undefined) {
      return window.cardOrder[a.id] - window.cardOrder[b.id];
    }
    // Then fall back to original order
    return (a.order || 999) - (b.order || 999);
  });
  
  // Create card elements
  allCards.forEach(card => {
    const cardElement = window.generateCardElement(card);
    container.appendChild(cardElement);
    
    // Animate the card
    window.animateElement(cardElement, 'fadeIn');
  });
  
  // Initialize drag & drop after cards are created
  window.initDragDrop();
};

// Generate a card element from card data
window.generateCardElement = function(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card sortable-card';
  cardElement.id = card.id;
  cardElement.setAttribute('draggable', 'true');
  cardElement.setAttribute('data-category', card.category || 'private');
  cardElement.setAttribute('data-country', card.country || 'intl');
  
  // Set card background color
  cardElement.style.backgroundColor = window.selectedCardColor || '#1f1f1f';
  cardElement.style.borderRadius = '8px';
  cardElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  cardElement.style.transition = 'transform 0.2s, box-shadow 0.2s';
  cardElement.style.position = 'relative';
  
  // Add hover effect via class
  cardElement.addEventListener('mouseenter', () => {
    cardElement.style.transform = 'translateY(-5px)';
    cardElement.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
  });
  
  cardElement.addEventListener('mouseleave', () => {
    cardElement.style.transform = 'translateY(0)';
    cardElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  });
  
  // Add drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'drag-handle';
  dragHandle.innerHTML = '≡';
  dragHandle.style.position = 'absolute';
  dragHandle.style.top = '10px';
  dragHandle.style.right = '10px';
  dragHandle.style.color = 'rgba(255, 255, 255, 0.5)';
  dragHandle.style.fontSize = '18px';
  dragHandle.style.cursor = 'move';
  dragHandle.style.padding = '5px';
  dragHandle.style.zIndex = '5';
  cardElement.appendChild(dragHandle);
  
  // Create inner card content
  const innerContent = document.createElement('div');
  innerContent.className = 'card-inner';
  innerContent.style.display = 'flex';
  innerContent.style.flexDirection = 'column';
  innerContent.style.height = '100%';
  
  // Create card header with logo and title
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  cardHeader.style.display = 'flex';
  cardHeader.style.alignItems = 'center';
  cardHeader.style.marginBottom = '12px';
  
  // Create logo container to hold the logo
  const logoContainer = document.createElement('div');
  logoContainer.className = 'logo-container';
  logoContainer.style.position = 'relative';
  logoContainer.style.marginRight = '12px';
  
  // Logo or placeholder
  if (card.logoUrl) {
    const logo = document.createElement('img');
    logo.src = card.logoUrl;
    logo.alt = `${card.title} logo`;
    logo.className = 'card-logo';
    logo.style.width = '40px';
    logo.style.height = '40px';
    logo.style.objectFit = 'contain';
    logoContainer.appendChild(logo);
  } else {
    // Create logo placeholder with initials
    const logoPlaceholder = document.createElement('div');
    logoPlaceholder.className = 'card-logo-placeholder';
    logoPlaceholder.style.width = '40px';
    logoPlaceholder.style.height = '40px';
    logoPlaceholder.style.borderRadius = '8px';
    logoPlaceholder.style.backgroundColor = card.brandColor || '#444';
    logoPlaceholder.style.display = 'flex';
    logoPlaceholder.style.alignItems = 'center';
    logoPlaceholder.style.justifyContent = 'center';
    logoPlaceholder.style.color = 'white';
    logoPlaceholder.style.fontWeight = 'bold';
    logoPlaceholder.textContent = card.title.substr(0, 2).toUpperCase();
    logoContainer.appendChild(logoPlaceholder);
  }
  
  // Add logo container to header
  cardHeader.appendChild(logoContainer);
  
  // Title
  const title = document.createElement('h3');
  title.textContent = card.title;
  title.className = 'card-title';
  title.style.margin = '0';
  title.style.fontSize = '18px';
  title.style.fontWeight = '500';
  cardHeader.appendChild(title);
  
  innerContent.appendChild(cardHeader);
  
  // Description
  const description = document.createElement('p');
  description.textContent = card.description;
  description.className = 'card-description';
  description.style.fontSize = '14px';
  description.style.marginTop = '0';
  description.style.opacity = '0.8';
  innerContent.appendChild(description);
  
  // Add category badge to the bottom right of the card
  if (card.category && card.category !== 'private') {
    const categoryIcons = {
      'paid': '💰',
      'free': '🆓',
      'social': '👥'
    };
    
    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'category-badge';
    
    // Position the category badge at the bottom right of the card
    categoryBadge.style.position = 'absolute';
    categoryBadge.style.bottom = '10px';
    categoryBadge.style.right = '10px';
    categoryBadge.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    categoryBadge.style.color = '#fff';
    categoryBadge.style.border = '1px solid rgba(255, 255, 255, 0.5)';
    categoryBadge.style.borderRadius = '4px';
    categoryBadge.style.padding = '2px 6px';
    categoryBadge.style.fontSize = '11px';
    categoryBadge.style.fontWeight = 'bold';
    categoryBadge.style.zIndex = '10';
    categoryBadge.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.4)';
    
    // Use text instead of just emoji for better readability
    const categoryName = card.category.charAt(0).toUpperCase() + card.category.slice(1);
    const categoryIcon = categoryIcons[card.category] || '';
    categoryBadge.textContent = `${categoryIcon} ${categoryName}`;
    
    // Add the badge directly to the card element
    cardElement.appendChild(categoryBadge);
  }
  
  // Create link wrapper
  const cardLink = document.createElement('a');
  cardLink.href = card.url;
  cardLink.className = 'card-link';
  cardLink.style.textDecoration = 'none';
  cardLink.style.color = 'inherit';
  cardLink.style.display = 'block';
  cardLink.target = '_blank'; // Open in new tab by default
  
  // Add click handler to check if fullscreen is needed
  cardLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (window.askForFullscreen) {
      window.showFullscreenDialog(card.url);
    } else {
      window.open(card.url, '_blank');
    }
  });
  
  // Add everything to the card
  cardLink.appendChild(innerContent);
  cardElement.appendChild(cardLink);
  
  return cardElement;
};

// Process card data to filter by categories
function processCardData() {
  // Find all available categories
  const categories = new Set();
  defaultCardData.forEach(card => {
    if (card.category) {
      categories.add(card.category);
    }
  });
  
  // Include categories from custom links
  if (window.customLinks && Array.isArray(window.customLinks)) {
    window.customLinks.forEach(link => {
      if (link.category) {
        categories.add(link.category);
      }
    });
  }
  
  // Generate category filters if the container exists
  const filterContainer = document.getElementById('category-filters');
  if (filterContainer) {
    // Clear container
    filterContainer.innerHTML = '';
    
    // Only include "Paid", "Free", and "Social" categories
    const displayCategories = ['paid', 'free', 'social'];
    displayCategories.forEach(category => {
      if (categories.has(category)) {
        const filterButton = document.createElement('button');
        filterButton.className = 'category-filter';
        filterButton.setAttribute('data-category', category);
        filterButton.setAttribute('data-active', 'true'); // Default to active
        
        // Add icon based on category
        const categoryIcons = {
          'paid': '💰 ',
          'free': '🆓 ',
          'social': '👥 '
        };
        
        const icon = categoryIcons[category] || '';
        filterButton.textContent = `${icon}${category.charAt(0).toUpperCase() + category.slice(1)}`;
        
        // Style for active state (enabled)
        filterButton.style.backgroundColor = '#333';
        
        filterContainer.appendChild(filterButton);
      }
    });
    
    // Setup filter listeners
    window.setupCategoryFilters();
  }
  
  // Process country data for filtering
  processCountryData();
}

// Process and display country filters
function processCountryData() {
  // Find all available countries
  const countries = new Set();
  defaultCardData.forEach(card => {
    if (card.country) {
      countries.add(card.country);
    }
  });
  
  // Include countries from custom links
  if (window.customLinks && Array.isArray(window.customLinks)) {
    window.customLinks.forEach(link => {
      if (link.country) {
        countries.add(link.country);
      } else {
        // Default to international if no country specified
        countries.add('intl');
      }
    });
  }
  
  // Generate country filters if the container exists
  const countryFilterContainer = document.getElementById('country-filters');
  if (countryFilterContainer) {
    // Clear container
    countryFilterContainer.innerHTML = '';
    
    // Country display names and icons
    const countryDisplay = {
      'intl': { name: 'International', icon: '🌎 ' },
      'us': { name: 'United States', icon: '🇺🇸 ' },
      'uk': { name: 'United Kingdom', icon: '🇬🇧 ' },
      'de': { name: 'Germany', icon: '🇩🇪 ' },
      'fr': { name: 'France', icon: '🇫🇷 ' },
      'it': { name: 'Italy', icon: '🇮🇹 ' },
      'es': { name: 'Spain', icon: '🇪🇸 ' }
      // Add more countries as needed
    };
    
    // Sort the countries to ensure a consistent order
    const sortedCountries = Array.from(countries).sort();
    
    // Create a filter button for each country
    sortedCountries.forEach(country => {
      const filterButton = document.createElement('button');
      filterButton.className = 'country-filter';
      filterButton.setAttribute('data-country', country);
      filterButton.setAttribute('data-active', 'true'); // Default to active
      
      // Get display info for the country or use generic format
      const display = countryDisplay[country] || { 
        name: country.charAt(0).toUpperCase() + country.slice(1), 
        icon: '' 
      };
      
      filterButton.textContent = `${display.icon}${display.name}`;
      
      // Style for active state (enabled)
      filterButton.style.backgroundColor = '#333';
      filterButton.style.padding = '5px 10px';
      filterButton.style.margin = '2px';
      filterButton.style.border = '1px solid #444';
      filterButton.style.borderRadius = '4px';
      filterButton.style.color = '#fff';
      filterButton.style.cursor = 'pointer';
      
      countryFilterContainer.appendChild(filterButton);
    });
    
    // Setup country filter listeners
    window.setupCountryFilters();
  }
}

// Initialize drag-and-drop functionality
window.initDragDrop = function() {
  let draggedItem = null;
  const cardsContainer = document.getElementById('cards-container');
  
  // Exit if container doesn't exist
  if (!cardsContainer) return;
  
  // Get all cards
  const cards = cardsContainer.querySelectorAll('.card');
  
  cards.forEach(card => {
    // Make draggable
    card.setAttribute('draggable', 'true');
    
    // Add event listeners
    card.addEventListener('dragstart', function(e) {
      // Only initiate drag if the drag handle was clicked or if the card itself was clicked (not a link inside it)
      if (e.target.closest('.card-link') && !e.target.closest('.drag-handle')) {
        e.preventDefault();
        return false;
      }
      
      draggedItem = this;
      setTimeout(() => this.style.opacity = '0.4', 0);
      e.dataTransfer.effectAllowed = 'move';
    });
    
    card.addEventListener('dragend', function() {
      this.style.opacity = '1';
      cards.forEach(card => {
        card.classList.remove('over');
      });
    });
    
    card.addEventListener('dragover', function(e) {
      e.preventDefault();
      return false;
    });
    
    card.addEventListener('dragenter', function() {
      if (this !== draggedItem) {
        this.classList.add('over');
      }
    });
    
    card.addEventListener('dragleave', function() {
      this.classList.remove('over');
    });
    
    card.addEventListener('drop', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      if (draggedItem !== this) {
        const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
        const draggedIndex = allCards.indexOf(draggedItem);
        const targetIndex = allCards.indexOf(this);
        
        if (draggedIndex < targetIndex) {
          cardsContainer.insertBefore(draggedItem, this.nextSibling);
        } else {
          cardsContainer.insertBefore(draggedItem, this);
        }
        
        // Update card order
        updateCardOrder();
      }
      
      return false;
    });
    
    // Handle drag via the drag handle for touch devices
    const dragHandle = card.querySelector('.drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        draggedItem = card;
        card.classList.add('dragging');
      });
    }
    
    card.addEventListener('touchmove', function(e) {
      if (!draggedItem) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
      
      // Find the first card element under touch point that isn't the dragged item
      const targetCard = elementsAtPoint.find(el => 
        el.classList.contains('card') && el !== draggedItem
      );
      
      if (targetCard) {
        const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
        const draggedIndex = allCards.indexOf(draggedItem);
        const targetIndex = allCards.indexOf(targetCard);
        
        if (draggedIndex < targetIndex) {
          cardsContainer.insertBefore(draggedItem, targetCard.nextSibling);
        } else {
          cardsContainer.insertBefore(draggedItem, targetCard);
        }
        
        // Update card order
        updateCardOrder();
      }
    });
    
    card.addEventListener('touchend', function() {
      if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
      }
    });
  });
};

// Update card order after drag and drop
function updateCardOrder() {
  const cardsContainer = document.getElementById('cards-container');
  const cards = cardsContainer.querySelectorAll('.card');
  
  // Initialize cardOrder if it doesn't exist
  if (!window.cardOrder) {
    window.cardOrder = {};
  }
  
  cards.forEach((card, index) => {
    const cardId = card.id;
    window.cardOrder[cardId] = index;
  });
  
  // Save updated order
  window.saveUserPreferences();
}

// Setup category filter functionality
window.setupCategoryFilters = function() {
  const filterButtons = document.querySelectorAll('.category-filter');
  
  filterButtons.forEach(button => {
    // Set initial visual state
    updateButtonVisual(button);
    
    button.addEventListener('click', function() {
      // Toggle the active state
      const isActive = this.getAttribute('data-active') === 'true';
      this.setAttribute('data-active', isActive ? 'false' : 'true');
      
      // Update visual appearance
      updateButtonVisual(this);
      
      // Apply filter to cards
      window.updateCardVisibility();
    });
  });
  
  // Function to update button visual appearance
  function updateButtonVisual(button) {
    const isActive = button.getAttribute('data-active') === 'true';
    
    if (isActive) {
      // Enabled state
      button.style.backgroundColor = '#333'; // darker background for enabled state
      button.style.opacity = '1';
    } else {
      // Disabled state
      button.style.backgroundColor = '#1a1a1a'; // lighter background for disabled state
      button.style.opacity = '0.6';
    }
  }
  
  // Function to update card visibility based on active filters
  function updateCardVisibility() {
    // Find all active categories
    const activeCategories = [];
    filterButtons.forEach(button => {
      if (button.getAttribute('data-active') === 'true') {
        activeCategories.push(button.getAttribute('data-category'));
      }
    });
    
    // Show cards from active categories, hide others
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardData = findCardData(card.id);
      
      if (cardData) {
        // Show card if its category is in active categories
        // or if it's a private category card
        if (activeCategories.includes(cardData.category) || cardData.category === 'private') {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      }
    });
  }
  
  // Initialize card visibility based on current filters
  updateCardVisibility();
};

// Setup country filter functionality
window.setupCountryFilters = function() {
  const countryFilterButtons = document.querySelectorAll('.country-filter');
  
  countryFilterButtons.forEach(button => {
    // Set initial visual state
    updateButtonVisual(button);
    
    button.addEventListener('click', function() {
      // Toggle the active state
      const isActive = this.getAttribute('data-active') === 'true';
      this.setAttribute('data-active', isActive ? 'false' : 'true');
      
      // Update visual appearance
      updateButtonVisual(this);
      
      // Apply filter to cards
      window.updateCardVisibility();
    });
  });
  
  // Function to update button visual appearance
  function updateButtonVisual(button) {
    const isActive = button.getAttribute('data-active') === 'true';
    
    if (isActive) {
      // Enabled state
      button.style.backgroundColor = '#333'; // darker background for enabled state
      button.style.opacity = '1';
    } else {
      // Disabled state
      button.style.backgroundColor = '#1a1a1a'; // lighter background for disabled state
      button.style.opacity = '0.6';
    }
  }
  
  // Initialize card visibility
  updateCardVisibility();
};

// Update card visibility based on active category and country filters
window.updateCardVisibility = function() {
  // Get all active categories
  const activeCategories = [];
  document.querySelectorAll('.category-filter').forEach(button => {
    if (button.getAttribute('data-active') === 'true') {
      activeCategories.push(button.getAttribute('data-category'));
    }
  });
  
  // Get all active countries
  const activeCountries = [];
  document.querySelectorAll('.country-filter').forEach(button => {
    if (button.getAttribute('data-active') === 'true') {
      activeCountries.push(button.getAttribute('data-country'));
    }
  });
  
  // Count visible cards for grid layout updates
  let visibleCount = 0;
  
  // Show cards that match filter criteria, hide others
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const cardData = findCardData(card.id);
    
    if (cardData) {
      const category = cardData.category || 'private';
      const country = cardData.country || 'intl';
      
      // Card is visible if:
      // 1. Its category is active OR it's a private card (always shown)
      // 2. AND its country is active OR no country filter is active
      const categoryMatch = activeCategories.includes(category) || category === 'private';
      const countryMatch = activeCountries.length === 0 || activeCountries.includes(country);
      
      if (categoryMatch && countryMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    }
  });
  
  // Update grid layout based on visible cards count
  const container = document.getElementById('cards-container');
  if (container) {
    // Remove all previous grid classes
    container.classList.remove('grid-few', 'grid-many', 'grid-all');
    
    // Apply the appropriate grid class based on visible count
    if (visibleCount <= 4) {
      container.classList.add('grid-few');
    } else if (visibleCount <= 12) {
      container.classList.add('grid-many');
    } else {
      container.classList.add('grid-all');
    }
    
    // Force grid layout refresh
    container.style.display = 'none';
    setTimeout(() => { container.style.display = 'grid'; }, 10);
  }
  
  // Save current filter states to userPreferences for persistence
  if (window.userPreferences) {
    window.userPreferences.categoryFilters = activeCategories;
    window.userPreferences.countryFilters = activeCountries;
    
    // Save settings to localStorage
    window.saveUserPreferences();
  }
  
  console.log('Card visibility updated with categories:', activeCategories, 'and countries:', activeCountries, 'Visible cards:', visibleCount);
};

// Helper function to find card data by id
function findCardData(cardId) {
  // First check in default cards
  let cardData = defaultCardData.find(card => card.id === cardId);
  
  // If not found, check in custom links
  if (!cardData && cardId.startsWith('custom-')) {
    const index = parseInt(cardId.replace('custom-', ''));
    if (window.customLinks && window.customLinks[index]) {
      cardData = {
        id: cardId,
        title: window.customLinks[index].title,
        description: window.customLinks[index].description,
        url: window.customLinks[index].url,
        logoUrl: window.customLinks[index].logoUrl,
        category: window.customLinks[index].category || 'private'
      };
    }
  }
  
  return cardData;
}

// Initialize card module
function initCardManager() {
  window.loadUserPreferences();
  processCardData();
  window.generateCards();
  
  // Restore saved filter states if available
  if (window.userPreferences) {
    // Apply category filter states
    if (window.userPreferences.categoryFilters && Array.isArray(window.userPreferences.categoryFilters)) {
      const categoryFilters = document.querySelectorAll('.category-filter');
      categoryFilters.forEach(filter => {
        const category = filter.getAttribute('data-category');
        const isActive = window.userPreferences.categoryFilters.includes(category);
        
        // Update filter state
        filter.setAttribute('data-active', isActive ? 'true' : 'false');
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
    }
    
    // Apply country filter states
    if (window.userPreferences.countryFilters && Array.isArray(window.userPreferences.countryFilters)) {
      const countryFilters = document.querySelectorAll('.country-filter');
      countryFilters.forEach(filter => {
        const country = filter.getAttribute('data-country');
        const isActive = window.userPreferences.countryFilters.includes(country);
        
        // Update filter state
        filter.setAttribute('data-active', isActive ? 'true' : 'false');
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
    }
    
    // Update card visibility based on restored filters
    window.updateCardVisibility();
  }
  
  // Add event listener to the filter cards button
  const filterCardsBtn = document.getElementById('filter-cards-btn');
  if (filterCardsBtn) {
    filterCardsBtn.addEventListener('click', window.uiManagerToggleFilterDialog);
  }
  
  // Add event listener to add custom link button
  const addCustomLinkBtn = document.getElementById('add-custom-link');
  if (addCustomLinkBtn) {
    addCustomLinkBtn.addEventListener('click', window.addCustomLink);
  }
  
  // Initialize filter dialog
  window.initFilterDialog();
}

// Initialize filter dialog
window.initFilterDialog = function() {
  const filterDialog = document.getElementById('filter-dialog');
  if (!filterDialog) return;
  
  // Setup category filter options
  const categoryFilters = document.querySelectorAll('.category-filter');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle active state for both UI and data
      const isCurrentlyActive = this.classList.contains('active');
      this.classList.toggle('active');
      this.setAttribute('data-active', !isCurrentlyActive ? 'true' : 'false');
      
      // Update visual state
      if (!isCurrentlyActive) {
        this.style.backgroundColor = '#333';
        this.style.opacity = '1';
      } else {
        this.style.backgroundColor = '#1a1a1a';
        this.style.opacity = '0.6';
      }
    });
  });
  
  // Setup country filter options
  const countryFilters = document.querySelectorAll('.country-filter');
  countryFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle active state for both UI and data
      const isCurrentlyActive = this.classList.contains('active');
      this.classList.toggle('active');
      this.setAttribute('data-active', !isCurrentlyActive ? 'true' : 'false');
      
      // Update visual state
      if (!isCurrentlyActive) {
        this.style.backgroundColor = '#333';
        this.style.opacity = '1';
      } else {
        this.style.backgroundColor = '#1a1a1a';
        this.style.opacity = '0.6';
      }
    });
  });
  
  // Apply filters button
  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
      // Apply filters to cards
      window.applyFilters();
      // Hide dialog
      window.toggleFilterDialog();
    });
  }
  
  // Reset filters button
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
      // Reset all filter options to active for both UI and data
      document.querySelectorAll('.category-filter, .country-filter').forEach(filter => {
        filter.classList.add('active');
        filter.setAttribute('data-active', 'true');
        filter.style.backgroundColor = '#333';
        filter.style.opacity = '1';
      });
    });
  }
  
  // Close button
  const closeFiltersBtn = document.getElementById('close-filters-btn');
  if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener('click', window.toggleFilterDialog);
  }
};

// Show filter dialog
window.showFilterDialog = function() {
  const filterDialog = document.getElementById('filter-dialog');
  if (filterDialog) {
    filterDialog.classList.remove('hidden');
  }
};

// Apply filters based on selected options
window.applyFilters = function() {
  // Get active category filters from the dialog UI
  const activeCategories = [];
  document.querySelectorAll('.category-filter.active').forEach(filter => {
    const category = filter.getAttribute('data-category');
    activeCategories.push(category);
    
    // Sync the state with the main filter buttons (outside the dialog)
    const mainFilterButton = document.querySelector(`.category-filter[data-category="${category}"]`);
    if (mainFilterButton) {
      mainFilterButton.setAttribute('data-active', 'true');
      mainFilterButton.classList.add('active');
      mainFilterButton.style.backgroundColor = '#333';
      mainFilterButton.style.opacity = '1';
    }
  });
  
  // Get inactive category filters to update main buttons
  document.querySelectorAll('.category-filter:not(.active)').forEach(filter => {
    const category = filter.getAttribute('data-category');
    
    // Sync the state with the main filter buttons
    const mainFilterButton = document.querySelector(`.category-filter[data-category="${category}"]`);
    if (mainFilterButton) {
      mainFilterButton.setAttribute('data-active', 'false');
      mainFilterButton.classList.remove('active');
      mainFilterButton.style.backgroundColor = '#1a1a1a';
      mainFilterButton.style.opacity = '0.6';
    }
  });
  
  // Get active country filters
  const activeCountries = [];
  document.querySelectorAll('.country-filter.active').forEach(filter => {
    const country = filter.getAttribute('data-country');
    activeCountries.push(country);
    
    // Sync the state with the main filter buttons
    const mainFilterButton = document.querySelector(`.country-filter[data-country="${country}"]`);
    if (mainFilterButton) {
      mainFilterButton.setAttribute('data-active', 'true');
      mainFilterButton.classList.add('active');
      mainFilterButton.style.backgroundColor = '#333';
      mainFilterButton.style.opacity = '1';
    }
  });
  
  // Get inactive country filters to update main buttons
  document.querySelectorAll('.country-filter:not(.active)').forEach(filter => {
    const country = filter.getAttribute('data-country');
    
    // Sync the state with the main filter buttons
    const mainFilterButton = document.querySelector(`.country-filter[data-country="${country}"]`);
    if (mainFilterButton) {
      mainFilterButton.setAttribute('data-active', 'false');
      mainFilterButton.classList.remove('active');
      mainFilterButton.style.backgroundColor = '#1a1a1a';
      mainFilterButton.style.opacity = '0.6';
    }
  });
  
  // Save current filter states to userPreferences for persistence
  if (window.userPreferences) {
    window.userPreferences.categoryFilters = activeCategories;
    window.userPreferences.countryFilters = activeCountries;
    
    // Save settings to localStorage
    window.saveUserPreferences();
  }
  
  // Force card visibility update
  window.updateCardVisibility();
};

// Show dialog to manage card visibility
window.showManageCardsDialog = function() {
  const dialog = document.getElementById('manage-cards-dialog');
  if (!dialog) return;
  
  // Get current filter states to show only cards that match current filters
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
  
  const cardListContainer = document.getElementById('card-list-container');
  cardListContainer.innerHTML = '';
  
  // Private cards should always be included
  if (!activeCategories.includes('private')) {
    activeCategories.push('private');
  }
  
  // Get all cards that match current filters
  const showAllCountries = activeCountries.length === 0;
  
  // Generate list of all cards based on the card data
  window.cardData.forEach(card => {
    // Check if card matches current filters
    const cardCategory = card.category || 'free'; // Default to free if not specified
    const cardCountry = card.country || 'intl'; // Default to international if not specified
    
    const matchesCategory = activeCategories.includes(cardCategory);
    const matchesCountry = showAllCountries || activeCountries.includes(cardCountry);
    
    // Only include card if it matches current filters
    if (matchesCategory && matchesCountry) {
      const isVisible = window.cardVisibilitySettings[card.id] !== false; // Default to visible
      
      // Create card item for the dialog
      const cardItem = document.createElement('div');
      cardItem.classList.add('card-list-item');
      cardItem.dataset.id = card.id;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isVisible;
      checkbox.id = 'card-visibility-' + card.id;
      
      const label = document.createElement('label');
      label.htmlFor = 'card-visibility-' + card.id;
      label.textContent = card.name;
      
      cardItem.appendChild(checkbox);
      cardItem.appendChild(label);
      cardListContainer.appendChild(cardItem);
      
      // Add event listener to update visibility settings when checkbox changes
      checkbox.addEventListener('change', function() {
        window.cardVisibilitySettings[card.id] = this.checked;
        window.saveUserPreferences();
        window.updateCardVisibility();
      });
    }
  });
  
  // Show the dialog
  dialog.classList.remove('hidden');
  
  // Set up event listener for close button
  const closeBtn = dialog.querySelector('.close-dialog-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      dialog.classList.add('hidden');
    });
  }
};

// Initialize card manager when DOM is loaded
document.addEventListener('DOMContentLoaded', initCardManager);