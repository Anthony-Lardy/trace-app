import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { TraceCreation } from './dto/trace-creation.dto';
import { TraceOutput } from './dto/trace-output.dto';
import { TraceEdition } from './dto/trace-update.dto';
import { TraceService } from './trace.service';

@ApiBearerAuth()
@ApiTags('traces')
@Controller('core/v1/traces')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class TraceController {
    constructor(private readonly traceService: TraceService) {}

    @Post()
    @ApiResponse({status: 201, type: TraceOutput, description: 'Returns created trace.'})
    public async createTrace(@Body() traceDto: TraceCreation, @Context() context: UserSession): Promise<TraceOutput> {
        const trace = await this.traceService.createTrace(traceDto, context);
        return new TraceOutput(trace);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: TraceOutput, description: 'Returns trace by id.'})
    public async getTrace(@Param('id') id: string, @Context() context: UserSession): Promise<TraceOutput> {
        const trace = await this.traceService.getTrace(id);
        return new TraceOutput(trace);
    }

    @Patch('/:id')
    @ApiResponse({status: 200, type: TraceOutput, description: 'Returns updated trace.'})
    public async updateTrace(@Param('id') id: string, @Body() updateTraceDto: TraceEdition, @Context() context: UserSession): Promise<TraceOutput> {
        const trace = await this.traceService.updateTrace(id, updateTraceDto, context);
        return new TraceOutput(trace);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, type: TraceOutput, description: 'Returns deleted trace.'})
    public async deleteTrace(@Param('id') id: string, @Context() context: UserSession): Promise<TraceOutput> {
        const trace = await this.traceService.deleteTrace(id, context);
        return new TraceOutput(trace);
    }

    @Get()
    @ApiResponse({status: 200, type: [TraceOutput], description: 'Returns traces who validate specified filters.'})
    public async listTraces(@Query() query: FilterDto, @Context() context: UserSession): Promise<TraceOutput[]> {
        const traces = await this.traceService.listTraces(query, context);
        return traces.map((trace) => new TraceOutput(trace));
    }

}
