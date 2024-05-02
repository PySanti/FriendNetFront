import {toast} from "sonner"
import {Loader} from "./Loader"
import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ClickedUserHeader } from "./ClickedUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {NotificationsWSGroupCreationMsg}         from "../utils/NotificationsWSGroupCreationMsg"
import {useClickedUser}                 from "../store"
import {useMessagesHistorial} from "../store"
import {useNotifications} from "../store"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {useNavigate} from "react-router-dom" 
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import "../styles/Chat.css"
import {logoutUser} from "../utils/logoutUser"
import {useEnterChatLoaderActivated, useExecutingInSmallDevice, useGottaScrollChat, useLastClickedUser} from "../store"
import {apiWrap} from "../utils/apiWrap"


/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
*/
export function Chat(){
    let messagesHistorialPage                                               = useRef(1)
    let noMoreMessages                                                      = useRef(false)
    let clickedUser                                                         = useClickedUser((state)=>(state.clickedUser))
    let executingInSmallDevice                                              = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let [messagesHistorial, setMessagesHistorial]                           = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [notifications, setNotifications]                                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    let [enterChatLoaderActivated, setEnterChatLoaderActivated]             = useEnterChatLoaderActivated((state)=>([state.enterChatLoaderActivated, state.setEnterChatLoaderActivated]))
    let setGottaScrollChat                                                  = useGottaScrollChat((state)=>(state.setGottaScrollChat))
    let lastClickedUser                                                     = useLastClickedUser((state)=>(state.lastClickedUser))
    let mostRecentClickedUser                                               = useRef(null)
    const navigate                                                          = useNavigate()
    const enterChatHandler = async (newClickedUser)=>{
        const relatedNotification = notifications[newClickedUser.id]
        const response = await apiWrap(async ()=>{
            return await enterChatAPI(newClickedUser.id, relatedNotification? relatedNotification.id : undefined, getJWTFromLocalStorage().access)
        }, navigate, undefined, undefined, undefined)
        if (newClickedUser.id != mostRecentClickedUser.current.id){
            return
        } 
        if (response){
            if (response.status == 200){
                updateMessagesHistorial(setMessagesHistorial, 1, response.data.messages_hist!== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
                newClickedUser.is_online = response.data.is_online
                if (relatedNotification && response.data.notification_deleted){
                    removeAndUpdateNotifications(relatedNotification, setNotifications)
                }
                NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSGroupCreationMsg(newClickedUser.id))
                setEnterChatLoaderActivated(false)
                setGottaScrollChat(true)
            } else if (response.status == 400){
                if (response.data.error == "same_user"){
                    toast.error("Error inesperado entrando al chat, cerrando sesión por seguridad")
                    logoutUser(navigate)
                } else {
                    const errors = {
                        "user_not_found"                    : "Tuvimos problemas para encontrar a ese usuario",
                        "error_while_checking_is_online"    : 'Error comprobando si el usuario esta en linea',
                        "error_while_getting_messages"      : 'Error buscando mensajes',
                        "error_while_deleting_notification" : 'Error borrando notificación'
                    }
                    toast.error(errors[response.data.error]? errors[response.data.error] : "Error inesperado entrando al chat")
                }
            } else{
                toast.error("Error inesperado entrando al chat")
            }
        }
        setEnterChatLoaderActivated(false)
    }
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser) ){
            (async function() {
                noMoreMessages.current = false
                mostRecentClickedUser.current = clickedUser
                await enterChatHandler(clickedUser)
                messagesHistorialPage.current = 2
            })();
        }
    }, [clickedUser])

    return (
        <div className={executingInSmallDevice? (clickedUser? "chat-container" : "chat-container not-displayed") : "chat-container"}>
            {
                enterChatLoaderActivated ?
                <Loader big loaderActivated={true}/>
                :
                <>
                    {clickedUser ?
                    <>
                        <ClickedUserHeader/>
                        <MessagesContainer  messagesHistorialPage={messagesHistorialPage}  noMoreMessages={noMoreMessages}/>
                        <MsgSendingInput />
                    </>
                    :
                    <h3 className="chat-container__title">
                        Selecciona un usuario para chatear
                    </h3>
                    }
                </>
            }
        </div>
    )
}