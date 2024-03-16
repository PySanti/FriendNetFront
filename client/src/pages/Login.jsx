import { Header } from "../components/Header"
import {toast} from "sonner"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import { UserLogged } from "./UserLogged"
import { getUserDetailAPI } from "../api/getUserDetailApi.api"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "../components/LoginForm"
import { Button } from "../components/Button"
import { v4 } from "uuid"
import { saveUserDataInLocalStorage } from "../utils/saveUserDataInLocalStorage"
import {BASE_NON_TOASTED_API_CALLS_TIMER} from "../utils/constants"
import { saveNotificationsInLocalStorage } from "../utils/saveNotificationsInLocalStorage"
import {loginUser} from "../utils/loginUser"
import {generateLocationProps} from "../utils/generateLocationProps"
import {apiWrap} from "../utils/apiWrap"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
import {useWebsocketMounted} from "../store"
/**
 * Pagina creada para llevar logeo de usuarios
 */
export function Login() {
    const   navigate          = useNavigate()
    const setWebsocketMounted = useWebsocketMounted((state)=>(state.setWebsocketMounted))

    const onLogin = async (data)=>{
        // en este punto ya se sabe que el usuario no esta autenticado
        let response = await apiWrap(async ()=>{
            return await getUserDetailAPI(data.username, data.password)
        }, navigate, 'Iniciando sesión', undefined, "getUserDetail")
        if (response){
            if (response.status == 200){
                const userDetail = response.data.user
                if (!userDetail.is_active){
                    toast.error('Activa tu cuenta antes de continuar')
                    navigate('/signup/activate', {state: generateLocationProps(userDetail.email, userDetail.username, userDetail.id)})
                } else {
                    response = await apiWrap(async ()=>{
                        return await loginUser(data)
                    }, navigate, 'Generando token de seguridad, espere', BASE_NON_TOASTED_API_CALLS_TIMER, "login")
                    if (response){
                        if (response.status == 200){
                            const baseNotifications = userDetail.notifications
                            delete userDetail.notifications
                            saveNotificationsInLocalStorage(baseNotifications)
                            saveUserDataInLocalStorage(userDetail)
                            toast.success("Sesión iniciada con éxito")
                            setWebsocketMounted(null)
                            navigate('/home/')
                        } else if (response.data.error == "user_is_online"){
                            toast.error("El usuario ya esta en linea o se esta restableciendo la conexión con el servidor") 
                        } else{
                            toast.error("Error inesperado iniciando sesión")
                        } 
                    }
                }
            } else if (response.data.error == "user_not_exists"){
                // por seguridad, la api retornara el mismo codigo de error para cuando el usuario o la contrasenia esten mal
                toast.error("Usuario o contraseña inválidos") 
            } else {
                toast.error("Error inesperado buscando datos del usuario")
            }
        }
    }
    useEffect(()=>{
        document.title = generateDocumentTitle("Iniciando Sesión")
    }, [])
    if (userIsAuthenticated()){
        return <UserLogged/> 
    } else{
        return (
            <div className="centered-container">
                <div className="login-container">
                    <Header msg="Introduce tus credenciales para ingresar"/>
                    <LoginForm handleLogin={onLogin} extraButtons={[
                        <Button key={v4()} onClickFunction={()=>{navigate('/')}} back/>, 
                        <Button key={v4()} onClickFunction={()=>navigate('/login/forgot_password/')} buttonText="Olvide mi contraseña"/>
                    ]}/>
                </div>
            </div>
        )
    }
}