import {useState, useEffect, useRef} from "react"
import { useForm } from "react-hook-form"
import { BASE_MESSAGE_MAX_LENGTH } from "../utils/constants"
import {PropTypes} from "prop-types"
import "../styles/MessageSendingInput.css"
import {NOTIFICATIONS_WEBSOCKET, BASE_USER_TYPING_LOCAL_STORAGE_ATTR} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {useClickedUser} from "../store"
import {NotificationsWSTypingInformMsg} from "../utils/NotificationsWSTypingInformMsg"
import {useNewMsg} from "../store"
/**
 * Input creado para el envio de mensajes
 * @param  {Function} onMsgSending funcion que se ejecutara cuando se envie un mensaje
 */
export function MsgSendingInput(){
    let clickedUser                                         = useClickedUser((state)=>state.clickedUser)
    let {register, handleSubmit, reset}                     = useForm()
    let [clickedUserWhenTyping, setClickedUserWhenTyping]   = useState(null)
    let [timeoutDB, setTimeoutDB]                           = useState({})
    const setNewMsg                                         = useNewMsg((state)=>(state.setNewMsg))
    const userData                                          = getUserDataFromLocalStorage()

    const resetInput = ()=>{
        reset()
    }
    const onSubmit                      = handleSubmit((data)=>{
        const new_msg = data.msg.trim()
        if (new_msg.length > 0){
            setNewMsg(data)
            resetInput()
        }

    })
    useEffect(()=>{
        if (NOTIFICATIONS_WEBSOCKET.current && userData && clickedUserWhenTyping){
            NOTIFICATIONS_WEBSOCKET.current.send(NotificationsWSTypingInformMsg(clickedUserWhenTyping.id, true))
            localStorage.setItem(BASE_USER_TYPING_LOCAL_STORAGE_ATTR, clickedUserWhenTyping.id)
        }
    }, [clickedUserWhenTyping])
    useEffect(()=>{
        resetInput()
    }, [clickedUser])
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
                <input 
                    
                    placeholder="Envíale un mensaje" 
                    className="message-sending-input non-shadow-input" 
                    type="text" 
                    maxLength={BASE_MESSAGE_MAX_LENGTH} 
                    minLength={1} 
                    {...register("msg")}/>
            </form>
            <span className="material-symbols-outlined sending-msg-button" onClick={onSubmit} onMouseDown={(e)=>{e.preventDefault()}}>
                send
            </span>
        </div>
    )
}

MsgSendingInput.propTypes = {
    onMsgSending : PropTypes.func,
    chatScrollerState : PropTypes.object
}
