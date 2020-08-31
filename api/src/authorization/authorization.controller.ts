import { Controller, Post, Request, UseFilters, UseGuards, Headers, UseInterceptors, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { LocalAuthGuard } from '@lib/guards';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { AuthService } from './authorization.service';

@ApiTags('auth')
@Controller('auth/v1')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('token')
    public async getToken(@Request() req, @Headers() headers) {
        return this.authService.refreshToken(headers.authorization);
    }

}
