/**
 * MyTeslaTheater - Utility Module
 * Common utility functions used across the application
 */

// Add touch support to a button element
function addTouchSupport(element) {
  if (!element) return;
  
  element.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent zoom on double tap
  });
}

// Add touch support to multiple elements
function addTouchSupportToElements(elements) {
  if (!elements || !elements.length) return;
  
  elements.forEach(element => {
    addTouchSupport(element);
  });
}

// Format date and time
function formatDateTime(date) {
  if (!date) {
    date = new Date();
  }
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return date.toLocaleDateString(undefined, options);
}

// Check if a URL is valid
function isValidUrl(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
}

// Show notification message
function showNotification(message, isError = false) {
  const notificationElement = document.getElementById('notification');
  
  if (!notificationElement) {
    // Create notification element if it doesn't exist
    const newNotification = document.createElement('div');
    newNotification.id = 'notification';
    newNotification.className = isError ? 'notification error' : 'notification';
    document.body.appendChild(newNotification);
    
    // Use the newly created element
    showNotification(message, isError);
    return;
  }
  
  // Set the message and class
  notificationElement.textContent = message;
  notificationElement.className = isError ? 'notification error' : 'notification';
  
  // Show the notification
  notificationElement.classList.add('visible');
  
  // Hide after 3 seconds
  setTimeout(() => {
    notificationElement.classList.remove('visible');
  }, 3000);
}

// Detect mobile devices
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Get element position for drag and drop
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  };
}

// Debounce function to limit how often a function can run
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if a color is light (to determine text color on backgrounds)
 * @param {string} color - Color in hex format (#RRGGBB)
 * @returns {boolean} true if color is light, false if dark
 */
function isLightColor(color) {
  if (!color) return false;
  if (color.charAt(0) === '#') {
    color = color.substr(1);
  }
  if (color.length === 3) {
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
  }
  
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness >= 128;
}

/**
 * Generate a UUID for unique IDs
 * @returns {string} - A UUID v4 string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Parse URL parameters into an object
 * @returns {Object} - Object with parameter keys and values
 */
function getUrlParams() {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Format a date for display
 * @param {Date|string} date - The date to format
 * @param {string} format - The format to use (short, medium, long)
 * @returns {string} - The formatted date string
 */
function formatDate(date, format = 'medium') {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const options = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };
  
  return date.toLocaleDateString(undefined, options[format] || options.medium);
}

/**
 * Check if the device is in dark mode
 * @returns {boolean} - True if device is in dark mode
 */
function isDeviceInDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {any} fallback - The fallback value if parsing fails
 * @returns {any} - The parsed object or fallback value
 */
function safeJsonParse(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
}

/**
 * Format a URL with protocol if missing
 * @param {string} url - URL to format
 * @returns {string} Formatted URL with protocol
 */
function formatUrl(url) {
  if (!url) return '';
  
  // Return as is if already has protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add https protocol if missing
  return 'https://' + url;
}

/**
 * Get a random ID for unique element identification
 * @returns {string} Random ID
 */
function getRandomId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Throttle function to limit rate of function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Escape HTML to prevent XSS
 * @param {string} html - String that might contain HTML
 * @returns {string} Escaped HTML string
 */
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Format date to locale string
 * @param {Date|string} date - Date object or date string
 * @param {string} locale - Locale string (e.g., 'en-US')
 * @returns {string} Formatted date string
 */
function formatDate(date, locale = 'en-US') {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get URL parameters as an object
 * @returns {Object} URL parameters as key-value pairs
 */
function getUrlParameters() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i] === '') continue;
    
    const pair = pairs[i].split('=');
    params[decodeURIComponent(pair[0])] = 
      pair.length > 1 ? decodeURIComponent(pair[1]) : '';
  }
  
  return params;
}

/**
 * Convert array to object with array item as keys
 * @param {Array} array - Array to convert
 * @param {*} value - Value to assign to keys (optional)
 * @returns {Object} Object with array items as keys
 */
function arrayToObject(array, value = true) {
  return array.reduce((obj, item) => {
    obj[item] = value;
    return obj;
  }, {});
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise} Promise that resolves when text is copied
 */
function copyToClipboard(text) {
  // Modern approach using Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Fall back to older method if Clipboard API fails
        fallbackCopyToClipboard(text);
      });
  }
  
  // Fallback for browsers that don't support Clipboard API
  return Promise.resolve(fallbackCopyToClipboard(text));
}

/**
 * Fallback method to copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {boolean} Success state
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    document.body.removeChild(textArea);
    return false;
  }
}

// Export functions if using module syntax
// export {
//   isLightColor,
//   formatUrl,
//   getRandomId,
//   debounce,
//   throttle,
//   safeJsonParse,
//   truncateText,
//   escapeHtml,
//   isMobileDevice,
//   formatDate,
//   getUrlParameters,
//   arrayToObject,
//   copyToClipboard
// };