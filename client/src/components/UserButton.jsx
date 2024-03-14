import {diferentUserHasBeenClicked} from "../utils/diferentUserHasBeenClicked"
import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store"
import {useLastClickedUser} from "../store"
import {updateClickedUser} from "../utils/updateClickedUser"
import {useTypingDB, useNotifications, useEnterChatLoaderActivated} from "../store"
import {NOTIFICATIONS_WEBSOCKET} from "../utils/constants"
import {toast} from "sonner"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let [clickedUser, setClickedUser]   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let typingDB                        = useTypingDB((state)=>(state.typingDB))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))
    let notifications                   = useNotifications((state)=>(state.notifications))
    let setEnterChatLoaderActivated     = useEnterChatLoaderActivated((state)=>(state.setEnterChatLoaderActivated))
    const globeCls                      = "user-button-globe"
    const handleUserButtonClick         = ()=>{
        if (!NOTIFICATIONS_WEBSOCKET.current || NOTIFICATIONS_WEBSOCKET.current.readyState !== 1){
            toast.error("Cargando")
        } else {
            if (diferentUserHasBeenClicked(clickedUser, user) ){
                setEnterChatLoaderActivated(true)
            }
            updateClickedUser(clickedUser, user, setClickedUser, setLastClickedUser)
        }
    }
    return (
        <button className={(clickedUser && clickedUser.id == user.id) ? "user-button user-button__selected" : "user-button"} onClick={handleUserButtonClick}>
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
