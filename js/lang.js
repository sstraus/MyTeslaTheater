/**
 * MyTeslaTheater - Language Module
 * Handles translations and language detection
 */

// Define language data with translations
const languageData = {
  en: {
    // UI elements
    allCategories: 'All',
    showCustomization: 'Show Customization',
    hideCustomization: 'Hide Customization',
    customizationTitle: 'Customize Your Experience',
    cardColorTitle: 'Card Color',
    addLinkTitle: 'Add Your Own Link',
    savedCustomLinks: 'Your Custom Links',
    noCustomLinks: 'You have no custom links yet.',
    customLinkLabel: 'Custom',
    addLinkNamePlaceholder: 'Website Name',
    addLinkUrlPlaceholder: 'URL (https://...)',
    addLinkDescPlaceholder: 'Description (optional)',
    addLinkLogoPlaceholder: 'Logo URL (optional)',
    addLinkButton: 'Add Link',
    
    // Categories
    categoryPaid: 'Paid Subscriptions',
    categoryFree: 'Free Content',
    categorySocial: 'Social Media',
    categoryPrivate: 'Private (Always Visible)',
    
    // Dialogs
    fullscreenDialogTitle: 'Optimized for Tesla Browser',
    fullscreenDialogSubtitle: 'For the best experience, would you like to go to YouTube fullscreen mode?',
    cardVisibilityTitle: 'Manage Cards',
    cardVisibilitySubtitle: 'Select which cards to show and change their order',
    dragDropInstructions: 'Drag and drop items to reorder them.',
    
    // Buttons
    toggleVisibility: 'Toggle visibility',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    yes: 'Yes',
    no: 'No',
    
    // Messages
    errorEmptyFields: 'Please fill in both the name and URL fields.',
    errorUrlRequired: 'URL must start with http:// or https://',
    customLinkDefaultDesc: 'Custom link',
    footerCopyright: '© 2025 MyTeslaTheater - Created for Tesla owners. No affiliation with Tesla, Inc.',
    
    // JSONBlob feature
    jsonBlobTitle: 'Cloud Backup',
    jsonBlobInfo: 'JSONBlob.com is a public service. Your data is not encrypted. Expires after 30 days of inactivity.',
    enableJsonBlob: 'Enable cloud backup',
    jsonBlobIdPlaceholder: 'JSONBlob ID',
    loadJsonBlob: 'Load',
    jsonBlobSuccess: 'Settings saved to cloud successfully!',
    jsonBlobError: 'Error saving settings to cloud.',
    jsonBlobLoadSuccess: 'Settings loaded from cloud successfully!',
    jsonBlobLoadError: 'Error loading settings from cloud.'
  },
  
  it: {
    // UI elements
    allCategories: 'Tutti',
    showCustomization: 'Mostra Personalizzazione',
    hideCustomization: 'Nascondi Personalizzazione',
    customizationTitle: 'Personalizza la Tua Esperienza',
    cardColorTitle: 'Colore Carta',
    addLinkTitle: 'Aggiungi Link Personalizzato',
    savedCustomLinks: 'I Tuoi Link Personalizzati',
    noCustomLinks: 'Non hai ancora link personalizzati.',
    customLinkLabel: 'Personalizzato',
    addLinkNamePlaceholder: 'Nome Sito Web',
    addLinkUrlPlaceholder: 'URL (https://...)',
    addLinkDescPlaceholder: 'Descrizione (opzionale)',
    addLinkLogoPlaceholder: 'URL Logo (opzionale)',
    addLinkButton: 'Aggiungi',
    
    // Categories
    categoryPaid: 'Abbonamenti a Pagamento',
    categoryFree: 'Contenuti Gratuiti',
    categorySocial: 'Social Media',
    categoryPrivate: 'Privato (Sempre Visibile)',
    
    // Dialogs
    fullscreenDialogTitle: 'Ottimizzato per Browser Tesla',
    fullscreenDialogSubtitle: 'Per la migliore esperienza, desideri passare alla modalità a schermo intero di YouTube?',
    cardVisibilityTitle: 'Gestisci Carte',
    cardVisibilitySubtitle: 'Seleziona quali carte mostrare e cambia il loro ordine',
    dragDropInstructions: 'Trascina gli elementi per riordinarli.',
    
    // Buttons
    toggleVisibility: 'Attiva/disattiva visibilità',
    confirm: 'Conferma',
    cancel: 'Annulla',
    save: 'Salva',
    yes: 'Sì',
    no: 'No',
    
    // Messages
    errorEmptyFields: 'Compila sia il campo nome che URL.',
    errorUrlRequired: 'L\'URL deve iniziare con http:// o https://',
    customLinkDefaultDesc: 'Link personalizzato',
    footerCopyright: '© 2025 MyTeslaTheater - Creato per i proprietari Tesla. Nessuna affiliazione con Tesla, Inc.',
    
    // JSONBlob feature
    jsonBlobTitle: 'Backup Cloud',
    jsonBlobInfo: 'JSONBlob.com è un servizio pubblico. I tuoi dati non sono criptati. Scade dopo 30 giorni di inattività.',
    enableJsonBlob: 'Abilita backup cloud',
    jsonBlobIdPlaceholder: 'ID JSONBlob',
    loadJsonBlob: 'Carica',
    jsonBlobSuccess: 'Impostazioni salvate nel cloud con successo!',
    jsonBlobError: 'Errore nel salvare le impostazioni nel cloud.',
    jsonBlobLoadSuccess: 'Impostazioni caricate dal cloud con successo!',
    jsonBlobLoadError: 'Errore nel caricare le impostazioni dal cloud.'
  },
  
  fr: {
    // UI elements
    allCategories: 'Tous',
    showCustomization: 'Afficher Personnalisation',
    hideCustomization: 'Masquer Personnalisation',
    customizationTitle: 'Personnalisez Votre Expérience',
    cardColorTitle: 'Couleur de Carte',
    addLinkTitle: 'Ajouter Votre Propre Lien',
    savedCustomLinks: 'Vos Liens Personnalisés',
    noCustomLinks: 'Vous n\'avez pas encore de liens personnalisés.',
    customLinkLabel: 'Personnalisé',
    addLinkNamePlaceholder: 'Nom du Site Web',
    addLinkUrlPlaceholder: 'URL (https://...)',
    addLinkDescPlaceholder: 'Description (facultatif)',
    addLinkLogoPlaceholder: 'URL du Logo (facultatif)',
    addLinkButton: 'Ajouter',
    
    // Categories
    categoryPaid: 'Abonnements Payants',
    categoryFree: 'Contenu Gratuit',
    categorySocial: 'Médias Sociaux',
    categoryPrivate: 'Privé (Toujours Visible)',
    
    // Dialogs
    fullscreenDialogTitle: 'Optimisé pour le Navigateur Tesla',
    fullscreenDialogSubtitle: 'Pour une meilleure expérience, souhaitez-vous passer en mode plein écran YouTube?',
    cardVisibilityTitle: 'Gérer les Cartes',
    cardVisibilitySubtitle: 'Sélectionnez les cartes à afficher et modifiez leur ordre',
    dragDropInstructions: 'Glissez et déposez les éléments pour les réorganiser.',
    
    // Buttons
    toggleVisibility: 'Activer/désactiver visibilité',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    yes: 'Oui',
    no: 'Non',
    
    // Messages
    errorEmptyFields: 'Veuillez remplir les champs nom et URL.',
    errorUrlRequired: 'L\'URL doit commencer par http:// ou https://',
    customLinkDefaultDesc: 'Lien personnalisé',
    footerCopyright: '© 2025 MyTeslaTheater - Créé pour les propriétaires Tesla. Aucune affiliation avec Tesla, Inc.',
    
    // JSONBlob feature
    jsonBlobTitle: 'Sauvegarde Cloud',
    jsonBlobInfo: 'JSONBlob.com est un service public. Vos données ne sont pas cryptées. Expire après 30 jours d\'inactivité.',
    enableJsonBlob: 'Activer sauvegarde cloud',
    jsonBlobIdPlaceholder: 'ID JSONBlob',
    loadJsonBlob: 'Charger',
    jsonBlobSuccess: 'Paramètres sauvegardés dans le cloud avec succès!',
    jsonBlobError: 'Erreur lors de la sauvegarde des paramètres dans le cloud.',
    jsonBlobLoadSuccess: 'Paramètres chargés depuis le cloud avec succès!',
    jsonBlobLoadError: 'Erreur lors du chargement des paramètres depuis le cloud.'
  },
  
  de: {
    // UI elements
    allCategories: 'Alle',
    showCustomization: 'Anpassungen anzeigen',
    hideCustomization: 'Anpassungen ausblenden',
    customizationTitle: 'Passen Sie Ihr Erlebnis an',
    cardColorTitle: 'Kartenfarbe',
    addLinkTitle: 'Eigenen Link hinzufügen',
    savedCustomLinks: 'Ihre benutzerdefinierten Links',
    noCustomLinks: 'Sie haben noch keine benutzerdefinierten Links.',
    customLinkLabel: 'Benutzerdefiniert',
    addLinkNamePlaceholder: 'Website-Name',
    addLinkUrlPlaceholder: 'URL (https://...)',
    addLinkDescPlaceholder: 'Beschreibung (optional)',
    addLinkLogoPlaceholder: 'Logo-URL (optional)',
    addLinkButton: 'Hinzufügen',
    
    // Categories
    categoryPaid: 'Bezahlte Abonnements',
    categoryFree: 'Kostenlose Inhalte',
    categorySocial: 'Soziale Medien',
    categoryPrivate: 'Privat (Immer sichtbar)',
    
    // Dialogs
    fullscreenDialogTitle: 'Optimiert für Tesla-Browser',
    fullscreenDialogSubtitle: 'Möchten Sie für ein besseres Erlebnis in den YouTube-Vollbildmodus wechseln?',
    cardVisibilityTitle: 'Karten verwalten',
    cardVisibilitySubtitle: 'Wählen Sie aus, welche Karten angezeigt werden sollen, und ändern Sie ihre Reihenfolge',
    dragDropInstructions: 'Ziehen Sie Elemente, um sie neu anzuordnen.',
    
    // Buttons
    toggleVisibility: 'Sichtbarkeit umschalten',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    yes: 'Ja',
    no: 'Nein',
    
    // Messages
    errorEmptyFields: 'Bitte füllen Sie sowohl das Name- als auch das URL-Feld aus.',
    errorUrlRequired: 'URL muss mit http:// oder https:// beginnen',
    customLinkDefaultDesc: 'Benutzerdefinierter Link',
    footerCopyright: '© 2025 MyTeslaTheater - Erstellt für Tesla-Besitzer. Keine Verbindung zu Tesla, Inc.',
    
    // JSONBlob feature
    jsonBlobTitle: 'Cloud-Backup',
    jsonBlobInfo: 'JSONBlob.com ist ein öffentlicher Dienst. Ihre Daten sind nicht verschlüsselt. Läuft nach 30 Tagen Inaktivität ab.',
    enableJsonBlob: 'Cloud-Backup aktivieren',
    jsonBlobIdPlaceholder: 'JSONBlob-ID',
    loadJsonBlob: 'Laden',
    jsonBlobSuccess: 'Einstellungen erfolgreich in der Cloud gespeichert!',
    jsonBlobError: 'Fehler beim Speichern der Einstellungen in der Cloud.',
    jsonBlobLoadSuccess: 'Einstellungen erfolgreich aus der Cloud geladen!',
    jsonBlobLoadError: 'Fehler beim Laden der Einstellungen aus der Cloud.'
  },
  
  es: {
    // UI elements
    allCategories: 'Todos',
    showCustomization: 'Mostrar Personalización',
    hideCustomization: 'Ocultar Personalización',
    customizationTitle: 'Personaliza Tu Experiencia',
    cardColorTitle: 'Color de Tarjeta',
    addLinkTitle: 'Añadir Tu Propio Enlace',
    savedCustomLinks: 'Tus Enlaces Personalizados',
    noCustomLinks: 'Aún no tienes enlaces personalizados.',
    customLinkLabel: 'Personalizado',
    addLinkNamePlaceholder: 'Nombre del Sitio Web',
    addLinkUrlPlaceholder: 'URL (https://...)',
    addLinkDescPlaceholder: 'Descripción (opcional)',
    addLinkLogoPlaceholder: 'URL del Logo (opcional)',
    addLinkButton: 'Añadir',
    
    // Categories
    categoryPaid: 'Suscripciones de Pago',
    categoryFree: 'Contenido Gratuito',
    categorySocial: 'Redes Sociales',
    categoryPrivate: 'Privado (Siempre Visible)',
    
    // Dialogs
    fullscreenDialogTitle: 'Optimizado para Navegador Tesla',
    fullscreenDialogSubtitle: '¿Deseas cambiar al modo de pantalla completa de YouTube para una mejor experiencia?',
    cardVisibilityTitle: 'Gestionar Tarjetas',
    cardVisibilitySubtitle: 'Selecciona qué tarjetas mostrar y cambia su orden',
    dragDropInstructions: 'Arrastra y suelta los elementos para reordenarlos.',
    
    // Buttons
    toggleVisibility: 'Alternar visibilidad',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Guardar',
    yes: 'Sí',
    no: 'No',
    
    // Messages
    errorEmptyFields: 'Por favor, rellena los campos de nombre y URL.',
    errorUrlRequired: 'La URL debe comenzar con http:// o https://',
    customLinkDefaultDesc: 'Enlace personalizado',
    footerCopyright: '© 2025 MyTeslaTheater - Creado para propietarios de Tesla. Sin afiliación con Tesla, Inc.',
    
    // JSONBlob feature
    jsonBlobTitle: 'Respaldo en la Nube',
    jsonBlobInfo: 'JSONBlob.com es un servicio público. Tus datos no están cifrados. Caduca después de 30 días de inactividad.',
    enableJsonBlob: 'Habilitar respaldo en la nube',
    jsonBlobIdPlaceholder: 'ID de JSONBlob',
    loadJsonBlob: 'Cargar',
    jsonBlobSuccess: '¡Configuración guardada en la nube con éxito!',
    jsonBlobError: 'Error al guardar la configuración en la nube.',
    jsonBlobLoadSuccess: '¡Configuración cargada desde la nube con éxito!',
    jsonBlobLoadError: 'Error al cargar la configuración desde la nube.'
  }
};

// Current language setting (default to browser language or fallback to English)
let currentLanguage = 'en';

// Get text in current language
window.getLang = function(key) {
  // Try to get the key in current language
  if (languageData[currentLanguage] && languageData[currentLanguage][key]) {
    return languageData[currentLanguage][key];
  }
  
  // Fallback to English
  if (languageData.en && languageData.en[key]) {
    return languageData.en[key];
  }
  
  // If all else fails, return the key itself
  return key;
};

// Initialize language settings
window.initLanguage = function() {
  // Try to detect browser language
  let browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    // Get first two characters (language code)
    browserLang = browserLang.substring(0, 2).toLowerCase();
    
    // Check if we have this language
    if (languageData[browserLang]) {
      currentLanguage = browserLang;
    }
  }
  
  // Check if user has a saved language preference
  const savedPrefs = localStorage.getItem('myteslatheater_preferences');
  if (savedPrefs) {
    try {
      const preferences = JSON.parse(savedPrefs);
      if (preferences.language && languageData[preferences.language]) {
        currentLanguage = preferences.language;
      }
    } catch (e) {
      console.error('Error loading language preference:', e);
    }
  }
};