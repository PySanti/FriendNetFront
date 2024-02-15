import {resetGlobalStates} from "../utils/resetGlobalStates"
import {ChatWSGroupDeleteMsg} from "../utils/ChatWSGroupDeleteMsg"
import {CHAT_WEBSOCKET} from "../utils/constants"
import * as states from "../store"

// realizara las operaciones necesarias al salir del home
export function resetChats(){
    let clickedUser = states["useClickedUser"].getState().clickedUser
    if (CHAT_WEBSOCKET.current && clickedUser){
        CHAT_WEBSOCKET.current.send(ChatWSGroupDeleteMsg())
    }
    resetGlobalStates(["useClickedUser", "useLastClickedUser", "useMessagesHistorial"])
}