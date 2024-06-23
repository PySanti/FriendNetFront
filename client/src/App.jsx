import {BrowserRouter, Routes, Route} from "react-router-dom"
import {PageOutOffService} from "./pages/PageOutOffService"
import {resetChats} from "./utils/resetChats"
import {Toaster, toast} from "sonner"
import {ConnectionFailedPage} from "./pages/ConnectionFailedPage"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { Profile } from "./pages/Profile.jsx"
import { ChangePwd } from "./pages/ChangePwd.jsx"
import { ChangeEmailForActivation } from "./pages/ChangeEmailForActivation.jsx"
import {useEffect} from "react"
import {NOTIFICATIONS_WEBSOCKET, SMALL_DEVICE_WIDTH, DEBUG} from "./utils/constants"
import {clearLocalStorage} from "./utils/clearLocalStorage"
import {getUserDataFromLocalStorage} from "./utils/getUserDataFromLocalStorage"
import {NotificationsWSCanBeUpdated} from "./utils/NotificationsWSCanBeUpdated"
import {saveNotificationsInLocalStorage} from "./utils/saveNotificationsInLocalStorage"
import {logoutUser} from "./utils/logoutUser"
import {Page404} from "./pages/Page404"
import {shiftUser} from "./utils/shiftUser"
import * as states from "./store"
import alert from "./sounds/alert.mp3"
import new_message from "./sounds/new_message.mp3"
import {DarkModeButton} from "./components/DarkModeButton"
import {useRef} from "react"
import {disconnectWebsocket} from "./utils/disconnectWebsocket"
import {apiWrap} from "./utils/apiWrap"
import {getUserNotificationsAPI} from "./api/getUserNotifications.api"
import {getJWTFromLocalStorage} from "./utils/getJWTFromLocalStorage"
import {NotificationsWSInitialize} from "./utils/NotificationsWSInitialize"


/**
/**
 * Toda la implementacion que tenemos del websocket de notificaciones en el app.jsx
 * es para poder agregar un soporte basico para recepcion de mensajes en el websocket
 * mientras el Home no se monta ...
 */

