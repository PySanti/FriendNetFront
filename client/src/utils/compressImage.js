import Compressor from "compressorjs"

export async function compressImage(image){
    return await new Promise((resolve, reject) => {
        new Compressor(image, {
        quality: 0.6, 
        maxWidth: 800,  
        maxHeight: 800,
        mimeType: "image/jpeg", // Specify the output image format
        success(result) {
            resolve(result);
        },
        error(error) {
            reject(error);
        },
        });
    });
}