import {toast} from "sonner"
import { useState,useRef, useEffect } from "react";
import "../styles/UserPhotoInput.css";
import { Button } from "./Button";
import { PropTypes } from "prop-types";
import { checkImageFormat } from "../utils/checkImageFormat";
import {Loader} from "./Loader"
import { MdOutlineNoPhotography } from "react-icons/md";
import {Modal} from "./Modal"
import {ModalBackButton} from "./ModalBackButton"
import {BigUserPhoto} from "../components/BigUserPhoto.jsx"

/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro.
 * Diseniado para trabajar con states dentro de un formulario
 */
export function UserPhotoInput({photoFile,photoFileSetter}) {
    let [userPhotoLoaded, setUserPhotoLoaded]       = useState(true);
    let [modalOpened, setModalOpened]               = useState(false)
    let [currentPhotoName, setCurrentPhotoName]     = useState(null);
    const userPhotoRef                              = useRef(null)
    const imgInputRef                                 = useRef(null)
    const getCurrentPhoto = ()=>currentPhotoName? currentPhotoName: photoFile? photoFile: null
    const handleChangePhotoClick = ()=>{
        imgInputRef.current.click()
    }
    const handleImgClick = ()=>{
        if (photoFile && userPhotoLoaded){
            setModalOpened(!modalOpened)
        }
    }
    const deleteCurrentPhoto = () => {
        photoFileSetter(null);
        setModalOpened(false)
        setCurrentPhotoName(null);
    };
    const onPhotoChange = (e) => {
        const file = e.target.files[0];
        const imageCheckerResponse = checkImageFormat(file);
        if (imageCheckerResponse === true) {
            const reader = new FileReader();
            reader.onerror = ()=>{
                toast.error("Error al cargar la imagen")
            }
            reader.onload  =  ()=> {
                handleImgClick()
                setCurrentPhotoName(reader.result);
                photoFileSetter(file);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error(imageCheckerResponse)
        }
    };
    useEffect(()=>{
        if (!currentPhotoName && photoFile){
            // recordar que si el photoFile no es null y currentPhotoName es null, indica que la imagen se esta renderizando a partir de un link
            // En cambio, si el currentPhotoName no es null, indica que la imagen se esta cargando desde la PC local, en tal caso no tiene sentido activar el loader por que la imagen ya esta cargada
            if (!userPhotoRef.current.complete){
                setUserPhotoLoaded(false)
                userPhotoRef.current.addEventListener("load", ()=>{
                    setUserPhotoLoaded(true)
                })
            }
        } else{
            setUserPhotoLoaded(true)
        }
    }, [currentPhotoName, photoFile])
    return (
        <div className="user-photo-main-container">
            <div className="user-photo-container" >
                { photoFile ? 
                    <>
                        <img onClick={handleImgClick }className={(userPhotoLoaded || !photoFile? "user-photo user-photo__activated" : "user-photo")}src= {getCurrentPhoto()}ref={userPhotoRef }/>
                        {(!userPhotoLoaded) &&
                            <div className="loading-animation-container">
                                <Loader superbig loaderActivated={!userPhotoLoaded}/>
                            </div>
                        }
                        <Modal opened={modalOpened}>
                            <ModalBackButton onClick={()=>setModalOpened(false)}/>
                            <div className="modal-photo-container">
                                <BigUserPhoto photo={getCurrentPhoto()}/>
                                <div className="user-photo-buttons-container">
                                    <Button buttonText="Cambiar" onClickFunction={handleChangePhotoClick}/>
                                    <Button buttonText="Borrar" onClickFunction={deleteCurrentPhoto} />
                                </div>
                            </div>
                        </Modal>
                    </>
                    :
                    <span id="no-photo-icon" className="user-photo" onClick={handleChangePhotoClick}>
                        <MdOutlineNoPhotography />
                    </span>
                }
            </div>
            <div className="user-photo-input-container">
                <input ref={imgInputRef} className="user-photo-input" type="file" onChange={onPhotoChange}/>
            </div>
        </div>
    );
}

UserPhotoInput.propTypes = {
    photoFile: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    photoFileSetter: PropTypes.func,
};

