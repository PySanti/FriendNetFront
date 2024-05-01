import "../styles/Modal.css"
import {useEffect, useRef} from 'react'

export function Modal({children, opened}){
    const modalContainerRef = useRef(null)
    const modalContainerCls = "modal-container"
    useEffect(()=>{
        setTimeout(()=>{
            modalContainerRef.current.style.opacity = modalContainerRef.current.classList.contains(`${modalContainerCls}__activated`)? "1" : "0"
        }, 0)
    }, [opened])
    return (
        <div className={opened ? `${modalContainerCls} ${modalContainerCls}__activated` : modalContainerCls} ref={modalContainerRef}>
            {children}
        </div>
    )
}