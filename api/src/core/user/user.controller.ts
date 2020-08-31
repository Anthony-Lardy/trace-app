import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { UserCreation } from './dto/user-creation.dto';
import { UserOutput } from './dto/user-output.dto';
import { UserEdition } from './dto/user-update.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('core/v1/users')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({status: 201, type: UserOutput, description: 'Returns created user.'})
    public async createUser(@Body() userDto: UserCreation): Promise<UserOutput> {
        const user = await this.userService.createUser(userDto);
        return new UserOutput(user);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, type: UserOutput, description: 'Returns user by id.'})
    public async getUserMe(@Context() context: UserSession): Promise<UserOutput> {
        const user = await this.userService.getUser(context.id, context);
        return new UserOutput(user);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, type: UserOutput, description: 'Returns user by id.'})
    public async getUser(@Param('id') id: string, @Context() context: UserSession): Promise<UserOutput> {
        const user = await this.userService.getUser(id, context);
        return new UserOutput(user);
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, type: UserOutput, description: 'Returns updated user.'})
    public async updateUser(@Param('id') id: string, @Body() createUserDto: UserEdition, @Context() context: UserSession): Promise<UserOutput> {
        const user = await this.userService.updateUser(id, createUserDto, context);
        return new UserOutput(user);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, type: UserOutput, description: 'Returns deleted user.'})
    public async deleteUser(@Param('id') id: string, @Context() context: UserSession): Promise<UserOutput> {
        const user = await this.userService.deleteUser(id, context);
        return new UserOutput(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, type: [UserOutput], description: 'Returns users who validate specified filters.'})
    public async listUsers(@Query() query: FilterDto, @Context() context: UserSession): Promise<UserOutput[]> {
        const users = await this.userService.listUsers(query, context);
        return users.map((user) => new UserOutput(user));
    }

}
