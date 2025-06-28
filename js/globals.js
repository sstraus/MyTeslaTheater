/**
 * MyTeslaTheater - Globals Module
 * Central repository for shared variables and functions
 */

// Initialize shared variables with default values
window.userPreferences = {};
window.customLinks = [];
window.cardVisibilitySettings = {};
window.selectedCardColor = '#444444';
window.cardOrder = {};
window.categoryFilters = {
  paid: true,
  free: true,
  social: true
};

// Declare function existence for functions shared across modules
window.saveUserPreferences = null;
window.loadUserPreferences = null;
window.generateCards = null;
window.renderCustomLinksList = null;
window.toggleCardVisibility = null;
window.updateCardColors = null;
window.updateSelectedColorOption = null;
window.toggleSettingsPanel = null;
window.addCustomLink = null;
window.isLightColor = null;
window.showCardVisibilityManager = null;
window.initDragDrop = null;
window.initVisibilityToggleListeners = null;
window.generateCardElement = null;
window.setupCategoryFilters = null;
window.animateElement = null;
window.getLang = null;
window.initLanguage = null;
window.showNotification = null;

// Helper function to determine if a color is light or dark
window.isLightColor = function(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};