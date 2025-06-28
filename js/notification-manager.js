/**
 * MyTeslaTheater - Notification Manager Module
 * Handles user notifications and confirmations
 */

// Display a notification to the user
window.showNotification = function(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Set notification style based on type
  let bgColor = '#2196F3'; // Default blue for info
  if (type === 'success') {
    bgColor = '#4CAF50'; // Green
  } else if (type === 'error') {
    bgColor = '#F44336'; // Red
  } else if (type === 'warning') {
    bgColor = '#FF9800'; // Orange
  }
  
  // Apply styles
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background-color: ${bgColor};
    color: white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-width: 80%;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
  `;
  
  // Add message content
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Auto-remove after specified duration
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    // Remove from DOM after fade out animation completes
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, duration);
  
  return notification;
};

// Show a confirmation dialog with a promise-based API
window.showConfirmation = function(message, confirmText = 'Confirm', cancelText = 'Cancel') {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirmation-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;
    
    // Create confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.style.cssText = `
      background-color: #1f1f1f;
      color: white;
      border-radius: 10px;
      padding: 20px;
      max-width: 90%;
      width: 400px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    `;
    
    // Dialog content
    dialog.innerHTML = `
      <p style="margin-top: 0; margin-bottom: 20px; font-size: 16px;">${message}</p>
      <div style="display: flex; justify-content: space-between; gap: 10px;">
        <button id="confirm-cancel" style="flex: 1; background-color: #555; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer;">${cancelText}</button>
        <button id="confirm-accept" style="flex: 1; background-color: #0066cc; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer;">${confirmText}</button>
      </div>
    `;
    
    // Add dialog to overlay
    overlay.appendChild(dialog);
    
    // Add to document
    document.body.appendChild(overlay);
    
    // Add event listeners
    document.getElementById('confirm-accept').addEventListener('click', function() {
      document.body.removeChild(overlay);
      resolve(true);
    });
    
    document.getElementById('confirm-cancel').addEventListener('click', function() {
      document.body.removeChild(overlay);
      resolve(false);
    });
  });
};