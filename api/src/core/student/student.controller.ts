import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilterDto } from '@lib/common.dto';
import { Context } from '@lib/decorators';
import { HttpExceptionFilter } from '@lib/filters/http-exception.filter';
import { JwtAuthGuard } from '@lib/guards';
import { UserSession } from '@lib/helper';
import { LoggerInterceptor } from '@lib/interceptors/logger.interceptor';
import { StudentCreation } from './dto/student-creation.dto';
import { StudentOutput } from './dto/student-output.dto';
import { StudentEdition } from './dto/student-update.dto';
import { StudentService } from './student.service';

@ApiBearerAuth()
@ApiTags('students')
@Controller('core/v1/students')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ClassSerializerInterceptor)

export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    @ApiResponse({status: 201, type: StudentOutput, description: 'Returns created student.'})
    public async createStudent(@Body() studentDto: StudentCreation, @Context() context: UserSession): Promise<StudentOutput> {
        const student = await this.studentService.createStudent(studentDto, context);
        return new StudentOutput(student);
    }

    @Get('/:id')
    @ApiResponse({status: 200, type: StudentOutput, description: 'Returns student by id.'})
    public async getStudent(@Param('id') id: string, @Context() context: UserSession): Promise<StudentOutput> {
        const student = await this.studentService.getStudent(id);
        return new StudentOutput(student);
    }

    @Patch('/:id')
    @ApiResponse({status: 200, type: StudentOutput, description: 'Returns updated student.'})
    public async updateStudent(@Param('id') id: string, @Body() updateStudentDto: StudentEdition, @Context() context: UserSession): Promise<StudentOutput> {
        const student = await this.studentService.updateStudent(id, updateStudentDto, context);
        return new StudentOutput(student);
    }

    @Delete('/:id')
    @ApiResponse({status: 200, type: StudentOutput, description: 'Returns deleted student.'})
    public async deleteStudent(@Param('id') id: string, @Context() context: UserSession): Promise<StudentOutput> {
        const student = await this.studentService.deleteStudent(id, context);
        return new StudentOutput(student);
    }

    @Get()
    @ApiResponse({status: 200, type: [StudentOutput], description: 'Returns students who validate specified filters.'})
    public async listStudents(@Query() query: FilterDto, @Context() context: UserSession): Promise<StudentOutput[]> {
        const students = await this.studentService.listStudents(query, context);
        return students.map((student) => new StudentOutput(student));
    }

}
