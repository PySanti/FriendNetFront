import {useState} from "react"
import { TiUserOutline } from "react-icons/ti";
import "../styles/ChatPhotoStyles.css"
import {Modal} from "../components/Modal.jsx"
import {ModalBackButton} from "../components/ModalBackButton.jsx"
import {BigUserPhoto} from "../components/BigUserPhoto.jsx"

export function ChatPhoto({photo, modal, big}){
    let [modalOpened, setModalOpened] = useState(false)
    return (
        <>
            <div className={big ? "chat-photo-container big-photo" : "chat-photo-container"} onClick={(modal && photo) ? ()=>setModalOpened(true) : undefined}>
                {photo ?
                
                    <img className="chat-photo" src={photo} onMouseDown={(e)=>e.preventDefault()}/>
                :
                    <span className="chat-photo-nophoto">
                        <TiUserOutline />
                    </span>
            }
            </div>
            {
                (modal && photo) &&
                <Modal opened={modalOpened}>
                    <ModalBackButton onClick={()=>setModalOpened(false)}/>
                    <BigUserPhoto photo={photo}/>
                </Modal>
            }

        </>
    )
}