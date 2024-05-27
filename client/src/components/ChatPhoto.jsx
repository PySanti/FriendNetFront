import {useState} from "react"
import { TiUserOutline } from "react-icons/ti";
import "../styles/ChatPhotoStyles.css"
import {Modal} from "../components/Modal.jsx"
import {ModalBackButton} from "../components/ModalBackButton.jsx"
import {BigUserPhoto} from "../components/BigUserPhoto.jsx"

export function ChatPhoto({photo, modal, big, small}){

    let [modalOpened, setModalOpened] = useState(false)
    let className = big ? "chat-photo-container big-photo" : (small ? "chat-photo-container small-photo" : "chat-photo-container")
    return (
        <>
            <div className={className} onClick={(modal && photo) ? ()=>setModalOpened(true) : undefined}>
                {photo ?
                    <img src={photo} className="chat-photo"/>
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