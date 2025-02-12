import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksClient from 'jwks-rsa';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private client: any;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        const decoded: any = jwt.decode(rawJwtToken, { complete: true });
        if (!decoded) return done(new Error('Invalid token'), null);

        const kid = decoded.header.kid;
        const jwksUrl = this.configService.get('COGNITO_POOL_URL');

        if (!this.client) {
          this.client = jwksClient({ jwksUri: jwksUrl });
        }

        this.client.getSigningKey(kid, (err, key) => {
          if (err) return done(err, null);
          const signingKey = key.getPublicKey();
          done(null, signingKey);
        });
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
