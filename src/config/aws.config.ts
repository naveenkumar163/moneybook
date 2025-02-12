import * as dotenv from 'dotenv';

dotenv.config();

export const AWS_COGNITO_CONFIG = {
  REGION: process.env.AWS_REGION!,
  CLIENT_ID: process.env.COGNITO_CLIENT_ID!,
  USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
};
