# MyTeslaTheater

A customizable dashboard for accessing streaming services, websites, and custom content directly from your Tesla's browser.

## Overview

MyTeslaTheater provides a sleek, user-friendly interface optimized for Tesla's in-car browser, giving you quick access to popular streaming services and websites. The application features a card-based layout that can be fully customized to suit your preferences.

![MyTeslaTheater Screenshot](assets/img/screenshot.png)

## Features

- **Streaming Service Cards**: Quick access to popular streaming platforms like Netflix, Disney+, YouTube, and many more
- **Custom Links**: Add your own websites with custom titles, descriptions, and logos
- **Category Filters**: Filter content by type (free, paid, social, private)
- **Country Filters**: Filter content by regional availability
- **Customizable UI**: Change card colors and layout to match your preferences
- **Settings Storage**: Save your preferences locally or sync across devices using JSONBlob
- **Export/Import**: Backup and restore your custom configuration

## How to Use

### Main Interface

The main screen displays a grid of cards for various streaming services and websites. Each card shows:
- Service logo
- Service name
- Brief description 
- Clicking any card opens that service in the browser

### Navigation Bar

The top navigation bar contains several buttons and controls:

- **Category Filters**: Buttons to filter content by type
  - **All**: Show all available content
  - **Free**: Show only free streaming services
  - **Paid**: Show only paid subscription services
  - **Social**: Show social media platforms
  - **Private**: Show your custom added links

- **Country Filters**: Buttons to filter content by region
  - **All**: Show content from all regions
  - **International**: Show globally available content
  - **Country-specific buttons**: Filter by specific regions (US, UK, Germany, etc.)

- **Settings Button**: Opens the settings modal where you can customize the application

### Settings Modal

The settings modal contains several tabs for customizing your experience:

#### Custom Links
- **Add New Link**: Create custom website cards
  - Title: Name of the website
  - Description: Brief description of the website
  - URL: The website address
  - Logo URL: Optional custom logo image URL
  - Category: Assign to a category for filtering

- **Manage Links**: Edit or delete your custom links

#### Appearance
- **Card Color**: Choose from preset colors or set a custom color
- **Card Order**: Rearrange the order of service cards
- **Card Visibility**: Show/hide specific service cards

#### Sync & Storage
- **JSONBlob Sync**: Enable cloud synchronization of your settings
  - Create New: Generate a new JSONBlob ID
  - Load Existing: Load settings from an existing JSONBlob ID
  - Current ID: View or copy your current JSONBlob ID

- **Export/Import**:
  - Export Settings: Download your settings as a JSON file
  - Import Settings: Upload a previously exported settings file

- **Reset**: Reset all settings to default values

### Modal Behavior

- Modals can be closed by clicking the X button, clicking outside the modal, or pressing the ESC key
- Changes in settings are automatically saved and applied immediately
- Notifications appear at the bottom of the screen to confirm actions or show errors

## Tips for Tesla Browser Use

- Bookmark the application for quick access
- Use the browser's fullscreen mode for the best experience
- When using JSONBlob sync, save the URL with your JSONBlob ID for easy access across devices

## Technical Information

- The application runs entirely client-side with no backend requirements
- Settings are stored in your browser's localStorage or optionally in a JSONBlob
- All streaming services open in the Tesla browser, respecting each service's compatibility with the in-car browser

## Privacy

- Your preferences are stored locally in your browser
- If using JSONBlob sync, your settings are stored in a public JSONBlob (only accessible to those with the ID)
- No personal data is collected or transmitted besides what you explicitly configure for synchronization

## Credits

MyTeslaTheater is an open-source project designed to enhance the Tesla in-car entertainment experience.