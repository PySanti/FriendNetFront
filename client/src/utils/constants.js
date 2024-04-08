export const BASE_FALLEN_SERVER_LOG = "Red caída"
export const BASE_USER_NOT_EXISTS_ERROR = "user_not_exists"
export const BASE_FALLEN_SERVER_ERROR_MSG = "Network Error"
export const JWT_LOCALSTORAGE_NAME = "jwt"
export const BASE_NON_TOASTED_API_CALLS_TIMER = 2000
export const UNAUTHORIZED_STATUS_CODE = 401
export const BASE_MESSAGE_MAX_LENGTH = 200;
export const BASE_USERNAME_MAX_LENGTH = 15;
export const SMALL_DEVICE_WIDTH = 800
export const BASE_USERNAME_MIN_LENGTH = 6;
export const BASE_EMAIL_MAX_LENGTH = 60
export const BASE_MESSAGES_LIST_PAGE_SIZE = 15;
export const BASE_PASSWORD_MIN_LENGTH = 6;
export const BASE_PASSWORD_MAX_LENGTH = 30
export const BASE_LOGIN_REQUIRED_ERROR_MSG = "requires_login"
export const BASE_UNEXPECTED_ERROR_MESSAGE = "unexpected_error"
export const BASE_UNEXPECTED_ERROR_LOG = "Error inesperado"
export const LOCAL_STORAGE_DARK_MODE_NAME = "darkMode"
export const BASE_USER_TYPING_LOCAL_STORAGE_ATTR = "user_typing"
export const BASE_SECURITY_CODE_LENGTH = 10
export const BASE_SECURITY_CODE_CONSTRAINTS = {
    required: {
        value: true,
        message:
            "Ingresa un código de activación",
    },
    minLength: {
        value: BASE_SECURITY_CODE_LENGTH,
        message:
            `Debes ingresar al menos ${BASE_SECURITY_CODE_LENGTH} caracteres`,
    },
}

export const BASE_PAGE_NOT_FOUND_LOG = "Pagina no encontrada :("
export const BASE_EMAIL_CONSTRAINTS = {
    required: {
        value: true,
        message: "Ingresa tu correo electrónico",
    },
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Ingresa un correo electrónico valido",
    },
};
export const BASE_USERNAME_CONSTRAINTS = {
    required: {
        value: true,
        message: "Ingresa el nombre de tu usuario",
    },
    minLength: {
        value: BASE_USERNAME_MIN_LENGTH,
        message: `Al menos ${BASE_USERNAME_MIN_LENGTH} caracteres`,
    },
    pattern : {
        value : /^[^\s]+$/,
        message : "No debe tener espacios"
    }
};
export const BASE_PASSWORD_CONSTRAINTS = {

    required: {
        value: true,
        message: "Ingresa una contraseña",
    },
    minLength: {
        value: BASE_PASSWORD_MIN_LENGTH,
        message: `Al menos ${BASE_PASSWORD_MIN_LENGTH} caracteres`,
    },
};
export const DEBUG = false

// export const BACKEND_URL = "https://friendnet.online/";
export const BACKEND_URL = "http://127.0.0.1:8000/";

// export const NOTIFICATIONS_WEBSOCKET_ENDPOINT   = "wss://friendnet.online:8001/ws/notifications/"
export const NOTIFICATIONS_WEBSOCKET_ENDPOINT   = "ws://localhost:8000/ws/notifications/"



export const NOTIFICATIONS_WEBSOCKET = {
    'current' : null
}
export const BASE_RATE_LIMIT_BLOCK_RESPONSE = "Has hecho muchas solicitudes últimamente, espera un poco ... "
export const CALLING_DB = {} 