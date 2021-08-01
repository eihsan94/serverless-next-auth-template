import { APIGatewayProxyHandler } from "aws-lambda";
import morgan from 'morgan'
import express from 'express'
import ServerlessHttp from 'serverless-http'
import cors from 'cors'
import userRoutes from "./modules/routes/userRoutes";

const app = express();

app.use(cors())
if (process.env.STAGE === 'dev' || process.env.STAGE === 'local') {
  app.use(morgan('dev'))
}

app.use(express.json());

app.use('/api/users', userRoutes)



app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const server: APIGatewayProxyHandler = ServerlessHttp(app) as APIGatewayProxyHandler;