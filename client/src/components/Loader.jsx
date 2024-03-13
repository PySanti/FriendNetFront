import {PropTypes} from "prop-types"
import Lottie from "lottie-react"
import {useEffect, useRef} from "react"
import loading from "../../lottie/loading.json"
import "../styles/Loader.css"

export function Loader({big, loaderActivated}){
    const loaderClassName       = "users-list-loader" 
    let baseClassName           = loaderActivated ? `${loaderClassName} ${loaderClassName+"__activated"}` : loaderClassName
    baseClassName               = big ? baseClassName + " big-loader" : baseClassName
    const loadingAnimationRef   = useRef(null)
    useEffect(()=>{
        if (loadingAnimationRef.current){
            if (loaderActivated){
                loadingAnimationRef.current.setSpeed(2)
                loadingAnimationRef.current.play()
            } else{
                loadingAnimationRef.current.pause()
            }
        }
    }, [loaderActivated])
    useEffect(()=>{
        const loadingRef = loadingAnimationRef.current
        return ()=>{
            loadingRef.pause()
        }
    }, [])
    return (
        <div className={baseClassName}>
            <Lottie 
                loop={true}
                autoPlay={false}
                animationData={loading} 
                lottieRef={loadingAnimationRef}
            />
        </div>
    )
}

Loader.propTypes = {
    loaderActivated : PropTypes.bool.isRequired,
    big : PropTypes.bool,
}

Loader.defaultProps = {
    big : undefined,
}


