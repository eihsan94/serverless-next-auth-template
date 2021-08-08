import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"
import AWS from "aws-sdk";

const endpoint = {endpoint: process.env.DATABASE_URL}
console.log(endpoint,{tableName: `${process.env.DATABASE_NAME}`});


AWS.config.update({
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
    region: process.env.NEXT_AUTH_AWS_REGION,
});

const options  = {
    providers: [
        Providers.LINE({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET,
            scope:'profile openid email',
        }),
        Providers.Google({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Providers.Email({
        //     server: {
        //         host: '',
        //         port: '',
        //         auth: {
        //             user: '',
        //             pass: '',
        //         },
        //         form: '',
        //     }
        // })
    ],
    adapter: DynamoDBAdapter(
        new AWS.DynamoDB.DocumentClient(endpoint),
        {tableName: `${process.env.DATABASE_NAME}-user`}
    ),
}

const NextAuthApi = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
export default NextAuthApi