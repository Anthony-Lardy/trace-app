import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { GroupCreation } from './dto/group-creation.dto';
import { GroupOutput } from './dto/group-output.dto';
import { GroupEdition } from './dto/group-update.dto';
import { GroupService } from './group.service';

@ApiBearerAuth()
@ApiTags('groups')
@Controller('core/v1/groups')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post()
    @ApiResponse({status: 201, type: GroupOutput, description: 'Returns created group.'})
    public async createGroup(@Body() groupDto: GroupCreation, @Context() context: UserSession): Promise<GroupOutput> {
        const group = await this.groupService.createGroup(groupDto, context);
        return new GroupOutput(group);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: GroupOutput, description: 'Returns group by id.'})
    public async getGroup(@Param('id') id: string, @Context() context: UserSession): Promise<GroupOutput> {
        const group = await this.groupService.getGroup(id);
        return new GroupOutput(group);
    }

    @Patch('/:id')
    @ApiResponse({status: 200, type: GroupOutput, description: 'Returns updated group.'})
    public async updateGroup(@Param('id') id: string, @Body() updateGroupDto: GroupEdition, @Context() context: UserSession): Promise<GroupOutput> {
        const group = await this.groupService.updateGroup(id, updateGroupDto, context);
        return new GroupOutput(group);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, type: GroupOutput, description: 'Returns deleted group.'})
    public async deleteGroup(@Param('id') id: string, @Context() context: UserSession): Promise<GroupOutput> {
        const group = await this.groupService.deleteGroup(id, context);
        return new GroupOutput(group);
    }

    @Get()
    @ApiResponse({status: 200, type: [GroupOutput], description: 'Returns groups who validate specified filters.'})
    public async listGroups(@Query() query: FilterDto, @Context() context: UserSession): Promise<GroupOutput[]> {
        const groups = await this.groupService.listGroups(query, context);
        return groups.map((group) => new GroupOutput(group));
    }

}
