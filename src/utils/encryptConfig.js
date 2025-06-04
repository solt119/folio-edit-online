
// Hilfsskript zum Verschlüsseln neuer Supabase-Konfigurationen
// Dieses Skript wird nicht in der App verwendet, sondern nur für die Entwicklung

const encrypt = (text) => {
  const key = 'cv-app-2024'
  let result = ''
  
  // XOR Verschlüsselung
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }
  
  // Base64 kodieren
  return btoa(result)
}

// Beispiel-Verwendung:
// console.log('Encrypted URL:', encrypt('https://your-project.supabase.co'))
// console.log('Encrypted Key:', encrypt('your-anon-key'))

module.exports = { encrypt }
