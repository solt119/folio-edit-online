
const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const app = express();

// Konfiguration
const PORT = 3001;
const WEBHOOK_SECRET = 'IHR_WEBHOOK_SECRET'; // Ändern Sie dies!
const DEPLOY_SCRIPT = '/var/www/cv-app/scripts/auto-deploy.sh';

app.use(express.json());

// Webhook Endpoint
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Signatur verifizieren
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
    
    if (signature !== expectedSignature) {
        console.log('Ungültige Signatur');
        return res.status(401).send('Unauthorized');
    }
    
    // Nur auf Push zu main branch reagieren
    if (req.body.ref === 'refs/heads/main') {
        console.log('Deployment wird gestartet...');
        
        exec(DEPLOY_SCRIPT, (error, stdout, stderr) => {
            if (error) {
                console.error('Deployment Fehler:', error);
                return res.status(500).send('Deployment failed');
            }
            
            console.log('Deployment erfolgreich:', stdout);
            res.status(200).send('Deployment successful');
        });
    } else {
        res.status(200).send('Ignored - not main branch');
    }
});

app.listen(PORT, () => {
    console.log(`Webhook Server läuft auf Port ${PORT}`);
});
