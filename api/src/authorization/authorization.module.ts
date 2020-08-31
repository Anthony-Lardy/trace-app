import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@core/user/user.module';
import { AuthService } from './authorization.service';

import { conf } from '@common/config-bucket';
import { AuthController } from './authorization.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
      UserModule,
      PassportModule,
      JwtModule.register({
        secret: conf.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
