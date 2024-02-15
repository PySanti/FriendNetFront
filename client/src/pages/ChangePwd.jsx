import {toast} from "sonner"
import "../styles/ChangePwdStyles.css"
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useForm } from "react-hook-form";
import {BASE_PASSWORD_CONSTRAINTS} from "../utils/constants"
import { changeUserPwdAPI } from "../api/changePwd.api";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { PasswordField } from "../components/PasswordField";
import { v4 } from "uuid";
import {getJWTFromLocalStorage} from "../utils/getJWTFromLocalStorage"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
import {toastedApiCall} from "../utils/toastedApiCall"

/**
 * Pagina creado para cambio de contraseña
 */
export function ChangePwd(){
    const {register, handleSubmit, formState : {errors}} = useForm()
    const navigate = useNavigate()
    const changePwd = handleSubmit(async (data)=>{
        if (data['oldPwd'] !== data['newPwd']){
            const response = await toastedApiCall(async ()=>{
                return await changeUserPwdAPI(data.oldPwd, data.newPwd, getJWTFromLocalStorage().access)
            }, navigate, 'Modificando contraseña')
            if (response){
                if (response.status == 200){
                    toast.success("Contraseña modificada exitosamente")
                } else if (response.data.error === 'invalid_pwd'){
                    toast.error("¡ Error, la contraseña actual es invalida !")
                } else {
                    toast.error('¡ Error inesperado cambiando la contraseña !')
                }
            }
        } else {
            toast.error("No hay cambios")
        }
    })
    useEffect(() => {
        document.title = generateDocumentTitle("Cambiando Contraseña")
    }, [])
    
    if (!userIsAuthenticated()){
        return  <UserNotLogged msg="No puedes cambiar tu contraseña si aun no tienes cuenta o no has iniciado sesión en ella"/>
    } else {
        return (
            <div className="centered-container">
                <div className="change-pwd-container">
                    <Header msg="Modificando contraseña"/>
                    <div className="change-pwd-container__form-container">
                        <Form 
                            onSubmitFunction={changePwd} 
                            buttonMsg="Modificar" 
                            buttonsList={[<Button 
                                key={v4()} 
                                back
                                onClickFunction={()=>{navigate('/home/profile')}} />]} 
                            containsPassword
                            >
                            <PasswordField label="Contraseña actual" errors={errors.oldPwd && errors.oldPwd.message} registerObject={register("oldPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                            <PasswordField label="Nueva contraseña" errors={errors.newPwd && errors.newPwd.message} registerObject={register("newPwd", BASE_PASSWORD_CONSTRAINTS)}/>
                        </Form>
                    </div>

                </div>
            </div>
        )
    }
}