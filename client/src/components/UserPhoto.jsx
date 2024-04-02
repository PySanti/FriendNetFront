import {toast} from "sonner"
import { useState,useRef, useEffect } from "react";
import "../styles/UserPhoto.css";
import { Button } from "./Button";
import { PropTypes } from "prop-types";
import { checkImageFormat } from "../utils/checkImageFormat";
import {Loader} from "./Loader"
import { MdOutlineNoPhotography } from "react-icons/md";

/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro.
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
export function UserPhoto({photoFile,withInput,chatPhoto,photoFileSetter}) {
    let modalContainerRef                           = useRef(null)
    let [userPhotoLoaded, setUserPhotoLoaded]       = useState(false);
    let [currentPhotoName, setCurrentPhotoName]     = useState(null);
    const userPhotoRef                              = useRef(null)
    const imgInputRef                                 = useRef(null)
    const containerClsName                          = "user-photo-main-container";
    const modalContainerCls                         = "modal-container"
    const handleChangePhotoClick = ()=>{
        imgInputRef.current.click()
    }
    const handleImgClick = ()=>{
        if (photoFile && userPhotoLoaded){
            modalContainerRef.current.classList.toggle(`${modalContainerCls}__activated`)
            setTimeout(() => {
                modalContainerRef.current.style.opacity = modalContainerRef.current.classList.contains(`${modalContainerCls}__activated`)? "1" : "0"
            }, 0);
        }
    }
    const imgProps = (type) => {
        return {
            onClick: handleImgClick,
            className: type === "small" ? (userPhotoLoaded || !photoFile? "user-photo user-photo__activated" : "user-photo") : `big-user-photo`,
            src: currentPhotoName? currentPhotoName: photoFile? photoFile: null,
            ref : type=="small"? userPhotoRef : null
        };
    };
    const deleteCurrentPhoto = () => {
        photoFileSetter(null);
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
            setUserPhotoLoaded(false)
            userPhotoRef.current.addEventListener("load", ()=>{
                setUserPhotoLoaded(true)
            })
        } else{
            setUserPhotoLoaded(true)
        }
    }, [currentPhotoName, photoFile])
    return (
        <div className={    chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            <div className="user-photo-container" >
                { photoFile ? 
                    <>
                        <img {...imgProps("small")}/>
                        {(!userPhotoLoaded && photoFile) &&
                            <div className="loading-animation-container">
                                {
                                    chatPhoto ? <Loader big loaderActivated={!userPhotoLoaded}/> : <Loader superbig loaderActivated={!userPhotoLoaded}/>
                                }
                            </div>
                        }
                        <div className={modalContainerCls} ref={modalContainerRef}>
                            <img {...imgProps("big")}/>
                            {
                                !chatPhoto && 
                                <div className="user-photo-buttons-container">
                                    <Button buttonText="Cambiar" onClickFunction={handleChangePhotoClick}/>
                                    <Button buttonText="Borrar" onClickFunction={deleteCurrentPhoto} />
                                </div>
                            }
                        </div>
                    </>
                    :
                    <span id="no-photo-icon" className="icon user-photo" onClick={!chatPhoto ? handleChangePhotoClick : undefined}>
                        <MdOutlineNoPhotography />
                    </span>
                }
            </div>
            {withInput && (
                <>
                    <div className="user-photo-input-container">
                        <input ref={imgInputRef} className="user-photo-input" type="file" onChange={onPhotoChange}/>
                    </div>
                </>
            )}
        </div>
    );
}

UserPhoto.propTypes = {
    photoFile: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    withInput: PropTypes.bool,
    photoFileSetter: PropTypes.func,
    chatPhoto: PropTypes.bool,
};

UserPhoto.defaultProps = {
    photoFile: undefined,
    withInput: undefined,
    photoFileSetter: undefined,
    chatPhoto: undefined,
};
