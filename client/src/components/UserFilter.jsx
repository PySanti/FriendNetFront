import {BASE_USERNAME_MAX_LENGTH} from "../utils/constants"
import "../styles/UserFilter.css"
import {useUserKeyword} from "../store"
import {useRef, useEffect} from "react"


/**
 * Filtro de busqueda de usuarios
 */
export function UserFilter(){
    let [userKeyword, setUserKeyword] = useUserKeyword((state)=>([state.userKeyword, state.setUserKeyword]))
    const userFilterInputRef = useRef(null)
    useEffect(()=>{
        if (userFilterInputRef.current && userKeyword && userKeyword.length > 0){
            userFilterInputRef.current.value = userKeyword
        }
    }, [])
    return (
        <div className="user-filter-container">
            <span className="material-symbols-outlined loupe">
                search
            </span>
            <input 
                ref={userFilterInputRef}
                placeholder="Buscar" 
                className="users-filter-input non-shadow-input" 
                type="text" 
                onChange={ (e)=>{setUserKeyword(e.target.value)}} 
                maxLength={BASE_USERNAME_MAX_LENGTH}/>
        </div>
    )
}
