import { saveNotificationsInLocalStorage } from "./saveNotificationsInLocalStorage";


/**
 * Esta funcion se encargara de eliminar la notification del localStorage y guardar
 * las notificaciones actualizadas en el mismo localStorage y en el notificationsState
 */
export function removeAndUpdateNotifications(target_notification, notifications, notificationsSetter){
    delete notifications[target_notification.sender_user.id]
    notificationsSetter({...notifications})
    saveNotificationsInLocalStorage(notifications)
}