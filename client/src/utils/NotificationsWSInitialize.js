import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NOTIFICATIONS_WEBSOCKET_ENDPOINT} from "../utils/constants"
import {NotificationsWSGroupCreationMsg} from "../utils/NotificationsWSGroupCreationMsg"
import {resetGlobalStates} from "../utils/resetGlobalStates"
import {userIsAuthenticated} from "../utils/userIsAuthenticated"
/**
 * Inicializa el websocket de notificaciones
 */
export function NotificationsWSInitialize(userId){
    if (!NOTIFICATIONS_WEBSOCKET.current && userIsAuthenticated()){
        NOTIFICATIONS_WEBSOCKET.current = new WebSocket(NOTIFICATIONS_WEBSOCKET_ENDPOINT)
        NOTIFICATIONS_WEBSOCKET.current.onopen = ()=>{
            console.log('Estableciendo conexion')
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSGroupCreationMsg(userId))
            NOTIFICATIONS_WEBSOCKET.current.onclose = ()=>{
                resetGlobalStates(undefined)
            }
        }
    }
}