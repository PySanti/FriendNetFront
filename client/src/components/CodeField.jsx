import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
import {BASE_SECURITY_CODE_LENGTH} from "../utils/constants"
import Lottie from "lottie-react"
import reload from "../../lottie/reload.json"
import {useRef} from "react"
import "../styles/CodeField.css"

/**
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 */
export function CodeField({errors, registerObject, codeSendingFunction}){
    const reloadAnimationRef = useRef(null)
    const handleReloadButtonClick = async ()=>{
        reloadAnimationRef.current.playSegments([0, 81], true)
        if (await codeSendingFunction() === "call_blocked"){
            reloadAnimationRef.current.pause()
        }
    }
    return (
        <FormField errors={errors}>
            <input
                placeholder="Código"
                type        =   "text"
                maxLength   =   {BASE_SECURITY_CODE_LENGTH}
                name        =   {registerObject.name}
                id          =   {registerObject.name}
                {...registerObject}/>
            <div className="reload-animation" onClick={handleReloadButtonClick}>
                <Lottie 
                    loop={false}
                    autoplay={false}
                    animationData={reload} 
                    lottieRef={reloadAnimationRef} 
                    />
            </div>
        </FormField>
    )
}

CodeField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
    codeSendingFunction : PropTypes.func,
}

CodeField.defaultProps = {
    errors : undefined,
}



