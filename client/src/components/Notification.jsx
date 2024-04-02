import {updateClickedUser} from "../utils/updateClickedUser"
import {PropTypes} from "prop-types"
import "../styles/Notification.css"
import { RiDeleteBin6Line } from "react-icons/ri";


/**
 * Componente creado para modularizar Notification de NotificationsContainer
 * @param {Function} onNotificationDelete funcion que se ejecutara cuando se elimine una notificacion
 * @param {Object} notification
 */
export function Notification({notification, onNotificationDelete}){
    const handleDeleteClick = (event)=>{
        onNotificationDelete(notification)
        event.stopPropagation()
    }
    return (
        <div className="individual-notification-container" >
            <h4 className="individual-notification-content"onClick={()=>{updateClickedUser(notification.sender_user)}}>
                {notification.msg}
            </h4>
            <button className="individual-notification-delete-btn" onClick={handleDeleteClick}>
                <RiDeleteBin6Line />
            </button>
        </div>
    )
}

Notification.propTypes = {
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
}

