// 'use strict'

// import * as uuid from 'uuid'
// import { DynamoDB } from 'aws-sdk'
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import res from '../utils/resUtil'
// import {deleteS3Object, putBase64ToS3} from '../utils/s3Utils'
// import { isBase64 } from '../utils/imageHandlerUtil'
// import {User} from '@libTypes/types'

// const endpoint = process.env.STAGE === 'local' ? {endpoint: 'http://localhost:8000'} : {}
// const dynamoDb = new DynamoDB.DocumentClient(endpoint)
// const partitionKeyPrefix = 'users'

// const listUsersHandler = async(): Promise<APIGatewayProxyResult> => {
//   let result;
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     FilterExpression: 'contains(partition_key,:key)',
//     ExpressionAttributeValues: {
//       ':key': partitionKeyPrefix,
//     },
//   };
//   try {
//     result = await dynamoDb.scan(params).promise();
//   } catch(err) {
//     return res(500, {error: err})
//   }
//   return res(200, result.Items)
// };
// const getUsersHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   let result;
//   const {id}  = event.pathParameters;
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       partition_key: id,
//     }
//   }
//   try {
//     result = await dynamoDb.get(params).promise();
//     if (!result.Item) {
//       return res(500, {error: 'データが見つかりません'})
//     }
//   } catch(err) {
//     return res(500, {error: err})
//   }
//   return res(200, result.Item)
// }
// const createUsersHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const timestamp = new Date().getTime()
//   const {
//     role_partition_key,
//     shop_partition_keys,
//     email,
//     password,
//     name,
//     image,
//     birthday,
//     ihsanPoint,
//    }: User = JSON.parse(event.body)
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Item: {
//       partition_key: `${uuid.v4()}-${partitionKeyPrefix}`,
//       role_partition_key,
//       shop_partition_keys,
//       email,
//       password,
//       name,
//       image,
//       birthday,
//       ihsanPoint,
//       createdAt: timestamp,
//       updatedAt: timestamp
//     }
//   }
//   try {
//     await dynamoDb.put(params).promise()
//   } catch(err) {
//     console.log(err);
//     return res(500, {error: err})
//   }
//   return res(201, params.Item)
// }
// const updateUsersHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const {id}  = event.pathParameters;
//     const {
//       role_partition_key,
//       shop_partition_keys,
//       email,
//       password,
//       name,
//       image,
//       birthday,
//       ihsanPoint,
//      }: User = JSON.parse(event.body)
//     let imageUrl
//     if (isBase64(image)) {
//       try {
//         imageUrl = await putBase64ToS3(image, `image/${uuid.v4()}`)
//       } catch (error) {
//         res(500, {error})
//       }
//     }
//     let updatedPosts;
//     if (posts) {
//       updatedPosts = await Promise.all(posts.map(async p => ({...p, image: isBase64(p.image)? await putBase64ToS3(p.image, `postImage/${uuid.v4()}`) : p.image})))
//     }
//     const updatedAttributes = [];
//     const expressionAttributeValues = {};
//     [
//       {key: 'title', val: title}, 
//       {key: 'description', val: description}, 
//       {key: 'posts', val: updatedPosts},
//       {key: 'isPublished', val: isPublished, alwaysUpdate: true},
//       {key: 'image', val: imageUrl || image},
//       {key: 'fontColor', val: fontColor},
//       {key: 'bgColor', val: bgColor},
//     ].map(attr => {
//       if (attr.val || attr.alwaysUpdate) {
//         updatedAttributes.push(`${attr.key} = :${attr.key}`);
//         expressionAttributeValues[`:${attr.key}`] = attr.val;
//       }
//     })
//     updatedAttributes.push(`updated = :updated`);
//     expressionAttributeValues[':updated'] = new Date().toISOString();
//     const updateExpression = `set ${updatedAttributes.join(', ')}`;
//     const params = {
//       TableName: process.env.DYNAMODB_TABLE,
//       Key: { partition_key: id },
//       UpdateExpression: updateExpression,
//       ExpressionAttributeValues: expressionAttributeValues,
//       ReturnValues: 'ALL_NEW',
//     };
//     let updatedData;
//     try {
//       const oldData = (await dynamoDb.get(params).promise()).Item;
//       if (oldData.image && imageUrl) {
//         console.log(`DELETING OLD HERO IMAGE 🗑🚛`);
//         await deleteS3Object(oldData.image)
//       }
//       const result = await dynamoDb.update(params).promise()
//       updatedData = result.Attributes;
//     } catch (err) {
//       return res(500, {error: err})
//     }
//     return res(200, updatedData)
// }

// const deleteUsersHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   let result;
//   const {id}  = event.pathParameters;
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       partition_key: id,
//     }
//   }
//   try {
//     result = (await dynamoDb.get(params).promise()).Item;
//     if (!result) {
//       return res(500, {error: 'すでに削除しました！'})
//     } else if(result.heroImage){
//       await deleteS3Object(result.heroImage)
//     }
//     if (result.posts) {
//       await Promise.all(result.posts.map(async (p:Post) => {
//         if (p.image) {
//           await deleteS3Object(p.image)
//         }
//       }))
//     }
//     await dynamoDb.delete(params).promise();
//   } catch(err) {
//     return res(500, {error: err})
//   }
//   return res(201, {message: '正常に削除できました🚮'})
// }

// export {
//   listUsersHandler,
//   getUsersHandler,
//   createUsersHandler,
//   updateUsersHandler,
//   deleteUsersHandler,
// };