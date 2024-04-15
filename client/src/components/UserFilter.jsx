import {BASE_USERNAME_MAX_LENGTH} from "../utils/constants"
import "../styles/UserFilter.css"
import {useUserKeyword} from "../store"
import {useRef, useEffect} from "react"
import { IoSearchSharp } from "react-icons/io5";
import {IconedInput} from "./IconedInput"


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
        <IconedInput icon={<IoSearchSharp />}>
            <input 
                ref={userFilterInputRef}
                placeholder="Buscar" 
                className="users-filter-input" 
                type="text" 
                onChange={ (e)=>{setUserKeyword(e.target.value)}} 
                maxLength={BASE_USERNAME_MAX_LENGTH}/>
        </IconedInput>
    )
}
