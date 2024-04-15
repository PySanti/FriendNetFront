import "../styles/IconedInput.css"
import {PropTypes} from "prop-types"

export function IconedInput({children, icon, right}){
    return (
        <div className="iconed-input-container">
            {
                right ?
                <>
                    {children}
                    {icon}
                </>
                :
                <>
                    {icon}
                    {children}
                </>
            }
        </div>
    )
}


IconedInput.propTypes = {
    children : PropTypes.object.isRequired,
    icon : PropTypes.object.isRequired,
    right : PropTypes.bool
}

IconedInput.defaultProps = {
    right : undefined,
}

