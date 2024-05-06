import "../styles/ClickedUserHeader.css"
import {useClickedUser, useTypingDB, useExecutingInSmallDevice} from "../store"
import {resetChats} from "../utils/resetChats"
import { FaArrowLeftLong } from "react-icons/fa6";
import {ChatPhoto} from "../components/ChatPhoto.jsx"
/**
 * Cabecera del chat con datos del usuario
 */
export function ClickedUserHeader(){
    let executingInSmallDevice = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let clickedUser = useClickedUser((state)=>(state.clickedUser))
    const typingDB = useTypingDB((state)=>(state.typingDB))
    return (
        <div className= "clicked-user-header-container">
            {
                executingInSmallDevice &&
                <span className="back-chat-button" onClick={()=>resetChats()}>
                    <FaArrowLeftLong />
                </span>
            }
            <ChatPhoto photo={clickedUser.photo_link} modal big/>
            <div className="clicked-user__username-container">
                <h3 className="clicked-user__username">
                    {clickedUser.username}<span className={clickedUser.is_online ? "clicked-user-online clicked-user-online__activated" : "clicked-user-online"}> - en linea</span>
                </h3>
                <h3 className={typingDB[clickedUser.id] ? "clicked-user__typing clicked-user__typing__activated" : "clicked-user__typing"}>
                    escribiendo ...
                </h3>
            </div>
        </div>
    )
}


