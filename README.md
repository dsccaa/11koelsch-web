# 11Kölsch Web

Die offizielle Website für die 11Kölsch iOS App.

## Features

- **Landing Page**: Moderne, responsive Website mit 11Kölsch Branding
- **User Authentication**: Login/Registrierung mit Supabase
- **Profil-Seite**: Für eingeloggte User - zeigt nur Profil und leitet zu iOS App weiter
- **Email Confirmation**: Bestätigungs-Seite für E-Mail-Verifizierung
- **PWA Ready**: Progressive Web App Funktionalität

## Technologien

- HTML5, CSS3, JavaScript
- Supabase für Authentication
- Netlify für Hosting
- Responsive Design mit Glassmorphism

## Deployment

Die Website wird automatisch über Netlify deployed:
- **Production**: https://11koelsch.netlify.app
- **Confirmation Page**: https://11koelsch-confirm.netlify.app

## Repository Struktur

```
├── index.html          # Haupt-Website
├── styles.css          # Styling
├── app.js             # JavaScript für Auth & Interaktionen
├── netlify.toml       # Netlify Konfiguration
├── confirmation.html  # E-Mail Bestätigungs-Seite
└── README.md          # Diese Datei
```

## Setup

1. Repository klonen
2. Netlify mit GitHub verbinden
3. Environment Variables in Netlify setzen:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## iOS App Integration

Die Website ist darauf ausgelegt, eingeloggte User zur iOS App weiterzuleiten:
- Deep Links für App-Öffnung
- Profil-Übersicht auf der Website
- Alle erweiterten Features nur in der iOS App

## Support

Bei Fragen: support@11koelsch.de