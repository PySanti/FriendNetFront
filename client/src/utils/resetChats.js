import {resetGlobalStates} from "../utils/resetGlobalStates"
import {NotificationsWSGroupDeleteMsg} from "../utils/NotificationsWSGroupDeleteMsg"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import * as states from "../store"

// realizara las operaciones necesarias al salir del home
export function resetChats(){
    let clickedUser = states["useClickedUser"].getState().clickedUser
    if (NOTIFICATIONS_WEBSOCKET.current && clickedUser){
        NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSGroupDeleteMsg())
    }
    resetGlobalStates(["useClickedUser", "useLastClickedUser", "useMessagesHistorial"])
}