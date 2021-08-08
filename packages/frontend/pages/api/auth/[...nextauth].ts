import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"
import AWS from "aws-sdk";

const endpoint = {endpoint: process.env.DATABASE_URL}


AWS.config.update({
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
    region: process.env.NEXT_AUTH_AWS_REGION,
});

const options  = {
    providers: [
        // launch this after we have time
        // https://next-auth.js.org/providers/credentials
        // Providers.Credentials({
        //     // The name to display on the sign in form (e.g. 'Sign in with...')
        //     name: 'Credentials',
        //     // The credentials is used to generate a suitable form on the sign in page.
        //     // You can specify whatever fields you are expecting to be submitted.
        //     // e.g. domain, username, password, 2FA token, etc.
        //     credentials: {
        //       username: { label: "Username", type: "text", placeholder: "jsmith" },
        //       password: {  label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //       // Add logic here to look up the user from the credentials supplied
        //       const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        
        //       if (user) {
        //         // Any object returned will be saved in `user` property of the JWT
        //         return user
        //       } else {
        //         // If you return null or false then the credentials will be rejected
        //         return null
        //         // You can also Reject this callback with an Error or with a URL:
        //         // throw new Error('error message') // Redirect to error page
        //         // throw '/path/to/redirect'        // Redirect to a URL
        //       }
        //     }
        //   }),
        Providers.LINE({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET,
            scope:'profile openid email',
        }),
        Providers.Google({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: DynamoDBAdapter(
        new AWS.DynamoDB.DocumentClient(endpoint),
        {tableName: `${process.env.DATABASE_NAME}-user`}
    ),
}

const NextAuthApi = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
export default NextAuthApi