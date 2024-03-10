import {toast} from "sonner"
import {useState, useEffect, useRef} from "react"
import { MessagesContainer } from "./MessagesContainer"
import { ClickedUserHeader } from "./ClickedUserHeader"
import { MsgSendingInput } from "./MsgSendingInput"
import {CHAT_WEBSOCKET} from "../utils/constants"
import {ChatWSGroupCreationMsg}         from "../utils/ChatWSGroupCreationMsg"
import {ChatWSInitialize}               from "../utils/ChatWSInitialize"
import {useClickedUser}                 from "../store"
import {getUserDataFromLocalStorage}    from "../utils/getUserDataFromLocalStorage"
import {useMessagesHistorial} from "../store"
import {useNotifications} from "../store"
import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {useNavigate} from "react-router-dom" 
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {enterChatAPI} from "../api/enterChat.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {removeAndUpdateNotifications} from "../utils/removeAndUpdateNotifications"
import {useLastClickedUser, useTypingDB} from "../store"
import "../styles/Chat.css"
import {logoutUser} from "../utils/logoutUser"
import {useExecutingInSmallDevice, useMsgReceivedInChat, useGottaScrollChat, useMessagesLoaderActivated, useActivateNewMessageSound} from "../store"
import {apiWrap} from "../utils/apiWrap"


/**
 * 
 * Contenedor unicamente del chat entre el session user y el clicked user
*/
export function Chat(){
    let messagesHistorialPage                                               = useRef(1)
    let noMoreMessages                                                      = useRef(false)
    let [newMsg, setNewMsg]                                                 = useState(null)
    let [typingDB, setTypingDB]                                             = useTypingDB((state)=>([state.typingDB, state.setTypingDB]))
    let [clickedUser, setClickedUser]                                       = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let executingInSmallDevice                                              = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let [messagesHistorial, setMessagesHistorial]                           = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [notifications, setNotifications]                                   = useNotifications((state)=>([state.notifications, state.setNotifications]))
    let setMsgReceivedInChat                                                = useMsgReceivedInChat((state)=>(state.setMsgReceivedInChat))
    let setActivateNewMessageSound                                          = useActivateNewMessageSound((state)=>(state.setActivateNewMessageSound))
    let [messagesLoaderActivated, setMessagesLoaderActivated]               = useMessagesLoaderActivated((state)=>([state.messagesLoaderActivated,state.setMessagesLoaderActivated]))
    let setGottaScrollChat                                                  = useGottaScrollChat((state)=>(state.setGottaScrollChat))
    let lastClickedUser                                                     = useLastClickedUser((state)=>(state.lastClickedUser))
    let mostRecentClickedUser                                               = useRef(null)
    const userData                                                          = getUserDataFromLocalStorage()
    const navigate                                                          = useNavigate()
    const handleChatWebsocket = (newClickedUser)=>{
        if (!CHAT_WEBSOCKET.current){
            ChatWSInitialize(newClickedUser.id)
        } else {
            CHAT_WEBSOCKET.current.send(ChatWSGroupCreationMsg(newClickedUser.id))
        }
    }
    const chatLoaded = ()=>{
        return clickedUser && !messagesLoaderActivated
    }
    const enterChatHandler = async (newClickedUser)=>{
        setMessagesLoaderActivated(true)
        const relatedNotification = notifications[newClickedUser.id]
        const response = await apiWrap(async ()=>{
            return await enterChatAPI(newClickedUser.id, relatedNotification? relatedNotification.id : undefined, getJWTFromLocalStorage().access)
        }, navigate, 'Entrando al chat, espere', 10000, undefined)
        if (newClickedUser.id != mostRecentClickedUser.current.id){
            return
        } 
        if (response){
            if (response.status == 200){
                updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage, response.data.messages_hist!== "no_messages_between" ? response.data.messages_hist : [], messagesHistorial)
                setMessagesLoaderActivated(false)
                setGottaScrollChat(true)
                newClickedUser.is_online = response.data.is_online
                if (relatedNotification && response.data.notification_deleted){
                    removeAndUpdateNotifications(relatedNotification, setNotifications)
                }
                handleChatWebsocket(newClickedUser)
            } else if (response.status == 400){
                if (response.data.error == "same_user"){
                    toast.error("Error inesperado entrando al chat, cerrando sesión por seguridad")
                    logoutUser(navigate)
                } else {
                    const errors = {
                        "user_not_found"                    : "¡ Tuvimos problemas para encontrar a ese usuario !",
                        "error_while_checking_is_online"    : '¡ Error comprobando si el usuario esta en linea !',
                        "error_while_getting_messages"      : '¡ Error buscando mensajes !',
                        "error_while_deleting_notification" : '¡ Error borrando notificación !'
                    }
                    toast.error(errors[response.data.error]? errors[response.data.error] : "¡ Error inesperado entrando al chat !")
                }
            } else{
                toast.error("¡ Error inesperado entrando al chat !")
            }
        }
        setMessagesLoaderActivated(false)
    }
    useEffect(()=>{
        if (diferentUserHasBeenClicked(lastClickedUser, clickedUser)){
            (async function() {
                messagesHistorialPage.current = 1
                noMoreMessages.current = false
                mostRecentClickedUser.current = clickedUser
                await enterChatHandler(clickedUser)
            })();
        }
    }, [clickedUser])
    useEffect(()=>{
        if (CHAT_WEBSOCKET.current){
            CHAT_WEBSOCKET.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log(data)
                if (data.type === "message_broadcast"){
                    if (Number(data.value.parent_id) !== Number(userData.id)){
                        setMessagesHistorial([...messagesHistorial, data.value])
                        setMsgReceivedInChat(true)
                        setActivateNewMessageSound(true)
                    }
                } else if (data.type === "connection_inform"){
                    if (data.value.user_id == clickedUser.id){
                        clickedUser.is_online = data.value.connected
                        if (!data.value.connected){
                            typingDB[clickedUser.id] =  false
                            setTypingDB(typingDB)
                        }
                        setClickedUser(clickedUser)
                    }
                }
            };
        }
    }, [messagesHistorial, clickedUser])
    return (
        <div className={executingInSmallDevice? (clickedUser? "chat-container" : "chat-container not-displayed") : "chat-container"}>
            {chatLoaded()   && <ClickedUserHeader/>}
            <MessagesContainer  newMsg={newMsg}   messagesHistorialPage={messagesHistorialPage}  noMoreMessages={noMoreMessages}/>
            {chatLoaded()   && <MsgSendingInput onMsgSending={(newMsg)=>setNewMsg(newMsg)} />}
        </div>
    )
}