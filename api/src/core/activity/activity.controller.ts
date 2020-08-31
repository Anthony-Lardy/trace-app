import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { ActivityCreation } from './dto/activity-creation.dto';
import { ActivityOutput } from './dto/activity-output.dto';
import { ActivityEdition } from './dto/activity-update.dto';
import { ActivityService } from './activity.service';

@ApiBearerAuth()
@ApiTags('activities')
@Controller('core/v1/activities')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Post()
    @ApiResponse({status: 201, type: ActivityOutput, description: 'Returns created activity.'})
    public async createActivity(@Body() activityDto: ActivityCreation, @Context() context: UserSession): Promise<ActivityOutput> {
        const activity = await this.activityService.createActivity(activityDto, context);
        return new ActivityOutput(activity);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: ActivityOutput, description: 'Returns activity by id.'})
    public async getActivity(@Param('id') id: string, @Context() context: UserSession): Promise<ActivityOutput> {
        const activity = await this.activityService.getActivity(id);
        return new ActivityOutput(activity);
    }

    @Patch('/:id')
    @ApiResponse({status: 200, type: ActivityOutput, description: 'Returns updated activity.'})
    public async updateActivity(@Param('id') id: string, @Body() updateActivityDto: ActivityEdition, @Context() context: UserSession): Promise<ActivityOutput> {
        const activity = await this.activityService.updateActivity(id, updateActivityDto, context);
        return new ActivityOutput(activity);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, type: ActivityOutput, description: 'Returns deleted activity.'})
    public async deleteActivity(@Param('id') id: string, @Context() context: UserSession): Promise<ActivityOutput> {
        const activity = await this.activityService.deleteActivity(id, context);
        return new ActivityOutput(activity);
    }

    @Get()
    @ApiResponse({status: 200, type: [ActivityOutput], description: 'Returns activitys who validate specified filters.'})
    public async listActivitys(@Query() query: FilterDto, @Context() context: UserSession): Promise<ActivityOutput[]> {
        const activitys = await this.activityService.listActivities(query, context);
        return activitys.map((activity) => new ActivityOutput(activity));
    }

}
