import Compressor from "compressorjs"

export async function compressImage(image){
    return await new Promise((resolve, reject) => {
        new Compressor(image, {
        quality: .5, 
        maxWidth: 800,  
        maxHeight: 800,
        mimeType: "image/jpeg",
        success(result) {
            resolve(result);
        },
        error(error) {
            reject(error);
        },
        });
    });
}