import Compressor from "compressorjs"

export async function compressImage(image){
    return await new Promise((resolve, reject) => {
        new Compressor(image, {
        quality: 0.6, 
        maxWidth: 500,  
        maxHeight: 500,
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