import imageCompressionUtil from "./imageCompression";

const encodeToBase64 = async(file: Blob): Promise<string> => {
    const cF = await imageCompressionUtil(file)
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.addEventListener('load', () => {
            if (reader.result) {
                resolve(reader.result.toString());
            }
        });
        // consider adding an error handler that calls reject
        reader.readAsDataURL(cF);
        reader.onerror = function(e: any) {
            reject(e);
        };
    });
}

export default encodeToBase64;