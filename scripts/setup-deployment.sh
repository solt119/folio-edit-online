
#!/bin/bash

# Setup Script für automatisches Deployment auf Debian 10

echo "CV App Deployment Setup wird gestartet..."

# System Updates
sudo apt update
sudo apt upgrade -y

# Node.js und npm installieren (falls nicht vorhanden)
if ! command -v node &> /dev/null; then
    echo "Node.js wird installiert..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Git installieren (falls nicht vorhanden)
if ! command -v git &> /dev/null; then
    echo "Git wird installiert..."
    sudo apt install -y git
fi

# Nginx installieren (Optional - als Reverse Proxy)
if ! command -v nginx &> /dev/null; then
    echo "Nginx wird installiert..."
    sudo apt install -y nginx
fi

# PM2 für Process Management installieren
sudo npm install -g pm2

# App-Verzeichnis erstellen
sudo mkdir -p /var/www/cv-app
sudo chown $USER:$USER /var/www/cv-app

# Repository klonen (Anpassen Sie die URL!)
cd /var/www/cv-app
echo "Bitte geben Sie Ihre GitHub Repository URL ein:"
read REPO_URL
git clone $REPO_URL .

# Dependencies installieren
npm install

# Webhook Server Dependencies
cd scripts
npm init -y
npm install express

# Deployment Script ausführbar machen
chmod +x auto-deploy.sh
chmod +x setup-deployment.sh

# PM2 Ecosystem Datei erstellen
cd /var/www/cv-app

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'cv-app',
      script: 'npm',
      args: 'run preview',
      cwd: '/var/www/cv-app',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'webhook-server',
      script: 'scripts/webhook-server.js',
      cwd: '/var/www/cv-app',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

echo "Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Bearbeiten Sie scripts/webhook-server.js und setzen Sie Ihr WEBHOOK_SECRET"
echo "2. Erstellen Sie eine .env.production Datei mit Ihren Umgebungsvariablen"
echo "3. Starten Sie die Services mit: pm2 start ecosystem.config.js"
echo "4. Konfigurieren Sie GitHub Webhooks auf http://ihr-server:3001/webhook"
echo "5. Optional: Nginx als Reverse Proxy konfigurieren"
