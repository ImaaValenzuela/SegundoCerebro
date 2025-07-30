// Configuración para emails de restablecimiento de contraseña
export const passwordResetConfig = {
  // URL de acción para el email (opcional)
  actionCodeSettings: {
    // URL a la que se redirige después de hacer clic en el enlace del email
    url: process.env.NEXT_PUBLIC_PASSWORD_RESET_URL || 'http://localhost:3000/login',
    // Manejar el enlace en la aplicación móvil si es necesario
    handleCodeInApp: true,
    // Configuración para iOS
    iOS: {
      bundleId: 'com.segundocerebro.app'
    },
    // Configuración para Android
    android: {
      packageName: 'com.segundocerebro.app',
      installApp: true,
      minimumVersion: '12'
    },
    // Configuración para enlaces dinámicos
    dynamicLinkDomain: process.env.NEXT_PUBLIC_DYNAMIC_LINK_DOMAIN
  },
  
  // Plantillas de email personalizadas (configurar en Firebase Console)
  emailTemplates: {
    // Configurar en Firebase Console > Authentication > Templates
    // - Action code: Password reset
    // - Subject: "Restablece tu contraseña de Segundo Cerebro"
    // - HTML: Personalizar el diseño del email
    // - Text: Versión de texto plano
  }
}

// Función para obtener la configuración de acción
export const getActionCodeSettings = () => {
  return {
    url: passwordResetConfig.actionCodeSettings.url,
    handleCodeInApp: passwordResetConfig.actionCodeSettings.handleCodeInApp,
    ...(passwordResetConfig.actionCodeSettings.iOS && {
      iOS: passwordResetConfig.actionCodeSettings.iOS
    }),
    ...(passwordResetConfig.actionCodeSettings.android && {
      android: passwordResetConfig.actionCodeSettings.android
    }),
    ...(passwordResetConfig.actionCodeSettings.dynamicLinkDomain && {
      dynamicLinkDomain: passwordResetConfig.actionCodeSettings.dynamicLinkDomain
    })
  }
} 