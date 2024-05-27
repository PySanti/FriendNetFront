import {toast} from "sonner"
import {
    useUserKeyword, 
    useClickedUser,
    useExecutingInSmallDevice, 
    useFirstUsersListCall,
    useNoMoreUsers, 
    useUsersListPage,
    useUsersList,
    useUsersIdList} from "../store"
import { UserButton } from "./UserButton"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect, useRef} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useNavigate} from "react-router-dom"
import {apiWrap} from "../utils/apiWrap"
import {Loader} from "../components/Loader"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 */
export function UsersList(){
    let [usersListPage, setUsersListPage]                           = useUsersListPage((state)=>[state.usersListPage, state.setUsersListPage])
    let [noMoreUsers, setNoMoreUsers]                               = useNoMoreUsers((state)=>[state.noMoreUsers, state.setNoMoreUsers])
    let [smallLoaderActivated, setSmallLoaderActivated]             = useState(false)
    let [bigLoaderActivated, setBigLoaderActivated]                 = useState(false)
    let [usersIdList, setUsersIdList]                               = useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
    let [usersList, setUsersList]                                   = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let executingInSmallDevice                                      = useExecutingInSmallDevice((state)=>(state.executingInSmallDevice))
    let userKeyword                                                 = useUserKeyword((state)=>(state.userKeyword))
    let clickedUser                                                 = useClickedUser((state)=>(state.clickedUser))
    let mostRecentUserKeyword                                       = useRef(null)
    let [firstUsersListCall, setFirstUsersListCall]                 = useFirstUsersListCall((state)=>[state.firstUsersListCall, state.setFirstUsersListCall])
    const navigate = useNavigate()

    const voidUserKeyword = (lastUserKeyword)=>{
        return !lastUserKeyword || lastUserKeyword.length == 0
    }
    const updateUsers = (new_users_list, lastUserKeyword)=>{
        if (!voidUserKeyword(lastUserKeyword) || (voidUserKeyword(lastUserKeyword) && usersListPage==1)){
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
    const loadUsersList = async (page, lastUserKeyword, apiCallingBlock)=>{
        const response = await apiWrap(async ()=>{
            return await getUsersListAPI(voidUserKeyword(lastUserKeyword) ? undefined : lastUserKeyword, getUserDataFromLocalStorage().id, page)
        }, navigate, undefined, undefined, apiCallingBlock ?  "getUsersList" : undefined)
        if (lastUserKeyword && lastUserKeyword != mostRecentUserKeyword.current){
            return
        }
        if (response){
            if (response.status == 200){
                updateUsers(response.data.users_list, lastUserKeyword)
                setUsersListPage(page+1)
            } else if (response.data.error=== "no_more_pages"){
                setNoMoreUsers(true)
            } else {
                toast.error("Ha habido un error cargando la lista de usuarios")
            }
        }
        if (response == undefined){
            return
        }
    }
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}  />
    }
    const scrollDetector = async (event)=>{
        const bottomArrived = (event.target.scrollTop + event.target.clientHeight) >= (event.target.scrollHeight - 3)
        if (bottomArrived && (!noMoreUsers)){
            setSmallLoaderActivated(true)
            await loadUsersList(usersListPage, undefined, true)
            setSmallLoaderActivated(false)
        }
    }

    useEffect(()=>{
        if (userIsAuthenticated()  && !firstUsersListCall){
            (async function() {
                setBigLoaderActivated(true)
                await loadUsersList(1, undefined, true)
                setFirstUsersListCall(true)
                setBigLoaderActivated(false)
            })()
        }
    }, [firstUsersListCall])
    useEffect(()=>{
        if (userKeyword !== undefined){ // si userKeyword esta inicializado ...
            (async function(){
                setBigLoaderActivated(true);
                setNoMoreUsers(false)
                setUsersListPage(1)
                mostRecentUserKeyword.current = userKeyword
                await loadUsersList(1, userKeyword, false)
                setBigLoaderActivated(false)
            })()
        }
    }, [userKeyword])



    return (
        <>
            <div className={executingInSmallDevice? (!clickedUser? "users-list" : "users-list not-displayed") : "users-list"}>
                <UserFilter/>
                {
                    bigLoaderActivated ?
                        <Loader big loaderActivated={bigLoaderActivated}/>
                    :
                    <>
                        {usersList && usersList.length > 0 ? 
                            <>
                                <div className="users-list-container scrollbar-container"  onScroll={scrollDetector}>
                                    {usersList.map(formatingFunction)}
                                </div>
                                <div className={smallLoaderActivated ? "loader-container loader-container__activated" : "loader-container"}>
                                    <h3 className="loading-text">Cargando  ...</h3>
                                </div>
                            </>
                            :
                            <div className="no-users-msg">
                                {firstUsersListCall && "No se han encontrado usuarios :(" }
                            </div>
                        }
                    </>
                }
            </div>
        </>
    )
}

