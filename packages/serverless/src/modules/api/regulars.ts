'use strict'

import * as uuid from 'uuid'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Regular } from '../@types/regular'
import res from '../utils/resUtil'
import {deleteS3Object, putBase64ToS3} from '../utils/s3Utils'
import { isBase64 } from '../utils/imageHandlerUtil'
import { Post } from '../@types/post'


const endpoint = process.env.STAGE === 'local' ? {endpoint: 'http://localhost:8000'} : {}
const dynamoDb = new DynamoDB.DocumentClient(endpoint)
const partitionKeyPrefix = 'regulars'

const listRegularsHandler = async(): Promise<APIGatewayProxyResult> => {
  let result;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: 'contains(partition_key,:key)',
    ExpressionAttributeValues: {
      ':key': partitionKeyPrefix,
    },
  };
  try {
    result = await dynamoDb.scan(params).promise();
  } catch(err) {
    return res(500, {error: err})
  }
  return res(200, result.Items)
};
const getRegularsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let result;
  const {id}  = event.pathParameters;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      partition_key: id,
    }
  }
  try {
    result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return res(500, {error: 'データが見つかりません'})
    }
  } catch(err) {
    return res(500, {error: err})
  }
  return res(200, result.Item)
}
const createRegularsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const timestamp = new Date().getTime()
  const {title, description, posts, heroImage, topImage }: Regular = JSON.parse(event.body)
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      partition_key: `${uuid.v4()}-${partitionKeyPrefix}`,
      title,
      description,
      heroImage,
      topImage,
      posts,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }
  try {
    await dynamoDb.put(params).promise()
  } catch(err) {
    return res(500, {error: err})
  }
  return res(201, params.Item)
}
const updateRegularsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {id}  = event.pathParameters;
    const {title, description, posts, isPublished, heroImage, topImage }: Regular = JSON.parse(event.body)
    let [heroImageUrl, topImageUrl] = ['', '']
    const regularsImages = [{type: 'hero', val: heroImage}, {type: 'top', val: topImage}]
    await Promise.all(
      regularsImages.map(async rImg => {
        if (isBase64(rImg.val)) {
          try {
            if (rImg.type === 'hero') {
             heroImageUrl = await putBase64ToS3(rImg.val, `heroImage/${id}`) 
            } else if (rImg.type === 'top') {
              topImageUrl = await putBase64ToS3(rImg.val, `topImage/${id}`) 
            }
          } catch (error) {
            res(500, {error})
          }
        }
      })
    )
    
    let updatedPosts;
    if (posts) {
      updatedPosts = await Promise.all(
        posts.map(async p => {
          let image = p.image;
          if (isBase64(p.image)) {
            image = await putBase64ToS3(p.image, `postImage/${uuid.v4()}`)
          }
          return {
            ...p, 
            image,
          }
        })
      )
    }
    
    const updatedAttributes = [];
    const expressionAttributeValues = {};
    [
      {key: 'title', val: title}, 
      {key: 'description', val: description}, 
      {key: 'posts', val: updatedPosts},
      {key: 'isPublished', val: isPublished, alwaysUpdate: true},
      {key: 'heroImage', val: heroImageUrl || heroImage},
      {key: 'topImage', val: topImageUrl || topImage},
    ].map(attr => {
      if (attr.val || attr.alwaysUpdate) {
        updatedAttributes.push(`${attr.key} = :${attr.key}`);
        expressionAttributeValues[`:${attr.key}`] = attr.val;
      }
    })
    updatedAttributes.push(`updated = :updated`);
    expressionAttributeValues[':updated'] = new Date().toISOString();
    const updateExpression = `set ${updatedAttributes.join(', ')}`;
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { partition_key: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };
    let updatedData;
    try {
      const result = await dynamoDb.update(params).promise()
      updatedData = result.Attributes;
    } catch (err) {
      return res(500, {error: err})
    }
    return res(200, updatedData)
}

const deleteRegularsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let result;
  const {id}  = event.pathParameters;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      partition_key: id,
    }
  }
  try {
    result = (await dynamoDb.get(params).promise()).Item;
    if (!result) {
      return res(500, {error: 'すでに削除しました！'})
    } else {
      if(result.heroImage){
        await deleteS3Object(result.heroImage)
      }
      if(result.topImage){
        await deleteS3Object(result.heroImage)
      }
      if (result.posts) {
        await Promise.all(result.posts.map(async (p:Post) => {
          if (p.image) {
            await deleteS3Object(p.image)
          }
        }))
      }
    }
    
    await dynamoDb.delete(params).promise();
  } catch(err) {
    return res(500, {error: err})
  }
  return res(201, {message: '正常に削除できました🚮'})
}

export {
  listRegularsHandler,
  getRegularsHandler,
  createRegularsHandler,
  updateRegularsHandler,
  deleteRegularsHandler,
};