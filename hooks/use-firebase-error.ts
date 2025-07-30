import { FirebaseError } from "firebase/app"

export function useFirebaseError() {
  const getErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      // Errores de autenticación
      case "auth/user-not-found":
        return "No existe una cuenta con este correo electrónico"
      case "auth/wrong-password":
        return "Contraseña incorrecta"
      case "auth/email-already-in-use":
        return "Este correo electrónico ya está registrado"
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres"
      case "auth/invalid-email":
        return "El correo electrónico no es válido"
      case "auth/too-many-requests":
        return "Demasiados intentos fallidos. Intenta más tarde"
      case "auth/user-disabled":
        return "Esta cuenta ha sido deshabilitada"
      case "auth/operation-not-allowed":
        return "Esta operación no está permitida"
      case "auth/network-request-failed":
        return "Error de conexión. Verifica tu internet"
      case "auth/popup-closed-by-user":
        return "Inicio de sesión cancelado"
      case "auth/popup-blocked":
        return "El popup fue bloqueado. Permite popups para este sitio"
      case "auth/cancelled-popup-request":
        return "Solicitud de popup cancelada"
      case "auth/account-exists-with-different-credential":
        return "Ya existe una cuenta con este email usando otro método de inicio de sesión"
      case "auth/user-not-found":
        return "No existe una cuenta con este correo electrónico"
      case "auth/invalid-email":
        return "El correo electrónico no es válido"
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta más tarde"
      case "auth/network-request-failed":
        return "Error de conexión. Verifica tu internet"
      
      // Errores de Firestore
      case "permission-denied":
        return "No tienes permisos para realizar esta acción"
      case "unavailable":
        return "Servicio no disponible. Intenta más tarde"
      case "deadline-exceeded":
        return "La operación tardó demasiado. Intenta de nuevo"
      case "resource-exhausted":
        return "Se han agotado los recursos. Intenta más tarde"
      case "failed-precondition":
        return "La operación no se puede completar en este momento"
      case "aborted":
        return "La operación fue cancelada"
      case "out-of-range":
        return "Los datos están fuera del rango permitido"
      case "unimplemented":
        return "Esta función no está implementada"
      case "internal":
        return "Error interno del servidor"
      case "data-loss":
        return "Se perdió información durante la operación"
      case "unauthenticated":
        return "Debes iniciar sesión para realizar esta acción"
      
      // Errores generales
      default:
        return "Ocurrió un error inesperado. Intenta de nuevo"
    }
  }

  return { getErrorMessage }
} 