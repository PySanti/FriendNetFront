import {NOTIFICATIONS_WEBSOCKET, NOTIFICATIONS_WEBSOCKET_ENDPOINT, DEBUG} from "../utils/constants"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
/**
 * Inicializa el websocket de notificaciones
 */
export function NotificationsWSInitialize(userId){
    if (!NOTIFICATIONS_WEBSOCKET.current && userIsAuthenticated() && !DEBUG){
        NOTIFICATIONS_WEBSOCKET.current = new WebSocket(NOTIFICATIONS_WEBSOCKET_ENDPOINT + `${userId}/`)
        NOTIFICATIONS_WEBSOCKET.current.onopen = ()=>{
            console.log('Estableciendo conexion')
        }
    }
}