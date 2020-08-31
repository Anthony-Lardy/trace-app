import { ClassSerializerInterceptor, Controller, Get, Param, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { StatService } from './stat.service';
import { StatOuptut } from './dto/stat-output.dto';
import { Stat } from './stat.interface';

@ApiBearerAuth()
@ApiTags('stats')
@Controller('core/v1/stats')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class StatController {
    constructor(private readonly statService: StatService) {}

    @Get('/courses/:id')
    @ApiResponse({status: 200, type: StatOuptut, description: 'Returns stats who validate specified filters.'})
    public async listStatsByCourse(@Param('id') id: string, @Context() context: UserSession): Promise<Stat> {
        return await this.statService.listStatsByCourse(id, context);
    }

    @Get('/groups/:id')
    @ApiResponse({status: 200, type: StatOuptut, description: 'Returns stats who validate specified filters.'})
    public async listStatsByGroup(@Param('id') id: string, @Context() context: UserSession): Promise<Stat> {
        return await this.statService.listStatsByGroup(id, context);
    }

}
