import { Request } from 'express';
import { User } from '../models/user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
