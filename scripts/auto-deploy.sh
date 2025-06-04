
#!/bin/bash

# Auto-Deploy Script für CV App
# Dieses Script wird bei GitHub Webhooks ausgeführt

set -e  # Exit bei Fehlern

# Konfiguration
APP_DIR="/var/www/cv-app"
SERVICE_NAME="cv-app"
REPO_URL="https://github.com/USERNAME/REPO-NAME.git"  # Anpassen!
BRANCH="main"

# Logging
LOG_FILE="/var/log/cv-app-deploy.log"
exec > >(tee -a $LOG_FILE)
exec 2>&1

echo "========================================="
echo "Deployment gestartet: $(date)"
echo "========================================="

# Ins App-Verzeichnis wechseln
cd $APP_DIR

# Git Pull
echo "Git Pull ausführen..."
git pull origin $BRANCH

# Dependencies installieren
echo "Dependencies installieren..."
npm ci

# Build erstellen
echo "Build erstellen..."
npm run build

# Umgebungsvariablen prüfen
if [ -f ".env.production" ]; then
    echo "Production Environment geladen"
    source .env.production
fi

# Service neustarten (falls als Service läuft)
if systemctl is-active --quiet $SERVICE_NAME; then
    echo "Service $SERVICE_NAME wird neugestartet..."
    sudo systemctl restart $SERVICE_NAME
    echo "Service neugestartet"
else
    echo "Service $SERVICE_NAME läuft nicht als systemd service"
fi

# Health Check
echo "Health Check..."
sleep 5

# Optional: Nginx reload (falls nginx als Reverse Proxy verwendet wird)
if systemctl is-active --quiet nginx; then
    echo "Nginx wird neu geladen..."
    sudo systemctl reload nginx
fi

echo "========================================="
echo "Deployment abgeschlossen: $(date)"
echo "========================================="
