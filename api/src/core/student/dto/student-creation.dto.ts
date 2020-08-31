// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentCreation {
    @ApiProperty({
        description: 'The student firstName.',
    })
    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @ApiProperty({
        description: 'The student lastName.',
    })
    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @ApiPropertyOptional({
        description: 'The student email.'
    })
    @IsOptional()
    @IsString()
    public email: string;
    
    @ApiPropertyOptional({
        description: 'The courses linked to the student.'
    })
    @IsOptional()
    @IsArray()
    public courses: string[];

    @ApiPropertyOptional({
        description: 'The groups linked to the student.'
    })
    @IsOptional()
    @IsArray()
    public groups: string[];

}