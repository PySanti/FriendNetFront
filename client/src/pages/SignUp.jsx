import {toast} from "sonner"
// react modules
import { Header }                   from "../components/Header";
// api's
import { createUsuarioAPI }         from "../api/createUsuario.api";
import { checkExistingUserAPI } from "../api/checkExistingUser.api";

import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"

// styles
import {   useNavigate } from "react-router-dom";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { UserInfoForm } from "../components/UserInfoForm";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import {BASE_NON_TOASTED_API_CALLS_TIMER} from "../utils/constants"
import {generateLocationProps} from "../utils/generateLocationProps"
import {toastedApiCall} from "../utils/toastedApiCall"
import {nonToastedApiCall} from "../utils/nonToastedApiCall"
/**
 * Page creada para el registro de los usuarios
 */
export function SignUp() {
    const navigate                                              = useNavigate()
    const onSignUp = async (data) =>{
        let response = await toastedApiCall(async ()=>{
            return await checkExistingUserAPI(data['username'], data['email'])
        }, navigate, 'Creando usuario')
        if (response){
            if (response.status == 200){
                if (!response.data.existing){
                    delete data.confirmPwd
                    response = await nonToastedApiCall(async ()=>{
                        return await createUsuarioAPI(data)
                    }, navigate, 'Almacenando datos del usuario en el servidor, espere', BASE_NON_TOASTED_API_CALLS_TIMER)
                    if (response){
                        if (response.status == 200){
                            toast.success("Usuario creado exitosamente, verifica tu correo electrónico")
                            navigate('/signup/activate', {state: generateLocationProps(data.email, data.username, response.data.new_user_id)})
                        } else if (response.data.error == "cloudinary_error"){
                            toast.error("¡ Error con la nube !")
                        } else {
                            toast.error("¡ Error inesperado creando tu usuario !")
                        }
                    }
                }else {
                    toast.error("¡ Ya existe un usuario con ese Nombre de usuario o Correo electrónico !")
                }
            } else {
                toast.error("¡ Error inesperado revisando si existe un usuario con esos datos !")
            }
        }
    }
    useEffect(()=>{
        document.title = generateDocumentTitle("Registrando")
    }, [])

    if (userIsAuthenticated()){
        return <UserLogged/>
    } else {
        return (
            <div className="centered-container">
                <div className="signup-page-container">
                    <Header msg="¡ Regístrate !"/>
                    <UserInfoForm onFormSubmit={onSignUp} extraButtons={[<Button key={v4()} back onClickFunction={()=>{navigate('/')}}/>,]}/>
                </div>
            </div>
        )
    }
}
