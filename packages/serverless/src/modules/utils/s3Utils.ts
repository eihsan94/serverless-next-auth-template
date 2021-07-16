import { S3, Endpoint } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

const endpointUrl =  process.env.STAGE === 'local' ? `http://localhost:4569/${process.env.BUCKET_NAME}` : process.env.BUCKET_URL
const params = process.env.STAGE === 'local' ? {
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER', // This specific key is required when working offline
  secretAccessKey: 'S3RVER',
  endpoint: new Endpoint('http://localhost:4569'),
} : {}
const s3Bucket = new S3(params);



const putBase64ToS3 = async(imageBinary: string, key: string): Promise<string> => {
    const buf = Buffer.from(imageBinary.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const data: PutObjectRequest = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    return new Promise((resolve, reject) => {
      s3Bucket.putObject(data, (err, res) => {
        if (err) {
          console.log(err);
          reject(err)
        } else {
          resolve(`${endpointUrl}/${key}`)
        }
      })
    })
}


const deleteS3Object = async(objectUrl: string): Promise<string> => {
    const key = objectUrl.replace(`${endpointUrl}/`, '')
    const data: PutObjectRequest = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };
    return new Promise((resolve, reject) => {
      s3Bucket.deleteObject(data, (err, res) => {
        if (err) {
          console.log(err);
          reject(err)
        } else {
          resolve(key)
        }
      })
    })
}


export {
  putBase64ToS3,
  deleteS3Object,
}