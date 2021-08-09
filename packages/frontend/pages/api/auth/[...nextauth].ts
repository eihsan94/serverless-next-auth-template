import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import AWS from "aws-sdk";
import axios from "axios";
import { login, postSingle } from "@utils/crudUtil";
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

const endpoint = { endpoint: process.env.DATABASE_URL };

AWS.config.update({
  accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY,
  region: process.env.NEXT_AUTH_AWS_REGION,
});

const options = {
  providers: [
    // launch this after we have time
    // https://next-auth.js.org/providers/credentials
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await login(credentials);
        if (user.email) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null or false then the credentials will be rejected
          // throw new Error(user.error) // Redirect to error page
          // You can also Reject this callback with an Error or with a URL:
          throw `/auth?error=${(user.data as any).error}`; // Redirect to a URL
        }
      },
    }),
    Providers.LINE({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      scope: "profile openid email",
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // CONFIG NEXT AUTH WITH DYNAMODB
  adapter: DynamoDBAdapter(new AWS.DynamoDB.DocumentClient(endpoint), {
    tableName: `${process.env.DATABASE_NAME}-user`,
  }),
  // THIS NEED TO BE ENABLED FOR MAKING THE SESSION TO WORK WITH JWT
  session: {
    jwt: true,
  },
};

const NextAuthApi = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
export default NextAuthApi;
