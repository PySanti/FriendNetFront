import "../styles/BigUserPhotoStyles.css"
export function BigUserPhoto({photo}){
    return (
        <div className="big-user-photo-container">
            <img  className="big-user-photo"  src={photo}/>
        </div>
    )
}