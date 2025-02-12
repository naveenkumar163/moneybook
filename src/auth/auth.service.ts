import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import {AWS_COGNITO_CONFIG} from '../config/aws.config'
import * as NodeCache from 'node-cache';

interface JWK {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

dotenv.config();

const cognito = new CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

@Injectable()
export class AuthService {
  
  // 🔹 User Signup
  async signUp(username: string, email: string, password: string) {
    const params = {
      ClientId: AWS_COGNITO_CONFIG.CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    };
  
    try {
      const signupResponse = await cognito.signUp(params).promise();
  
      await cognito
        .adminConfirmSignUp({
          UserPoolId: AWS_COGNITO_CONFIG.USER_POOL_ID,
          Username: username,
        })
        .promise();
  
      return { message: 'User signed up successfully', signupResponse };
    } catch (err) {
      if (err.code === 'UsernameExistsException') {
        throw new UnauthorizedException('User already exists');
      }
      throw new UnauthorizedException(`Signup failed: ${err.message}`);
    }
  }
  

  // 🔹 User Signin (Login)
  async signin(email: string, password: string) {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const authResult = await cognito.initiateAuth(params).promise();
      return authResult.AuthenticationResult;
    } catch (err) {
      throw new UnauthorizedException(`Login failed: ${err.message}`);
    }
  }

  // 🔹 Validate JWT Token
  private readonly jwksCache = new NodeCache({ stdTTL: 3600 }); // Cache JWKS for 1 hour

  async validateToken(token: string): Promise<any> {
    try {
      const jwksUrl = `https://cognito-idp.${AWS_COGNITO_CONFIG.REGION}.amazonaws.com/${AWS_COGNITO_CONFIG.USER_POOL_ID}/.well-known/jwks.json`;

      // ✅ Explicitly cast keys to JWK[] type
      let keys = this.jwksCache.get<JWK[]>('jwks');
      if (!keys) {
        const { data } = await axios.get(jwksUrl);
        keys = data.keys as JWK[]; // ✅ Ensure type safety
        this.jwksCache.set('jwks', keys);
      }

      // Decode JWT Header
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header) throw new UnauthorizedException('Invalid token');

      // ✅ Now TypeScript knows `keys` is an array of JWK objects
      const key = keys.find(k => k.kid === decodedHeader.header.kid);
      if (!key) throw new UnauthorizedException('Invalid token');

      // Convert JWKS to PEM format
      const pem = jwkToPem(key);

      // Verify and return decoded token
      return jwt.verify(token, pem, { algorithms: ['RS256'] });
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
