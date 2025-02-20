"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
const aws_sdk_1 = require("aws-sdk");
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const aws_config_1 = require("../config/aws.config");
const NodeCache = __importStar(require("node-cache"));
const user_entity_1 = require("../models/user.entity");
const roles_enum_1 = require("../enum/roles.enum");
const typeorm_1 = require("@nestjs/typeorm"); // ✅ Import this
const typeorm_2 = require("typeorm"); // ✅ Import this
dotenv.config();
const cognito = new aws_sdk_1.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
});
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        // 🔹 Validate JWT Token
        this.jwksCache = new NodeCache({ stdTTL: 3600 }); // Cache JWKS for 1 hour
    }
    // 🔹 User Signup
    signUp(username, email, password, role, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                ClientId: aws_config_1.AWS_COGNITO_CONFIG.CLIENT_ID,
                Username: username,
                Password: password,
                UserAttributes: [{ Name: 'email', Value: email }],
            };
            try {
                const signupResponse = yield cognito.signUp(params).promise();
                yield cognito
                    .adminConfirmSignUp({
                    UserPoolId: aws_config_1.AWS_COGNITO_CONFIG.USER_POOL_ID,
                    Username: username,
                })
                    .promise();
                // Check role assignment rules
                // if (role === Role.ADMIN) {
                //   throw new UnauthorizedException('Cannot create ADMIN via UI');
                // }
                // if (role === Role.MASTER && role !== Role.ADMIN) {
                //   throw new UnauthorizedException('Only an ADMIN can create a MASTER');
                // }
                // if (role === Role.AGENT && role !== Role.MASTER) {
                //   throw new UnauthorizedException('Only a MASTER can create an AGENT');
                // }
                // if (role === Role.CLIENT && !agentId) {
                //   throw new UnauthorizedException('Clients must provide an agent ID');
                // }
                // Check role assignment rules
                if (role === roles_enum_1.Role.ADMIN) {
                    throw new common_1.UnauthorizedException('Cannot create an ADMIN via UI');
                }
                if (role === roles_enum_1.Role.MASTER) {
                    throw new common_1.UnauthorizedException('Only an ADMIN can create a MASTER');
                }
                if (role === roles_enum_1.Role.AGENT) {
                    throw new common_1.UnauthorizedException('Only a MASTER can create an AGENT');
                }
                if (role === roles_enum_1.Role.CLIENT && !agentId) {
                    throw new common_1.UnauthorizedException('Clients must provide an agent ID');
                }
                // Create user in DB
                const newUser = this.userRepository.create({
                    email,
                    password,
                    role,
                    agent: agentId ? { id: agentId } : undefined, // Ensure correct type
                });
                yield this.userRepository.save(newUser);
                return { message: 'User signed up successfully', signupResponse };
            }
            catch (err) {
                throw new common_1.UnauthorizedException(`Signup failed: ${err.message}`);
            }
        });
    }
    // async signUp(username: string, email: string, password: string) {
    //   const params = {
    //     ClientId: AWS_COGNITO_CONFIG.CLIENT_ID,
    //     Username: username,
    //     Password: password,
    //     UserAttributes: [{ Name: 'email', Value: email }],
    //   };
    //   try {
    //     const signupResponse = await cognito.signUp(params).promise();
    //     await cognito
    //       .adminConfirmSignUp({
    //         UserPoolId: AWS_COGNITO_CONFIG.USER_POOL_ID,
    //         Username: username,
    //       })
    //       .promise();
    //     return { message: 'User signed up successfully', signupResponse };
    //   } catch (err) {
    //     if (err.code === 'UsernameExistsException') {
    //       throw new UnauthorizedException('User already exists');
    //     }
    //     throw new UnauthorizedException(`Signup failed: ${err.message}`);
    //   }
    // }
    // 🔹 User Signin (Login)
    signin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: process.env.COGNITO_CLIENT_ID,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                },
            };
            try {
                const authResult = yield cognito.initiateAuth(params).promise();
                return authResult.AuthenticationResult;
            }
            catch (err) {
                throw new common_1.UnauthorizedException(`Login failed: ${err.message}`);
            }
        });
    }
    // async validateToken(token: string): Promise<any> {
    //   try {
    //     const jwksUrl = `https://cognito-idp.${AWS_COGNITO_CONFIG.REGION}.amazonaws.com/${AWS_COGNITO_CONFIG.USER_POOL_ID}/.well-known/jwks.json`;
    //     // ✅ Explicitly cast keys to JWK[] type
    //     let keys = this.jwksCache.get<JWK[]>('jwks');
    //     if (!keys) {
    //       const { data } = await axios.get(jwksUrl);
    //       keys = data.keys as JWK[]; // ✅ Ensure type safety
    //       this.jwksCache.set('jwks', keys);
    //     }
    //     // Decode JWT Header
    //     const decodedHeader = jwt.decode(token, { complete: true });
    //     if (!decodedHeader || !decodedHeader.header) throw new UnauthorizedException('Invalid token');
    //     // ✅ Now TypeScript knows `keys` is an array of JWK objects
    //     const key = keys.find(k => k.kid === decodedHeader.header.kid);
    //     if (!key) throw new UnauthorizedException('Invalid token');
    //     // Convert JWKS to PEM format
    //     const pem = jwkToPem(key);
    //     // Verify and return decoded token
    //     return jwt.verify(token, pem, { algorithms: ['RS256'] });
    //   } catch (error) {
    //     throw new UnauthorizedException('Token verification failed');
    //   }
    // }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jwksUrl = `https://cognito-idp.${aws_config_1.AWS_COGNITO_CONFIG.REGION}.amazonaws.com/${aws_config_1.AWS_COGNITO_CONFIG.USER_POOL_ID}/.well-known/jwks.json`;
                // Get cached keys or fetch from URL
                let keys = this.jwksCache.get('jwks');
                if (!keys) {
                    const { data } = yield axios_1.default.get(jwksUrl);
                    keys = data.keys;
                    this.jwksCache.set('jwks', keys);
                }
                // Decode JWT Header
                const decodedHeader = jwt.decode(token, { complete: true });
                if (!decodedHeader || !decodedHeader.header) {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
                // Find the matching key
                const key = keys.find((k) => k.kid === decodedHeader.header.kid);
                if (!key) {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
                // ✅ Define `pem` before using it
                const pem = (0, jwk_to_pem_1.default)(key);
                // Verify and return decoded token
                return jwt.verify(token, pem, { algorithms: ['RS256'] });
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Token verification failed');
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
