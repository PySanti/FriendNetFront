import {toast} from "sonner"
import {disconnectWebsocket} from "../utils/disconnectWebsocket"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {clearLocalStorage} from "../utils/clearLocalStorage"
/**
 * Redirigira al usuario expirado al root de la app para volver a logearse. 
 * @param {Func} navigateFunc funcion navigate del hook useNavigate creado desde la pagina concurrente
 */
export function redirectExpiredUser(navigateFunc){
    navigateFunc('/')
    clearLocalStorage()
    disconnectWebsocket(NOTIFICATIONS_WEBSOCKET)
    toast.error("Redirigiendo usuario al inicio por vencimiento de token")
}