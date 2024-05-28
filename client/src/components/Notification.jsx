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
export function Notification({notification, onNotificationDelete, onNotificationClick, notificationsCanBeDeleted}){
    const [notificationDeleted, setNotificationDeleted] = useState(false)

    const handleDeleteClick = (event)=>{
        event.stopPropagation()
        if (notificationsCanBeDeleted.current){
            notificationsCanBeDeleted.current = false
            setNotificationDeleted(true)
            setTimeout(() => {
                onNotificationDelete(notification)
                notificationsCanBeDeleted.current = true
            }, 100);
        } 
    }

    return (
        <div className={notificationDeleted ? "individual-notification-container notification_deleted" : "individual-notification-container"  }>
            <ChatPhoto photo={notification.sender_user.photo_link} small/>
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
    onNotificationClick : PropTypes.func.isRequired,
    notificationsCanBeDeleted : PropTypes.object.isRequired
}

