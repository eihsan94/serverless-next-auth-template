'use strict'

import * as uuid from 'uuid'
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Special } from '../@types/special'
import res from '../utils/resUtil'
import {deleteS3Object, putBase64ToS3} from '../utils/s3Utils'
import { isBase64 } from '../utils/imageHandlerUtil'
import { Post } from '../@types/post'


const endpoint = process.env.STAGE === 'local' ? {endpoint: 'http://localhost:8000'} : {}
const dynamoDb = new DynamoDB.DocumentClient(endpoint)
const partitionKeyPrefix = 'specials'

const listSpecialsHandler = async(): Promise<APIGatewayProxyResult> => {
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
const getSpecialsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
const createSpecialsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const timestamp = new Date().getTime()
  const {title, description, posts, heroImage }: Special = JSON.parse(event.body)
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      partition_key: `${uuid.v4()}-${partitionKeyPrefix}`,
      title,
      description,
      heroImage,
      posts,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }
  try {
    await dynamoDb.put(params).promise()
  } catch(err) {
    console.log(err);
    return res(500, {error: err})
  }
  return res(201, params.Item)
}
const updateSpecialsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {id}  = event.pathParameters;
    const {title, description, posts, isPublished, heroImage }: Special = JSON.parse(event.body)
    let heroImageUrl
    if (isBase64(heroImage)) {
      try {
        heroImageUrl = await putBase64ToS3(heroImage, `heroImage/${id}`)
      } catch (error) {
        res(500, {error})
      }
    }
    let updatedPosts;
    if (posts) {
      updatedPosts = await Promise.all(posts.map(async p => ({...p, image: isBase64(p.image)? await putBase64ToS3(p.image, `postImage/${uuid.v4()}`) : p.image})))
    }
    const updatedAttributes = [];
    const expressionAttributeValues = {};
    [
      {key: 'title', val: title}, 
      {key: 'description', val: description}, 
      {key: 'posts', val: updatedPosts},
      {key: 'isPublished', val: isPublished, alwaysUpdate: true},
      {key: 'heroImage', val: heroImageUrl || heroImage},
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

const deleteSpecialsHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    } else if(result.heroImage){
      await deleteS3Object(result.heroImage)
    }
    if (result.posts) {
      await Promise.all(result.posts.map(async (p:Post) => {
        if (p.image) {
          await deleteS3Object(p.image)
        }
      }))
    }
    await dynamoDb.delete(params).promise();
  } catch(err) {
    return res(500, {error: err})
  }
  return res(201, {message: '正常に削除できました🚮'})
}

export {
  listSpecialsHandler,
  getSpecialsHandler,
  createSpecialsHandler,
  updateSpecialsHandler,
  deleteSpecialsHandler,
};