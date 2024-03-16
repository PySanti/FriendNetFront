import {compressImage} from "../utils/compressImage"

export async function handleImageCompressing(image){
    if (image && typeof image !== "string"){
        try {
            const compressed = await compressImage(image)
            if (compressed.size/1000 > 2000){
                return 1
            } else {
                return compressed
            }
        } catch (error){
            return 1
        }
    }
    return image
}