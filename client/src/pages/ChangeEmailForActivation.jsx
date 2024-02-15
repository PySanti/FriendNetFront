import { Header } from "../components/Header";
import {toast} from "sonner"
import {  useLocation, useNavigate} from "react-router-dom";
import { Button } from "../components/Button";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { EmailField } from "../components/EmailField";
import { BASE_EMAIL_CONSTRAINTS } from "../utils/constants";
import { Form } from "../components/Form";
import { UserNotLogged } from "./UserNotLogged";
import { userIsAuthenticated } from "../utils/userIsAuthenticated";
import { UserLogged } from "./UserLogged";
import { changeEmailForActivationAPI } from "../api/changeEmailForActivation.api";
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"
import {toastedApiCall} from "../utils/toastedApiCall"
/**
 * Page creada para la modificacion del Email para activacion 
 */
export function ChangeEmailForActivation(){
    const props                                         = useLocation().state
    const  navigate                                     = useNavigate()
    const {register, handleSubmit, formState : {errors}}  = useForm()
    const onSubmit = handleSubmit(async (data)=>{
        if (data.email !== props.userEmail){
            const response = await toastedApiCall(async ()=>{
                return await changeEmailForActivationAPI(props.userId, data.email) 
            }, navigate, 'Modificando correo electrónico')
            if (response){
                if (response.status == 200){
                    props.userEmail = data.email
                    toast.success("Correo electrónico modificado exitosamente")
                    navigate('/signup/activate', {state: props})
                } else if (response.data.error==="email_exists"){
                    toast.error("¡ Error, ese email ya fue registrado !")
                } else {
                    toast.error("¡ Error inesperado cambiando tu correo electrónico !")
                }
            }
        } else {
            toast.error('¡ No hay cambios !')
        }
    })
    useEffect(() => {
        document.title = generateDocumentTitle("Cambiando Correo")
    }, [])
    
    if (userIsAuthenticated()){
        return <UserLogged/>
    } else if (!props){
        return <UserNotLogged msg="No puedes cambiar tu email para activar tu cuenta si aun no tienes cuenta o no has tratado de iniciar sesión en ella"/>
    } else {
        return (
            <div className="centered-container">
                <div className="change-email-container">
                    <Header msg="Cambiando correo para activación"/>
                    <Form 
                        onSubmitFunction={onSubmit} 
                        buttonMsg="Cambiar" 
                        buttonsList={[<Button key={v4()} back onClickFunction={()=>{navigate('/signup/activate', {state: props})}} />]}
                        >
                        <EmailField defaultValue={props.userEmail} errors={errors.email && errors.email.message} registerObject={register("email", BASE_EMAIL_CONSTRAINTS)}/>
                    </Form>
                </div>
            </div>
        )
    }
}