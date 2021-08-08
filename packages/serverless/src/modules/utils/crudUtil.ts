import { DynamoDB } from 'aws-sdk'
const endpoint = process.env.STAGE === 'local' ? {endpoint: 'http://localhost:8000'} : {}
const dynamoDb = new DynamoDB.DocumentClient(endpoint)

export type CrudResponse = {json: any, status: number}
export const getAll = async(attr: string ,val: string | number, tablePrefix?: string): Promise<CrudResponse> => {
  const params = {
      TableName: `${process.env.DYNAMODB_TABLE}${tablePrefix}`,
      FilterExpression: `contains(${attr},:key)`,
      ExpressionAttributeValues: {
        ':key': val,
      },
  };  
  let res = {json: {}, status: 200};
  try {
      res.json = (await dynamoDb.scan(params).promise()).Items;
    } catch(err) {
      res = {json: {error: err}, status: 500}
  }  
  return res
}

export const getSingle = async(id: string | number, tablePrefix?: string): Promise<CrudResponse> => {
  const params = {
      TableName: `${process.env.DYNAMODB_TABLE}${tablePrefix}`,
      Key: {
        pk: id,
      }
  };
  console.log(params);
  
  let res = {json: {}, status: 200};
  try {
      res.json = (await dynamoDb.get(params).promise()).Item;
    } catch(err) {
      res = {json: {error: err}, status: 500}
  }  
  return res
}


export const postSingle = async(Item: any, tablePrefix?: string): Promise<CrudResponse> => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}${tablePrefix}`,
    Item,
  }
  let res = {json: {}, status: 201};

  try {
    await dynamoDb.put(params).promise();
    res.json = Item;
  } catch(err) {
    res = {json: {error: err}, status: 500}
  }
  return res;
}

export const putSingle = async(id: string, keyValArr: {key: string, val: any, alwaysUpdate?: boolean}[], tablePrefix?: string): Promise<CrudResponse> => {
  const updatedAttributes = [];
  const expressionAttributeValues: any = {};
  
  keyValArr.map(attr => {
    if (attr.val || attr.alwaysUpdate) {
      updatedAttributes.push(`${attr.key} = :${attr.key}`);
      expressionAttributeValues[`:${attr.key}`] = attr.val;
    }
  })
  
  updatedAttributes.push(`updated = :updated`);
  expressionAttributeValues[':updated'] = new Date().toISOString();
  const updateExpression = `set ${updatedAttributes.join(', ')}`;
  
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}${tablePrefix}`,
    Key: { pk: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };
  
  let res = {json: {}, status: 201};
  
  try {
    const {Attributes} = await dynamoDb.update(params).promise()
    res.json = Attributes;
  } catch(err) {
    res = {json: {error: err}, status: 500}
  }
  return res;
}

export const deleteSingle = async(id: string, tablePrefix?: string): Promise<CrudResponse> => {
  let result;
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}${tablePrefix}`,
    Key: {
      pk: id,
    }
  }

  let res = {json: {}, status: 201};

  try {
    result = (await dynamoDb.get(params).promise()).Item;
    if (!result) {
      return res = {json: {error: 'すでに削除しました！'}, status: 500}
    }
    await dynamoDb.delete(params).promise();
    res.json =  {message: '正常に削除できました🚮'}
  } catch(err) {
    res = {json: {error: err}, status: 500}
  }
  return res;
}

// this request needs to make like this because it uses reserved attributes name
export const getAllUser = async(type: 'ACCOUNT' | 'SESSION' | 'USER' | ''): Promise<CrudResponse> => {
  const params = {
      TableName: `${process.env.DYNAMODB_TABLE}-user`,
      FilterExpression: `contains(#user_type,:key)`,
      ExpressionAttributeValues: {
        ':key': type,
      },
      ExpressionAttributeNames: {
        "#user_type": "type" // type is reserved name so we use #user_type as a temp subs for making a filter expression
      },
  };  
  console.log(params);
  
  let res = {json: {}, status: 200};
  try {
      res.json = (await dynamoDb.scan(params).promise()).Items;
    } catch(err) {
      res = {json: {error: err}, status: 500}
  }  
  return res
}