import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@core/user/user.service';
import { UserSession } from '@lib/helper';
import { fromUser } from './authorization.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async validateUser(email: string, password: string): Promise<UserSession | null> {
        const user = await this.userService.getUserAuthentification(email);
        if (user && user.password === password) {
            return fromUser(user);
        }
        return null;
    }

    public async login(auth: UserSession) {
        
        if(!auth) {
            throw new UnauthorizedException('User not found');
        }
        
        const payload = { ...auth, sub: auth.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    public async refreshToken(token: string) {
        const { iat, sub, exp, ...userSession} = this.jwtService.decode(token.replace('Bearer ', '')) as {
            id: string;
            iat: number;
            exp: number;
            sub: string;
        };

        if(!userSession) {
            throw new UnauthorizedException('Token is not valid');
        }

        return {
            access_token: this.jwtService.sign(userSession),
        }

    }

}
