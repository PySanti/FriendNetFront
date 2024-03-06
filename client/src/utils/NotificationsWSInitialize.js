import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NOTIFICATIONS_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {resetGlobalStates} from "../utils/resetGlobalStates"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
/**
 * Inicializa el websocket de notificaciones
 */
export function NotificationsWSInitialize(userId){
    if (!NOTIFICATIONS_WEBSOCKET.current && userIsAuthenticated()){
        NOTIFICATIONS_WEBSOCKET.current = new WebSocket(NOTIFICATIONS_WEBSOCKET_ENDPOINT + `${userId}/`)
        NOTIFICATIONS_WEBSOCKET.current.onopen = ()=>{
            console.log('Estableciendo conexion')
            NOTIFICATIONS_WEBSOCKET.current.onerror = ()=>{
                window.alert("Error con websocket")
            }
            NOTIFICATIONS_WEBSOCKET.current.onclose = ()=>{
                resetGlobalStates(undefined)
            }
            NOTIFICATIONS_WEBSOCKET.intervalId = setInterval(() => {
                if (NOTIFICATIONS_WEBSOCKET.current){
                    NOTIFICATIONS_WEBSOCKET.current.send(JSON.stringify({"type" : "ping"}))
                } else {
                    clearInterval(NOTIFICATIONS_WEBSOCKET.intervalId)
                }
            }, 3000);
        }
    }
}