import "../styles/IconedInput.css"
import {PropTypes} from "prop-types"

export function IconedInput({children, icon}){
    return (
        <div className="iconed-input-container">
            {icon}
            {children}
        </div>
    )
}


IconedInput.propTypes = {
    children : PropTypes.object.isRequired,
    icon : PropTypes.object.isRequired,
}

