import {useState, useEffect, useRef} from "react"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"
import {apiWrap} from "../utils/apiWrap"
import {toast} from "sonner"
import {useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../utils/constants"
import {PropTypes} from "prop-types"
import "../styles/MessageSendingInput.css"
import {NOTIFICATIONS_WEBSOCKET, BASE_USER_TYPING_LOCAL_STORAGE_ATTR} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {useClickedUser, useMessagesHistorial, useGottaScrollChat} from "../store"
import {NotificationsWSTypingInformMsg} from "../utils/NotificationsWSTypingInformMsg"
import { IoSend } from "react-icons/io5";
import { sendMsgAPI } from "../api/sendMsg.api"
import {logoutUser} from "../utils/logoutUser"

/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput(){
    let clickedUser                                         = useClickedUser((state)=>state.clickedUser)
    let [messagesHistorial, setMessagesHistorial]           = useMessagesHistorial((state)=>[state.messagesHistorial, state.setMessagesHistorial])
    let setGottaScrollChat                                  = useGottaScrollChat((state)=>state.setGottaScrollChat)
    let {register, handleSubmit, reset}                     = useForm()
    let [clickedUserWhenTyping, setClickedUserWhenTyping]   = useState(null)
    let [timeoutDB, setTimeoutDB]                           = useState({})
    const navigate                                          = useNavigate()
    const lastMessagesHistorialValue                        = useRef(null)
    const userData                                          = getUserDataFromLocalStorage()
    const sendMsg = async (data)=>{
        const temporalMsg = {
            "parent_id" : getUserDataFromLocalStorage().id,
            "content" : data.msg
        }
        let newMessagesHistorial = [...lastMessagesHistorialValue.current, temporalMsg]
        const newMessageIndex = newMessagesHistorial.length-1
        setMessagesHistorial(newMessagesHistorial)
        setGottaScrollChat(true)
        const response = await apiWrap(async ()=>{
            return await sendMsgAPI(clickedUser.id, data.msg, getJWTFromLocalStorage().access)
        }, navigate, undefined, undefined, undefined)
        if (response){
            if (response.status == 200){
                newMessagesHistorial = lastMessagesHistorialValue.current
                newMessagesHistorial[newMessageIndex] = response.data.sended_msg
                setMessagesHistorial(newMessagesHistorial)
            } else {
                if (response.data.error == "same_user"){
                    toast.error("Error inesperado enviando mensaje, cerrando sesión por seguridad")
                    logoutUser(navigate)
                } else {
                    toast.error('Error inesperado enviando el mensaje')
                }
            }
        }
    }

    const onSubmit                      = handleSubmit(async (data)=>{
        console.log(data)
        const new_msg = data.msg.trim()
        if (new_msg.length > 0){
            reset({"msg" : " "})
            await sendMsg(data)
        }
    })
    useEffect(()=>{
        if (NOTIFICATIONS_WEBSOCKET.current && userData && clickedUserWhenTyping){
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(clickedUserWhenTyping.id, true))
            localStorage.setItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR, clickedUserWhenTyping.id)
        }
    }, [clickedUserWhenTyping])
    useEffect(()=>{
        reset()
    }, [clickedUser])
    useEffect(()=>{
        lastMessagesHistorialValue.current = messagesHistorial
    }, [messagesHistorial])
    const handleMsgSendingInput = (e)=>{
        setClickedUserWhenTyping(clickedUser)
        if (timeoutDB[clickedUser.id]){
            clearTimeout(timeoutDB[clickedUser.id])
        }
        timeoutDB[clickedUser.id] = (setTimeout(() => {
            setClickedUserWhenTyping(null)
            /**
             * Recordar que en este punto, llamamos a la funcion desde aca,
             * para evitar errores cuando se desmonte la pagina por entrar al profile por ejemplo
            */
            if (NOTIFICATIONS_WEBSOCKET.current){
                NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(clickedUser.id, false))
                localStorage.setItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR, false)
            } 
        }, 600))
    }
    return (
        <div className="message-sending-input-container">
            <form onChange = {handleMsgSendingInput} className="message-sending-form " onSubmit={onSubmit}>
                <textarea 
                    placeholder="Mensaje" 
                    className="message-sending-input" 
                    type="text" 
                    maxLength={BASE_MESSAGE_MAX_LENGTH} 
                    minLength={1} 
                    {...register("msg")}/>
            </form>
            <span className="sending-msg-button" onClick={onSubmit} onMouseDown={(e)=>{e.preventDefault()}}>
                <IoSend /> 
            </span>
        </div>
    )
}

MsgSendingInput.propTypes = {
    onMsgSending : PropTypes.func,
    chatScrollerState : PropTypes.object
}
