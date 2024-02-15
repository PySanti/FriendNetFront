import { UserPhoto } from "./UserPhoto";
import "../styles/ClickedUserHeader.css"
import {useClickedUser, useTypingDB, useExecutingInSmallDevice} from "../store"
import {resetChats} from "../utils/resetChats"
/**
 * Cabecera del chat con datos del usuario
 */
export function ClickedUserHeader(){
    let executingInSmallDevice = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let clickedUser = useClickedUser((state)=>(state.clickedUser))
    const typingDB = useTypingDB((state)=>(state.typingDB))
    return (
        <div className="clicked-user-header-container">
            {
                executingInSmallDevice &&
                <span className="material-symbols-outlined back-chat-button" onClick={()=>resetChats()}>
                    arrow_back_ios
                </span>
            }
            <UserPhoto photoFile={clickedUser.photo_link} chatPhoto/>
            <div className="clicked-user__username-container">
                <h3 className="clicked-user__username">{clickedUser.username}{clickedUser.is_online && ", en linea"}</h3>
                <h3 className="clicked-user__typing">{typingDB[clickedUser.id] && "escribiendo ... "}</h3>
            </div>
        </div>
    )
}


