import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store"
import {updateClickedUser} from "../utils/updateClickedUser"
import {useTypingDB, useNotifications} from "../store"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let clickedUser                     = useClickedUser((state)=>(state.clickedUser))
    let typingDB                        = useTypingDB((state)=>(state.typingDB))
    let notifications                   = useNotifications((state)=>(state.notifications))
    const globeCls                      = "user-button-globe"

    return (
        <button className={(clickedUser && clickedUser.id == user.id) ? "user-button user-button__selected" : "user-button"} onClick={()=>{updateClickedUser(user)}}>
            <div className="user-button__username">
                {user.username}
                {typingDB[user.id] && " ..."}
            </div>
            <div className={Object.keys(notifications).includes(`${user.id}`)? `${globeCls} ${globeCls}__activated` : globeCls}></div>
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
