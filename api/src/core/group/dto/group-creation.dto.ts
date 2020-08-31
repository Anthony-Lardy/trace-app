// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GroupCreation {
    @ApiProperty({
        description: 'The group name.',
    })
    @IsNotEmpty()
    @IsString()
    public name: string;

    @ApiProperty({
        description: 'The course linked to the group.',
    })
    @IsNotEmpty()
    @IsString()
    public course: string;

}