// 11Kölsch Website JavaScript - Komplettes Design

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
    setupSmoothScrolling();
    setupIntersectionObserver();
});

// App initialisieren
function initializeApp() {
    console.log('🍺 11Kölsch Website initialisiert');
}

// Event Listeners einrichten
function setupEventListeners() {
    // Auth Buttons
    document.getElementById('loginBtn').addEventListener('click', showLoginForm);
    document.getElementById('registerBtn').addEventListener('click', showRegisterForm);
    
    // Auth Forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Contact Form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
    // Modal schließen bei Klick außerhalb
    document.getElementById('authModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });
}

// Smooth Scrolling für Navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer für aktive Navigation
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
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
    document.getElementById('navButtons').style.display = 'flex';
    document.getElementById('userMenu').style.display = 'none';
}

// User Content anzeigen
function showUserContent() {
    document.getElementById('publicContent').style.display = 'none';
    document.getElementById('userContent').style.display = 'block';
    document.getElementById('navButtons').style.display = 'none';
    document.getElementById('userMenu').style.display = 'flex';
    
    if (currentUser) {
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userEmailDisplay').textContent = currentUser.email;
        document.getElementById('userName').textContent = `Willkommen zurück, ${currentUser.email.split('@')[0]}!`;
    }
}

// Login Form anzeigen
function showLoginForm() {
    document.getElementById('authModal').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// Register Form anzeigen
function showRegisterForm() {
    document.getElementById('authModal').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Auth Modal schließen
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
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
        closeAuthModal();
        showUserContent();
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    }
}

// Registrierung verarbeiten
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
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
            password: password
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

// Contact Form verarbeiten
async function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // Hier würde normalerweise eine API-Anfrage an den Server gesendet
    // Für jetzt simulieren wir eine erfolgreiche Übermittlung
    showMessage('Nachricht erfolgreich gesendet! Wir melden uns bald bei dir.', 'success');
    
    // Form zurücksetzen
    document.getElementById('contactForm').reset();
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

// Android App herunterladen
function downloadAndroid() {
    window.open('https://play.google.com/store/apps/details?id=com.koelsch.app', '_blank');
}

// Scroll zu Download Section
function scrollToDownload() {
    document.getElementById('download').scrollIntoView({
        behavior: 'smooth'
    });
}

// Scroll zu Features Section
function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Terms anzeigen
function showTerms() {
    alert('Nutzungsbedingungen werden hier angezeigt.');
}

// Privacy anzeigen
function showPrivacy() {
    alert('Datenschutzerklärung wird hier angezeigt.');
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

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAuthModal();
    }
});

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Zeige Install Button
    const installBtn = document.createElement('button');
    installBtn.textContent = 'App installieren';
    installBtn.className = 'btn-primary';
    installBtn.onclick = installPWA;
    
    const header = document.querySelector('.header-content');
    header.appendChild(installBtn);
});

async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA installation: ${outcome}`);
        deferredPrompt = null;
    }
}