function App() {
  let [notifications, setNotifications]                                 = states.useNotifications((state)=>([state.notifications, state.setNotifications]))
  let [usersList, setUsersList]                                         = states.useUsersList((state)=>([state.usersList, state.setUsersList]))
  let [messagesHistorial, setMessagesHistorial]                         = states.useMessagesHistorial((state)=>([state.messagesHistorial, state.setMessagesHistorial]))
  let [typingDB, setTypingDB]                                           = states.useTypingDB((state)=>[state.typingDB, state.setTypingDB])
  let [clickedUser, setClickedUser]                                     = states.useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
  let setLastClickedUser                                                = states.useLastClickedUser((state)=>(state.setLastClickedUser))
  let [usersIdList, setUsersIdList]                                     = states.useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
  let setMsgReceivedInChat                                              = states.useMsgReceivedInChat((state)=>(state.setMsgReceivedInChat))
  let setExecutingInSmallDevice                                         = states.useExecutingInSmallDevice((state)=>(state.setExecutingInSmallDevice))
  let [websocketMounted,setWebsocketMounted]                            = states.useWebsocketMounted((state)=>([state.websocketMounted, state.setWebsocketMounted]))
  let userKeyword                                                       = states.useUserKeyword((state)=>(state.userKeyword))
  let [connectionFailed, setConnectionFailed]                           = states.useConnectionFailed((state)=>([state.connectionFailed, state.setConnectionFailed]))
  let alertRef                                                          = useRef(null)
  let userActivityRef                                                   = useRef(true)
  let unativityToastId                                                  = useRef(null)
  let newMessageRef                                                     = useRef(null)
  const handleUserActivity  = () =>{
    userActivityRef.current = true
    if (unativityToastId.current){
      toast.dismiss(unativityToastId.current)
      unativityToastId.current = null
    }
  }
  const handleNotificationsReload = async ()=>{
    const response = await apiWrap(async ()=>{
      return await getUserNotificationsAPI(getJWTFromLocalStorage().access)
    }, undefined, 'Cargando notificaciones recientes', 5000, 'getUserNotifications')
    if (response){
      if (response.status == 200){
        saveNotificationsInLocalStorage(response.data.recent_notifications)
        setNotifications(response.data.recent_notifications)
      } else {
        toast.error("Error inesperado cargando las notificaciones recientes del usuario")
      }
    }
  }
  const handleReconnection = async ()=>{
    if (document.visibilityState === "visible" && getUserDataFromLocalStorage()){
      // se setea la refencia aca, ya que, como se va a volver a montar el websocket
      // se quiere que el primer ping sea respondido
      handleUserActivity()
      disconnectWebsocket()
    }
  }

  const audioEffect = ()=>{
    alertRef.current.volume = 0.5
    alertRef.current.play()
  }
  const newMessageEffect = ()=>{
    newMessageRef.current.volume = 0.5
    newMessageRef.current.play()
  }
  useEffect(()=>{

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity)
    document.addEventListener('touchstart', handleUserActivity);
    document.addEventListener('touchmove', handleUserActivity);
    document.addEventListener('touchend', handleUserActivity);
    window.addEventListener('orientationchange', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    if (DEBUG){
      // al montar la pagina, si esta en mantenimiento y hay datos en el localStorage, eliminamos la data
      // y si el websocket esta montado, tambien lo pelamos
      clearLocalStorage()
      disconnectWebsocket()
    }
    if (!websocketMounted && getUserDataFromLocalStorage()){
      (async function(){
          await handleNotificationsReload()
      })();
      NotificationsWSInitialize(getUserDataFromLocalStorage().id)
      setWebsocketMounted(true)
    }
    document.addEventListener("visibilitychange", handleReconnection)
    window.addEventListener('resize', ()=>{
      setExecutingInSmallDevice(window.innerWidth <= SMALL_DEVICE_WIDTH)
    });
    window.addEventListener("offline", ()=>{
      if (getUserDataFromLocalStorage()){
        logoutUser()
      } 
    })
    return ()=>{
      document.removeEventListener("visibilitychange", handleReconnection)
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity)
      document.removeEventListener('touchstart', handleUserActivity);
      document.removeEventListener('touchmove', handleUserActivity);
      document.removeEventListener('touchend', handleUserActivity);
      window.removeEventListener('orientationchange', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    }
  }, [websocketMounted])


  useEffect(()=>{
    if (NotificationsWSCanBeUpdated()){
      NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        if (data.type == "new_notification"){
            if (data.value.new_notification.sender_user.id != getUserDataFromLocalStorage().id){
              audioEffect()
              notifications[data.value.new_notification.sender_user.id] = data.value.new_notification
              toast(data.value.new_notification.sender_user.username, {
                description:data.value.new_notification.msg,
              })
              setNotifications(notifications)
              saveNotificationsInLocalStorage(notifications)
              shiftUser(usersList, setUsersList, data.value.new_notification.sender_user, usersIdList, setUsersIdList, userKeyword)
            }
        } else if (data.type == "connection_error"){
          clearLocalStorage()
          setConnectionFailed(true)
        } else  if (data.type === "updated_user"){
            if (usersList.length > 0){
                setUsersList(usersList.map(user => { 
                    return  user.id == data.value.id ? data.value : user;
                }))
                if (clickedUser && data.value.id == clickedUser.id){
                    setLastClickedUser(clickedUser)
                    data.value.is_online = clickedUser.is_online
                    setClickedUser(data.value)
                }
            }
        } else if (data.type === "typing_inform"){
          if (usersIdList.includes(data.value.user_id)){
            typingDB[data.value.user_id] = data.value.typing
            setTypingDB(typingDB)
          }
        } else if (data.type === "message_broadcast"){
            if (Number(data.value.parent_id) !== Number(getUserDataFromLocalStorage().id)){
                setMessagesHistorial([...messagesHistorial, data.value])
                setMsgReceivedInChat(true)
                newMessageEffect()
            }
        } else if (data.type === "connection_inform"){
            console.log("Recibiendo connection_inform")
            if (data.value.user_id == clickedUser.id){
                clickedUser.is_online = data.value.connected
                if (!data.value.connected){
                    typingDB[clickedUser.id] =  false
                    setTypingDB(typingDB)
                }
                setClickedUser(clickedUser)
            }
        } else if (data.type == "ping" && getUserDataFromLocalStorage()){
          if (userActivityRef.current ){
            userActivityRef.current = false
            NOTIFICATIONS_WEBSOCKET.current.send(JSON.stringify({
              "type" : "pong"
            }))
          } else {
            if (!unativityToastId.current){
              unativityToastId.current = toast.error("Realiza alguna acción o se cerrara la sesión por inactividad", {duration : 30000})
            } else {
              logoutUser()
            }
          }
        }
      }
  }
  }, [notifications, usersList, clickedUser, messagesHistorial])


  return (
    <>
    <DarkModeButton/>
    {
      DEBUG ? 
        <PageOutOffService/>
        :
        connectionFailed ?
          <ConnectionFailedPage/>
          :
          <>
            <audio ref={alertRef} src={alert} onEnded={()=>{
              alertRef.current.pause();
              alertRef.current.currentTime = 0; // Reiniciar la reproducción al principio
            }}></audio>
            <audio ref={newMessageRef} src={new_message} onEnded={()=>{
              newMessageRef.current.pause();
              newMessageRef.current.currentTime = 0; // Reiniciar la reproducción al principio
            }}></audio>
            <Toaster 
              visibleToasts={1}
              position="bottom-right"
              closeButton
              toastOptions={{
              className : "toast-style",
              duration : 5000,
            }}/>
            <BrowserRouter>
              <Routes>
                <Route 
                  exact 
                  path="/"                   
                  element={
                    <Root />
                }/>
                <Route 
                  exact 
                  path="/signup/"            
                  element={
                    <SignUp />
                  }/>
                <Route 
                  exact 
                  path="/signup/activate/"   
                  element={
                    <AccountActivation />
                  }/>
                <Route 
                  exact 
                  path='/signup/activate/change_email'  
                  element={
                      <ChangeEmailForActivation/> 
                  }/>
                <Route 
                  exact 
                  path="/login/"             
                  element={ 
                      <Login/> 
                  }/>
                <Route 
                  exact 
                  path="/login/forgot_password"             
                  element={ 
                      <ForgotPasswordPage/> 
                  }/>
                <Route 
                  exact 
                  path='/home/'              
                  element={
                    <Home/> 
                  }/>
                <Route 
                  exact 
                  path='/home/profile/'      
                  element={
                      <Profile/> 
                  }/>
                <Route 
                  exact 
                  path='/home/profile/change_pwd'  
                  element={
                      <ChangePwd/> 
                  }/>
                <Route 
                  exact 
                  path='/*'  
                  element={
                      <Page404/> 
                  }/>
              </Routes>
            </BrowserRouter>
          </>
    }
    </>
  )
}

export default App