import "../styles/Form.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
/**
 * Componente creado para almacenar formularios. Wrapper de FormFields y buttons
 * @param {import("react").ComponentElement} children hijos del formulario
 * @param {Function}  onSubmitFunction funcion que se ejecutara cuando se envie el formulario
 * @param {String} buttonMsg mensaje de button de submit
 * @param {Array} buttonsList sera una lista de buttons que se deseen renderizar junto al submit button
 * @param {Boolean} button_hovered sera una lista de buttons que se deseen renderizar junto al submit button
 * @param {Boolean} containsPassword
 */
export function Form({children, onSubmitFunction, buttonMsg, buttonsList, button_hovered, containsPassword}){
    const baseClsName = "form-container"
    return (
        <form className={containsPassword? `${baseClsName} password-form` : baseClsName} onSubmit={onSubmitFunction}>
            {children}
            <div className="form-container-buttons-container">
                <Button buttonText={buttonMsg} isSubmit button_hovered={button_hovered}/>
                {buttonsList}
            </div>
        </form>
    )
}


Form.propTypes = {
    children : PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onSubmitFunction : PropTypes.func.isRequired,
    buttonMsg : PropTypes.string.isRequired,
    buttonsList : PropTypes.array,
    button_hovered : PropTypes.bool,
    containsPassword : PropTypes.bool,
}
Form.defaultProps={
    buttonsList : undefined,
    containsPassword : undefined
}

