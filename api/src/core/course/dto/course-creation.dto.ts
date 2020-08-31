// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CourseCreation {
    @ApiProperty({
        description: 'The course name.',
    })
    @IsNotEmpty()
    @IsString()
    public name: string;

}