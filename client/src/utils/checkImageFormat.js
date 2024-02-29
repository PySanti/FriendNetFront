/**
 * Recibe una imagen y retorna true en caso de que sea valida, y un mensaje de error en caso de que no
 * @param {File} image
 */
export function checkImageFormat(image){
    const imageFormat = image.type.split('/')[1]
    if (!["jpg","jpeg", "png", "heic"].includes(imageFormat)){
        return "¡ Formato de archivo no soportado !"
    } else {
        if (image.size/1000 > 2000){
            return "¡ El peso de la imagen debe ser inferior a 2MB !"
        } else {
            return true
        }
    }

}