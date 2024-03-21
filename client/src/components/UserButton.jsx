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
        <div   onClick={()=>{updateClickedUser(user)}} className={(clickedUser && clickedUser.id == user.id) ? "user-button-container user-button__selected" : "user-button-container"}>
            <div className="user-button__userphoto-container">
                {user.photo_link ?
                
                    <img className="user-button__userphoto" src={user.photo_link}/>
                :
                    <span className="material-symbols-outlined userphoto-nophoto">
                        no_photography
                    </span>
            }
            </div>
            <div className="user-button">
                <div className="user-button__username">
                    {user.username}
                    {typingDB[user.id] && " ..."}
                </div>
                <div className={Object.keys(notifications).includes(`${user.id}`)? `${globeCls} ${globeCls}__activated` : globeCls}></div>
            </div>
        </div>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
