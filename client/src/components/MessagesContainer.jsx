import {toast} from "sonner"
import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"
import { useEffect, useRef, useState} from "react"
import { getJWTFromLocalStorage } from "../utils/getJWTFromLocalStorage"

import { useNavigate } from "react-router-dom"
import {getMessagesHistorialAPI} from "../api/getMessagesHistorial.api"
import {updateMessagesHistorial} from "../utils/updateMessagesHistorial"
import {useClickedUser} from "../store"
import {useMessagesHistorial} from "../store"
import {apiWrap} from "../utils/apiWrap"
import {useMsgReceivedInChat, useGottaScrollChat} from "../store"
import {Loader} from "../components/Loader"
/**
 * Componente encargado de renderizar y mantener la lista de mensajes 
 * @param {Object} messagesHistorialPage
 * @param {Object} noMoreMessages  
*/
export function MessagesContainer({messagesHistorialPage,noMoreMessages}){
    const containerRef                                                  = useRef(null)
    const oldScrollRef                                                  = useRef(null)
    const navigate                                                      = useNavigate()
    const clickedUser                                                   = useClickedUser((state)=>(state.clickedUser))
    let resetScroll                                                     = useRef(false)
    let [messagesHistorial, setMessagesHistorial]                       = useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
    let [msgReceivedInChat,setMsgReceivedInChat]                        = useMsgReceivedInChat((state)=>([state.msgReceivedInChat,state.setMsgReceivedInChat]))
    let [gottaScrollChat, setGottaScrollChat]                           = useGottaScrollChat((state)=>([state.gottaScrollChat, state.setGottaScrollChat]))
    let [messagesScrollLoaderActivated, setMessagesScrollLoaderActivated] = useState(false)


    const thersScroll = ()=>{
        return containerRef.current.scrollHeight > containerRef.current.clientHeight
    }
    const loadMessages = async ()=>{
        setMessagesScrollLoaderActivated(true)
        const response = await apiWrap(async ()=>{
            return await getMessagesHistorialAPI(clickedUser.id, getJWTFromLocalStorage().access, messagesHistorialPage.current)
        }, navigate, undefined, undefined, "getMessagesHistorial")
        if (response == undefined){
            return
        }
        if (response){
            if (response.status == 200){
                if (response.data.messages_hist == "no_messages_between"){
                    noMoreMessages.current = true
                } else {
                    containerRef.current.style.scrollBehavior = "auto"
                    oldScrollRef.current = containerRef.current.scrollHeight
                    resetScroll.current = true
                    messagesHistorialPage.current += 1
                    updateMessagesHistorial(setMessagesHistorial, messagesHistorialPage.current, response.data.messages_hist, messagesHistorial)
                }
            } else if (response.status == 400){
                if (response.data.error == "no_more_pages"){
                    noMoreMessages.current = true
                } else if (response.data.error == "error_while_getting_messages"){
                    toast.error('Ha habido un error cargando los mensajes')
                }
            } else {
                toast.error('Error inesperado cargando los mensajes')
            }

        }
        setMessagesScrollLoaderActivated(false)
    }

    const formatingFunction = (msg)=>{
        return <Message key={v4()} messageObj={msg}/>
    }
    const scrollHandler = async (e)=>{
        if (e.target.scrollTop <= 0){
            if (!noMoreMessages.current && thersScroll() ){  
                // la ultima condicion se pone para evitar que se llame a la api cuando no se ha scrolleado
                await loadMessages()
            }
        } else if ((event.target.scrollTop + event.target.clientHeight) >= (event.target.scrollHeight - 20)){
            setMsgReceivedInChat(false)
        }
    }

    useEffect(()=>{
        if (msgReceivedInChat && containerRef.current){
            if ((containerRef.current.scrollTop + containerRef.current.clientHeight) >= (containerRef.current.scrollHeight - 200)){
                setGottaScrollChat(true)
                setMsgReceivedInChat(false)
            }
        }
    }, [msgReceivedInChat])

    useEffect(()=>{
        if (containerRef.current && resetScroll.current){ // si cambia el historial de mensajes por recarga al scrollear ... 
            containerRef.current.scrollTop += containerRef.current.scrollHeight - oldScrollRef.current
            resetScroll.current = false
            containerRef.current.style.scrollBehavior = "smooth"
        }

    }, [messagesHistorial])
    useEffect(()=>{
        if (containerRef.current && gottaScrollChat){
            if (thersScroll()){
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
        }
        setGottaScrollChat(false)
    }, [gottaScrollChat])

    return (
        <div className="messages-container">
            {messagesHistorial.length !== 0 ?  
                <div className="messages-list-container scrollbar-container" ref={containerRef} onScroll={scrollHandler}>
                    <div className={messagesScrollLoaderActivated ? "scroll-loader-container scroll-loader-container__activated" : "scroll-loader-container"}>
                        {
                            messagesScrollLoaderActivated &&
                            <Loader loaderActivated={messagesScrollLoaderActivated}/>
                        }
                    </div>
                    {messagesHistorial.map(formatingFunction)}
                </div>
                :
                <h3 className="chat-container__title">
                    No hay mensajes :(
                </h3>
            }
        </div>
    )
}

MessagesContainer.propTypes = {
    messagesHistorialPage : PropTypes.object.isRequired,
    noMoreMessages : PropTypes.object.isRequired,
}
