// 11Kölsch Website JavaScript - Einfaches Login

// Supabase-Konfiguration
const supabaseUrl = 'https://nrkjjukeracgbpvwbjam.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ya2pqdWtlcmFjZ2JwdndiamFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTU2OTAsImV4cCI6MjA3MTYzMTY5MH0.9NtxeNVLNwcTSgNq6ug1aedvvz9oBC3SqRB3sahkhEU';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Globale Variablen
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthState();
    checkCookieConsent();
});

// App initialisieren
function initializeApp() {
    console.log('🍺 11Kölsch Website initialisiert');
}

// Event Listeners einrichten
function setupEventListeners() {
    // Auth Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
}

// Auth State prüfen
async function checkAuthState() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            currentUser = user;
            showUserContent();
        } else {
            showPublicContent();
        }
    } catch (error) {
        console.error('Auth state check error:', error);
        showPublicContent();
    }
}

// Public Content anzeigen
function showPublicContent() {
    document.getElementById('publicContent').style.display = 'block';
    document.getElementById('userContent').style.display = 'none';
}

// User Content anzeigen
function showUserContent() {
    document.getElementById('publicContent').style.display = 'none';
    document.getElementById('userContent').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('userEmailDisplay').textContent = currentUser.email;
        const firstName = currentUser.user_metadata?.first_name || '';
        const lastName = currentUser.user_metadata?.last_name || '';
        const displayName = firstName && lastName ? `${firstName} ${lastName}` : currentUser.email.split('@')[0];
        document.getElementById('userName').textContent = `Willkommen zurück, ${displayName}!`;
    }
}

// Login Form anzeigen
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

// Register Form anzeigen
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
}

// Forgot Password Form anzeigen
function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Login verarbeiten
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showMessage('Fehler beim Anmelden: ' + error.message, 'error');
            return;
        }
        
        currentUser = data.user;
        showMessage('Erfolgreich angemeldet!', 'success');
        showUserContent();
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    }
}

// Registrierung verarbeiten
async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!firstName || !lastName) {
        showMessage('Bitte gib Vor- und Nachname ein.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwörter stimmen nicht überein.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Passwort muss mindestens 6 Zeichen lang sein.', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            }
        });
        
        if (error) {
            showMessage('Fehler bei der Registrierung: ' + error.message, 'error');
            return;
        }
        
        if (data.user && !data.user.email_confirmed_at) {
            showMessage('Bitte bestätige deine E-Mail-Adresse. Wir haben dir eine Bestätigungs-E-Mail gesendet.', 'success');
        } else {
            currentUser = data.user;
            showMessage('Registrierung erfolgreich! Du kannst dich jetzt anmelden.', 'success');
            showLoginForm();
        }
        
    } catch (error) {
        console.error('Register error:', error);
        showMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    }
}

// Logout
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            showMessage('Fehler beim Abmelden: ' + error.message, 'error');
            return;
        }
        
        currentUser = null;
        showPublicContent();
        showMessage('Erfolgreich abgemeldet!', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Ein Fehler ist aufgetreten.', 'error');
    }
}

// Passwort vergessen verarbeiten
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://11koelsch.netlify.app/reset-password'
        });
        
        if (error) {
            showMessage('Fehler beim Senden der E-Mail: ' + error.message, 'error');
            return;
        }
        
        showMessage('Passwort-Reset-E-Mail wurde gesendet! Bitte überprüfe dein E-Mail-Postfach.', 'success');
        showLoginForm();
        
    } catch (error) {
        console.error('Forgot password error:', error);
        showMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    }
}

// Passwort ändern
async function changePassword() {
    const newPassword = prompt('Neues Passwort eingeben:');
    
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        showMessage('Passwort muss mindestens 6 Zeichen lang sein.', 'error');
        return;
    }
    
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) {
            showMessage('Fehler beim Ändern des Passworts: ' + error.message, 'error');
            return;
        }
        
        showMessage('Passwort erfolgreich geändert!', 'success');
        
    } catch (error) {
        console.error('Password change error:', error);
        showMessage('Ein Fehler ist aufgetreten.', 'error');
    }
}

// App öffnen
function openApp(feature) {
    const appUrl = `11koelsch://${feature}`;
    const fallbackUrl = 'https://apps.apple.com/app/11koelsch';
    
    // Versuche Deep Link
    window.location.href = appUrl;
    
    // Fallback nach 2 Sekunden
    setTimeout(() => {
        if (confirm('Die App ist nicht installiert. Möchtest du sie herunterladen?')) {
            window.open(fallbackUrl, '_blank');
        }
    }, 2000);
}

// iOS App herunterladen
function downloadIOS() {
    window.open('https://apps.apple.com/app/11koelsch', '_blank');
}

// Cookie Consent prüfen
function checkCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
        document.getElementById('cookieBanner').style.display = 'block';
    }
}

// Cookies akzeptieren
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').style.display = 'none';
    console.log('Cookies akzeptiert');
}

// Cookies ablehnen
function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieBanner').style.display = 'none';
    console.log('Cookies abgelehnt');
}

// Nachricht anzeigen
function showMessage(message, type = 'info') {
    // Einfache Alert für jetzt
    alert(message);
    
    // TODO: Schöne Toast-Nachrichten implementieren
}

// Auth State Changes abhören
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showUserContent();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showPublicContent();
    }
});





