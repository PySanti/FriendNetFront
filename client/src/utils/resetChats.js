import {CHAT_WEBSOCKET} from "../utils/constants"
import {resetGlobalStates} from "../utils/resetGlobalStates"
import {disconnectWebsocket} from "../utils/disconnectWebsocket" 

// realizara las operaciones necesarias al salir del home
export function resetChats(){
    resetGlobalStates(["useClickedUser", "useLastClickedUser", "useMessagesHistorial"])
    disconnectWebsocket(CHAT_WEBSOCKET)
}