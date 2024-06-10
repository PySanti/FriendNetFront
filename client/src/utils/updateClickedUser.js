import * as states from "../store"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {toast} from "sonner"

/**
 * Funcion diseniada para actualizar los states globales lastClickedUser y clickedUser
 * 
 * Esta misma funcion es usada por lo menos en dos componentes y para evitar uso de props, la creamos
 */
export function updateClickedUser(newClickedUser){
    const clickedUserState = states["useClickedUser"].getState()
    let [clickedUser, setClickedUser] = [clickedUserState.clickedUser, clickedUserState.setClickedUser]
    let setLastClickedUser = states["useLastClickedUser"].getState().setLastClickedUser

    if (!NOTIFICATIONS_WEBSOCKET.current || NOTIFICATIONS_WEBSOCKET.current.readyState !== 1){
        toast.error("Cargando… si el problema persiste, cambia de conexión WIFI.")
    } else {
        setLastClickedUser(clickedUser)
        setClickedUser(newClickedUser);
    }
}