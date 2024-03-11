/**
 * Recibe el id del usuario clikeado y retorna el mensaje que
 * sera enviado a traves del websocket para la creacion del grupo entre
 * el session user y el clickedUser 
 */
export function NotificationsWSGroupCreationMsg(clickedUserId){
    return JSON.stringify({
        'type' : 'group_creation',
        "value" : {
            'clicked_user_id' : clickedUserId
        }
    })
}