import {PropTypes} from "prop-types"
import "../styles/Notification.css"
import {useState} from "react"
import { IoClose } from "react-icons/io5";
import {ChatPhoto} from "../components/ChatPhoto.jsx"


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
        }, 200);
    }
    return (
        <div className={notificationDeleted ? "individual-notification-container notification_deleted" : "individual-notification-container"  }>
            <ChatPhoto photo={notification.sender_user.photo_link}/>
            <div className="individual-notification-content"onClick={onNotificationClick}>
                <h4 className="notification-username">
                    {notification.sender_user.username}
                </h4>
                <p className="notification-content">
                    {notification.msg}
                </p>
            </div>
            <span className="individual-notification-delete-btn" onClick={handleDeleteClick}>
                <IoClose/>
            </span>
        </div>
    )
}

Notification.propTypes = {
    onNotificationDelete : PropTypes.func.isRequired,
    notification : PropTypes.object.isRequired,
    onNotificationClick : PropTypes.func.isRequired
}

