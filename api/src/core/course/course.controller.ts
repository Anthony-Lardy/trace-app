import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { CourseCreation } from './dto/course-creation.dto';
import { CourseOutput } from './dto/course-output.dto';
import { CourseEdition } from './dto/course-update.dto';
import { CourseService } from './course.service';

@ApiBearerAuth()
@ApiTags('courses')
@Controller('core/v1/courses')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    @ApiResponse({status: 201, type: CourseOutput, description: 'Returns created course.'})
    public async createCourse(@Body() courseDto: CourseCreation, @Context() context: UserSession): Promise<CourseOutput> {
        const course = await this.courseService.createCourse(courseDto, context);
        return new CourseOutput(course);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: CourseOutput, description: 'Returns course by id.'})
    public async getCourse(@Param('id') id: string, @Context() context: UserSession): Promise<CourseOutput> {
        const course = await this.courseService.getCourse(id);
        return new CourseOutput(course);
    }

    @Patch('/:id')
    @ApiResponse({status: 200, type: CourseOutput, description: 'Returns updated course.'})
    public async updateCourse(@Param('id') id: string, @Body() updateCourseDto: CourseEdition, @Context() context: UserSession): Promise<CourseOutput> {
        const course = await this.courseService.updateCourse(id, updateCourseDto, context);
        return new CourseOutput(course);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, type: CourseOutput, description: 'Returns deleted course.'})
    public async deleteCourse(@Param('id') id: string, @Context() context: UserSession): Promise<CourseOutput> {
        const course = await this.courseService.deleteCourse(id, context);
        return new CourseOutput(course);
    }

    @Get()
    @ApiResponse({status: 200, type: [CourseOutput], description: 'Returns courses who validate specified filters.'})
    public async listCourses(@Query() query: FilterDto, @Context() context: UserSession): Promise<CourseOutput[]> {
        const courses = await this.courseService.listCourses(query, context);
        return courses.map((course) => new CourseOutput(course));
    }

}
