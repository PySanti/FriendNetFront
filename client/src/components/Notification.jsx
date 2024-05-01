import {PropTypes} from "prop-types"
import "../styles/Notification.css"
import {useState} from "react"
import { IoClose } from "react-icons/io5";


/**
 * Componente creado para modularizar Notification de NotificationsContainer
 * @param {Function} onNotificationDelete funcion que se ejecutara cuando se elimine una notificacion
 * @param {Object} notification
 */
export function Notification({notification, onNotificationDelete, onNotificationClick}){
    const [notificationDeleted, setNotificationDeleted] = useState(false)
    const handleDeleteClick = (event)=>{
        event.stopPropagation()
        setNotificationDeleted(true)
        setTimeout(() => {
            onNotificationDelete(notification)
        }, 100);
    }
    return (
        <div className={notificationDeleted ? "individual-notification-container notification_deleted" : "individual-notification-container"  }>
            <h4 className="individual-notification-content"onClick={onNotificationClick}>
                {notification.msg}
            </h4>
            <button className="individual-notification-delete-btn" onClick={handleDeleteClick}>
                <IoClose/>
            </button>
        </div>
    )
}

Notification.propTypes = {
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
    onNotificationClick : PropTypes.func.isRequired
}

