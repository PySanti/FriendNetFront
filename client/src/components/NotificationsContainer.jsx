import {BASE_NON_TOASTED_API_CALLS_TIMER} from "../utils/constants"
import {Modal} from "./Modal.jsx"
import {toast} from "sonner"
import "../styles/NotificationsContainer.css"
import {  useState } from "react"
import { v4 } from "uuid"
import { Notification } from "./Notification"
import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {apiWrap} from "../utils/apiWrap"
import {notificationDeleteAPI} from "../api/notificationDelete.api"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useNotifications} from "../store"
import {ModalBackButton} from "./ModalBackButton"
import {updateClickedUser} from "../utils/updateClickedUser"
/**
 * Componente creado para contener las notificaciones del usuarios
 */
export function NotificationsContainer(){
    let [notificationsActivated, setNotificationsActivated] = useState(false)
    let [notifications, setNotifications]                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    const navigate                                          = useNavigate()
    const handleNotificationsBellClick = ()=>{
        if (Object.keys(notifications).length > 0){
            setNotificationsActivated(true)
        } else {
            toast.error("No tienes notificaciones")
        }
    }
    const onNotificationClickFunctionGen = (notification)=>{
        setNotificationsActivated(false)
        updateClickedUser(notification.sender_user)
    }
    const onNotificationDelete = async (notification)=>{
        const response = await apiWrap(async ()=>{
            return await notificationDeleteAPI(notification.id, getJWTFromLocalStorage().access )
        }, navigate, 'Eliminando notificación, espere', BASE_NON_TOASTED_API_CALLS_TIMER, "notificationDelete")
        if (response){
            if (response.status == 200){
                removeAndUpdateNotifications(notification, setNotifications)
            } else {
                toast.error('La notificación esta siendo eliminada, espera')
            }
        }
    }


    const formatingFunction =(notification_id)=>{
        return <Notification 
            key={v4()} 
            notification={notifications[notification_id]} 
            onNotificationDelete={onNotificationDelete} 
            onNotificationClick={()=>onNotificationClickFunctionGen(notifications[notification_id])}/>
    }
    useEffect(()=>{
        if (Object.keys(notifications).length == 0){
            setNotificationsActivated(false)
        }
    }, [notifications])

    return (
        <>
            <div className="notifications-bell button" onClick={handleNotificationsBellClick}>
                <h4 className="notifications-container-title">
                    Notificaciones
                </h4>
                <div className="notifications-alert">{Object.keys(notifications).length}</div>
            </div>
            {
                (Object.keys(notifications).length != 0) &&
                <>
                    <Modal opened={notificationsActivated}>
                        <ModalBackButton onClick={()=>setNotificationsActivated(false)}/>
                        <div className="notifications-list">
                            {Object.keys(notifications).map(formatingFunction)}
                        </div>
                    </Modal>
                </>
            }
        </>
    )
}

