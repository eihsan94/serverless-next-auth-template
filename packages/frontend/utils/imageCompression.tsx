import Compressor from 'compressorjs';

const compress = async (file: Blob): Promise<Blob>  => {
  return await new Promise(
    (resolve, reject) =>
      new Compressor(file, {
        quality: 0.8,
        maxHeight: 1024,
        maxWidth: 1024,
        success: resolve,
        error: reject,
      }),
  );
}


const imageCompressionUtil = async(f: Blob) => { // f is event.target.files[0]
    const imageFile = f;
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    try {
      const compressedFile = await compress(imageFile);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      return compressedFile;
    } catch (error) {
      throw new Error(error);
    }
}


export default imageCompressionUtil;