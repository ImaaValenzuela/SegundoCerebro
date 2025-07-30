#!/usr/bin/env node

/**
 * Script para verificar la configuración de Google Auth
 * Uso: node scripts/check-google-auth.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Google Auth...\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('📁 Archivo .env.local:', envExists ? '✅ Encontrado' : '❌ No encontrado');

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar variables requeridas
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID'
  ];
  
  console.log('\n🔧 Variables de entorno requeridas:');
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    const isConfigured = envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`);
    console.log(`  ${varName}: ${hasVar ? (isConfigured ? '✅ Configurada' : '⚠️  Sin configurar') : '❌ Faltante'}`);
  });
  
  // Extraer valores para verificación
  const getEnvValue = (varName) => {
    const match = envContent.match(new RegExp(`${varName}=(.+)`));
    return match ? match[1].trim() : null;
  };
  
  const googleClientId = getEnvValue('NEXT_PUBLIC_GOOGLE_CLIENT_ID');
  const firebaseAuthDomain = getEnvValue('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  
  console.log('\n🔍 Valores específicos:');
  console.log(`  Google Client ID: ${googleClientId ? '✅ Configurado' : '❌ Faltante'}`);
  console.log(`  Firebase Auth Domain: ${firebaseAuthDomain ? '✅ Configurado' : '❌ Faltante'}`);
  
  if (googleClientId && !googleClientId.includes('1076073928473-25hlau72eltqgmh4k0bi6uaosfpvv4ng')) {
    console.log('⚠️  El Google Client ID no coincide con el esperado');
  }
} else {
  console.log('\n📝 Crear archivo .env.local con las siguientes variables:');
  console.log(`
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1076073928473-25hlau72eltqgmh4k0bi6uaosfpvv4ng.apps.googleusercontent.com
  `);
}

// Verificar archivos de configuración
console.log('\n📂 Archivos de configuración:');

const configFiles = [
  'lib/firebase.ts',
  'lib/google-auth-config.ts',
  'contexts/auth-context.tsx',
  'hooks/use-google-auth.ts'
];

configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${file}: ${exists ? '✅ Existe' : '❌ No existe'}`);
});

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasFirebase = packageJson.dependencies && packageJson.dependencies.firebase;
  console.log(`  Firebase en package.json: ${hasFirebase ? '✅ Instalado' : '❌ No instalado'}`);
}

console.log('\n🎯 Próximos pasos:');
console.log('1. Asegúrate de tener todas las variables de entorno configuradas');
console.log('2. Verifica que Google Auth esté habilitado en Firebase Console');
console.log('3. Confirma que el dominio esté autorizado en Google Cloud Console');
console.log('4. Prueba la autenticación en el dashboard de debug');
console.log('5. Revisa la consola del navegador para errores específicos');

console.log('\n📚 Documentación:');
console.log('- GOOGLE_AUTH_SETUP.md - Guía completa de configuración');
console.log('- SOLUCION_AUTENTICACION.md - Solución al problema de enlace de datos');

console.log('\n✨ ¡Listo! Revisa los resultados arriba para identificar problemas.'); 