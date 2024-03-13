import {compressImage} from "../utils/compressImage"

export async function handleImageCompressing(image){
    if (image && typeof image !== "string"){
        try {
            return await compressImage(image)
        } catch (error){
            return 1
        }
    }
    return image
}