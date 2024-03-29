import * as states from "../store"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {toast} from "sonner"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"

/**
 * Funcion diseniada para actualizar los states globales lastClickedUser y clickedUser
 * 
 * Esta misma funcion es usada por lo menos en dos componentes y para evitar uso de props, la creamos
 */
export function updateClickedUser(newClickedUser){
    const clickedUserState = states["useClickedUser"].getState()
    let [clickedUser, setClickedUser] = [clickedUserState.clickedUser, clickedUserState.setClickedUser]
    let setLastClickedUser = states["useLastClickedUser"].getState().setLastClickedUser
    let setEnterChatLoaderActivated = states["useEnterChatLoaderActivated"].getState().setEnterChatLoaderActivated

    if (!NOTIFICATIONS_WEBSOCKET.current || NOTIFICATIONS_WEBSOCKET.current.readyState !== 1){
        toast.error("Cargando")
    } else {
        if (diferentUserHasBeenClicked(clickedUser, newClickedUser) ){
            setEnterChatLoaderActivated(true)
        }
        setLastClickedUser(clickedUser)
        setClickedUser(newClickedUser);
    }
}