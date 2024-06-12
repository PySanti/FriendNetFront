import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store"
import {updateClickedUser} from "../utils/updateClickedUser"
import {useTypingDB, useNotifications, useExecutingInSmallDevice} from "../store"
import {ChatPhoto} from "../components/ChatPhoto"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let clickedUser                     = useClickedUser((state)=>(state.clickedUser))
    let typingDB                        = useTypingDB((state)=>(state.typingDB))
    let notifications                   = useNotifications((state)=>(state.notifications))
    let executingInSmallDevice          = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    const globeCls                      = "user-button-globe"

    return (
        <div   onClick={()=>{updateClickedUser(user)}} className={(clickedUser && clickedUser.id == user.id && !executingInSmallDevice) ? "user-button-container user-button__selected" : "user-button-container"}>
            <ChatPhoto photo={user.photo_link}/>
            <div className="user-button">
                <div className="user-button__username">
                    {user.username}
                    {typingDB[user.id] && " ..."}
                </div>
                <div className={Object.keys(notifications).includes(`${user.id}`)? `${globeCls} ${globeCls}__activated` : globeCls}></div>
            </div>
            {user.id == 1 &&
                <div className="ceo-tag">C.E.O</div>
            }
        </div>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
