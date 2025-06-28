/**
 * MyTeslaTheater - Error Handler Module
 * Centralized error handling and reporting
 */

/**
 * Log and handle errors throughout the application
 * @param {Error|string} error - The error object or message
 * @param {string} source - Where the error occurred
 * @param {boolean} notify - Whether to show a notification to the user
 */
function handleError(error, source = 'unknown', notify = true) {
  // Get error message from either Error object or string
  const errorMessage = error instanceof Error ? error.message : error;
  
  // Log to console with source context
  console.error(`[${source}] ${errorMessage}`, error);
  
  // Show notification to user if needed
  if (notify && typeof showNotification === 'function') {
    showNotification(errorMessage, true);
  }
  
  // In development mode, we could add more detailed logging
  if (isDevelopmentMode()) {
    logDetailedError(error, source);
  }
}

/**
 * Log more detailed error information in development mode
 * @param {Error} error - The error object
 * @param {string} source - Error source
 */
function logDetailedError(error, source) {
  if (error instanceof Error && error.stack) {
    console.debug(`[${source}] Error Stack:`, error.stack);
  }
  
  // Could add error tracking service integration here
}

/**
 * Check if we're in development mode
 * @returns {boolean}
 */
function isDevelopmentMode() {
  // Simple check for debug mode
  return window.location.href.includes('debug.html') || 
         localStorage.getItem('debug_mode') === 'true';
}

/**
 * Global error handler for uncaught exceptions
 */
window.addEventListener('error', function(event) {
  handleError(event.error || event.message, 'window.onerror', true);
  
  // Prevent default browser error handling
  event.preventDefault();
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
  handleError(event.reason || 'Unhandled Promise Rejection', 'promise', true);
  
  // Prevent default browser error handling
  event.preventDefault();
});