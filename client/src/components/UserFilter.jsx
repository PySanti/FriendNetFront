import {BASE_USERNAME_MAX_LENGTH} from "../utils/constants"
import "../styles/UserFilter.css"
import {useUserKeyword} from "../store"


/**
 * Filtro de busqueda de usuarios
 */
export function UserFilter(){
    let setUserKeyword = useUserKeyword((state)=>(state.setUserKeyword))

    return (
        <div className="user-filter-container">
            <input 
                placeholder="Busca un usuario" 
                className="users-filter-input non-shadow-input" 
                type="text" 
                onChange={ (e)=>{setUserKeyword(e.target.value)}} 
                maxLength={BASE_USERNAME_MAX_LENGTH}/>
        </div>
    )
}
