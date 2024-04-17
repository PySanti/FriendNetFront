import { FormField } from "./FormField";
import {IconedInput} from "./IconedInput"
import {PropTypes} from "prop-types"
import { useState} from "react";
import {BASE_PASSWORD_MAX_LENGTH} from "../utils/constants"
import { TbLock } from "react-icons/tb";
import { TbLockOpen } from "react-icons/tb";

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, label}){
    let [previsualizationActivated, setPrevisualizationActivated] = useState(false)
    const handlePadlockClick = ()=>{
        setPrevisualizationActivated(!previsualizationActivated)
    }
    return (
        <FormField  errors={errors}>
            <IconedInput 
                icon={
                    previsualizationActivated ?
                        <TbLockOpen className="password-icon" onClick={handlePadlockClick}/>
                        :
                        <TbLock     className="password-icon" onClick={handlePadlockClick}/>
                    }>
                <input 
                    placeholder={label}
                    className="password-input" 
                    type={previsualizationActivated ? "text" : "password"} 
                    name={registerObject.name} 
                    maxLength={BASE_PASSWORD_MAX_LENGTH}
                    {...registerObject}/>
            </IconedInput>
        </FormField>
    )
}

PasswordField.propTypes = {
    errors : PropTypes.string,
    label : PropTypes.string.isRequired,
    registerObject : PropTypes.object.isRequired,
}

PasswordField.defaultValues = {
    errors : undefined
}

