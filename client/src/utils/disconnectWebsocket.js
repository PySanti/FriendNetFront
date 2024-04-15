import {NotificationsWSTypingInformMsg} from "./NotificationsWSTypingInformMsg"
import {BASE_USER_TYPING_LOCAL_STORAGE_ATTR} from "../utils/constants"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {resetGlobalStates} from "../utils/resetGlobalStates"
/**
 * Revisa si el Websocket esta inicializado y si lo esta lo desconecta y anula
 * @param {Object} websocket
 */
export function disconnectWebsocket(){
    if (NOTIFICATIONS_WEBSOCKET.current){
        console.log('Desconectando websocket')
        if (localStorage.getItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR) && NOTIFICATIONS_WEBSOCKET.current.readyState === 1 ){
            // caso borde en el que el usuario se haya desconectado antes de los 600ms despues de haber escrito
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(Number(localStorage.getItem("user_typing")), false))
        }
        localStorage.removeItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR)
        NOTIFICATIONS_WEBSOCKET.current.close() 
        resetGlobalStates(undefined)
        NOTIFICATIONS_WEBSOCKET.current = null
    }
}