import { FormField } from "./FormField";
import {IconedInput} from "./IconedInput"
import {PropTypes} from "prop-types"
import "../styles/PasswordField.css"
import { useState, useRef } from "react";
import padlock from "../../lottie/padlock"
import Lottie from "lottie-react"
import {BASE_PASSWORD_MAX_LENGTH} from "../utils/constants"
import "../styles/PasswordFieldStyles.css"
import { TbLock } from "react-icons/tb";

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, label}){
    let [previsualizationActivated, setPrevisualizationActivated] = useState(false)
    const padlockAnimationRef = useRef()
    const handlePadlockClick = ()=>{
        setPrevisualizationActivated(!previsualizationActivated)
        padlockAnimationRef.current.setSpeed(4)
        padlockAnimationRef.current.playSegments(!previsualizationActivated ? [0,95] : [95,210], true)
    }
    return (
        <div className="password-field-container">
            <FormField  errors={errors}>
                <IconedInput icon={<TbLock/>}>
                    <input 
                        placeholder={label}
                        className="password-input" 
                        type={previsualizationActivated ? "text" : "password"} 
                        name={registerObject.name} 
                        maxLength={BASE_PASSWORD_MAX_LENGTH}
                        {...registerObject}/>
                </IconedInput>

            </FormField>
            <div className="password-visualization" onClick={handlePadlockClick}>
                <Lottie 
                    loop={false}
                    autoplay={false}
                    animationData={padlock} 
                    lottieRef={padlockAnimationRef} 
                    />
            </div>
        </div>
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

