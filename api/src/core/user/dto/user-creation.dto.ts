// tslint:disable: max-classes-per-file
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCreation {
    @ApiProperty({
        description: 'The user firstName.',
    })
    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @ApiProperty({
        description: 'The user lastName.',
    })
    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @ApiPropertyOptional({
        description: 'The user email.'
    })
    @IsEmail()
    @IsOptional()
    public email: string;

    @ApiPropertyOptional({
        description: 'The user password.'
    })
    @IsString()
    @IsOptional()
    public password: string;

    @ApiPropertyOptional({
        description: 'The courses linked to the user.'
    })
    @IsOptional()
    @IsArray()
    public courses: string[];
}