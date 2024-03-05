import {toast} from "sonner"
import {useUserKeyword} from "../store"
import {useUsersList} from "../store"
import {useUsersIdList} from "../store"
import {useUsersListPage} from "../store"
import {useNoMoreUsers} from "../store"
import {useFirstUsersListCall} from "../store"
import {useExecutingInSmallDevice} from "../store"
import {useClickedUser} from "../store"
import { UserButton } from "./UserButton"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect, useRef} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useNavigate} from "react-router-dom"
import {nonToastedApiCall} from "../utils/nonToastedApiCall"
import {Loader} from "../components/Loader"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 */
export function UsersList(){
    let [usersListPage, setUsersListPage]                           = useUsersListPage((state)=>[state.usersListPage, state.setUsersListPage])
    let [noMoreUsers, setNoMoreUsers]                               = useNoMoreUsers((state)=>[state.noMoreUsers, state.setNoMoreUsers])
    let [loaderActivated, setLoaderActivated]                       = useState(false)
    let [usersIdList, setUsersIdList]                               = useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
    let [usersList, setUsersList]                                   = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let executingInSmallDevice                                      = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let userKeyword                                                 = useUserKeyword((state)=>(state.userKeyword))
    let clickedUser                                                 = useClickedUser((state)=>(state.clickedUser))
    let callingUsersList                                            = useRef(false)
    let [firstUsersListCall, setFirstUsersListCall]                 = useFirstUsersListCall((state)=>[state.firstUsersListCall, state.setFirstUsersListCall])
    const navigate = useNavigate()

    const voidUserKeyword = ()=>{
        return !userKeyword || userKeyword.length == 0
    }
    const updateUsers = (new_users_list)=>{
        if (!voidUserKeyword() || (voidUserKeyword() && usersListPage==1)){
            setUsersIdList(new_users_list.map(user=>{
                return user.id
            }))
            setUsersList(new_users_list)
        } else {
            new_users_list.forEach(user => {        
                if (!usersIdList.includes(user.id)){
                    usersList.push(user)
                    usersIdList.push(user.id)
                }
            });
            setUsersIdList(usersIdList)
            setUsersList(usersList)
        }
    }
    const loadUsersList = async (page)=>{
        callingUsersList.current = true
        setLoaderActivated(true)
        const response = await nonToastedApiCall(async ()=>{
            return await getUsersListAPI(voidUserKeyword() ? undefined : userKeyword, getUserDataFromLocalStorage().id, page)
        }, navigate, 'Cargando lista de usuarios, espere', 10000)
        if (response){
            if (response.status == 200){
                updateUsers(response.data.users_list)
            } else if (response.data.error=== "no_more_pages"){
                setNoMoreUsers(true)
            } else {
                toast.error("¡ Ha habido un error cargando la lista de usuarios !")
            }
        }
        callingUsersList.current = false
        setLoaderActivated(false)
    }
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}  />
    }
    const scrollDetector = async (event)=>{
        const bottomArrived = (event.target.scrollTop + event.target.clientHeight) >= (event.target.scrollHeight - 3)
        if (bottomArrived && (!callingUsersList.current) && (!noMoreUsers)){
            await loadUsersList(usersListPage)
            setUsersListPage(usersListPage+1)
        }
    }
    useEffect(()=>{
        if (userIsAuthenticated()  && !firstUsersListCall){
            (async function() {
                await loadUsersList(1)
                setUsersListPage(2)
                setFirstUsersListCall(true)
            })()
        }
    }, [])
    useEffect(()=>{
        if (userKeyword !== undefined){ // si userKeyword esta inicializado ...
            (async function(){
                setNoMoreUsers(false)
                setUsersListPage(1)
                await loadUsersList(1)
            })()
        }
    }, [userKeyword])



    return (
        <>
            <div className={executingInSmallDevice? (!clickedUser? "users-list" : "users-list not-displayed") : "users-list"}>
                <UserFilter/>
                {usersList.length > 0 ? 
                    <>
                        <div className="users-list-container scrollbar-container"  onScroll={scrollDetector}>
                            {usersList.map(formatingFunction)}
                        </div>
                        <Loader loaderActivated={loaderActivated}/>
                    </>
                    :
                    <>
                    {
                        loaderActivated?
                        <Loader big loaderActivated={loaderActivated}/>
                        :
                        <div className="no-users-msg">
                            No se han encontrado usuarios :(
                        </div>
                    }
                    </>
                }
            </div>
        </>
    )
}

