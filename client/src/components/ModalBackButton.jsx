import { IoClose } from "react-icons/io5";
import "../styles/ModalBackButtonStyles.css"

export function ModalBackButton({onClick}){
    return (
        <div className="modal-back-button-container">
            <IoClose onClick={onClick}/>
        </div>
    )
}