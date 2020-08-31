import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { conf } from '@common/config-bucket';
import { UserService } from '@core/user/user.service';
import { UserSession } from '@lib/helper';
import { fromUser } from './authorization.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: conf.JWT_SECRET,
        });
    }

    public async validate(payload: UserSession) {
        const user = await this.userService.getUser(payload.email, payload);
        return fromUser(user);
    }
}