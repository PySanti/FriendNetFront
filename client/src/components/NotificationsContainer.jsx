import {BASE_NON_TOASTED_API_CALLS_TIMER} from "../utils/constants"
import {toast} from "sonner"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"
import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {nonToastedApiCall} from "../utils/nonToastedApiCall"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useNotifications} from "../store"
import {initStates} from "../utils/initStates"
/**
 * Componente creado para contener las notificaciones del usuarios
 */
export function NotificationsContainer(){
    let [notificationsActivated, setNotificationsActivated] = useState(false)
    let [notifications, setNotifications]                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    const navigate                                          = useNavigate()
    const baseNotificationsBellClassName                    = "notifications-bell button"
    const handleNotificationsBellClick = ()=>{
        if (Object.keys(notifications).length > 0){
            setNotificationsActivated(!notificationsActivated)
        } else {
            toast.error("No tienes notificaciones")
        }
    }
    const onNotificationDelete = async (notification)=>{
        const response = await nonToastedApiCall(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate, 'Eliminando notificación, espere', BASE_NON_TOASTED_API_CALLS_TIMER)
        if (response){
            if (response.status == 200){
                removeAndUpdateNotifications(notification, setNotifications)
            } else {
                toast.error('¡ Ha ocurrido un error eliminando la notificación !')
            }
        }
    }


    const formatingFunction =(notification_id)=>{
        return <Notification key={v4()} notification={notifications[notification_id]} onNotificationDelete={onNotificationDelete}/>
    }
    useEffect(()=>{
        if (Object.keys(notifications).length == 0){
            setNotificationsActivated(false)
        }
    }, [notifications])

    useEffect(()=>{
        initStates(notifications, setNotifications)
    }, [])
    return (
        <div className="notifications-container">
            <div className={notificationsActivated? `${baseNotificationsBellClassName} button_hovered` : baseNotificationsBellClassName} onClick={handleNotificationsBellClick}>
                Notificaciones
                <div className={notificationsActivated ? "notifications-list notifications-list__activated" : "notifications-list"}>
                    {
                        (notifications && Object.keys(notifications).length > 0) &&
                        Object.keys(notifications).map(formatingFunction)
                    }
                </div>
            </div>
            <div className={notificationsActivated? "notifications-alert notifications-alert__activated" : "notifications-alert"}>{Object.keys(notifications).length}</div>
        </div>
    )
}

