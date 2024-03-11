export function NotificationsWSTypingInformMsg(clickedUserId, typing){
    return JSON.stringify({
        "type" : "typing_inform",
        "value" : {
            "clicked_user_id" : clickedUserId,
            "typing" : typing
        }
    
})
}