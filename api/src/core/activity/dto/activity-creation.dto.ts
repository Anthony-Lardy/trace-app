// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '../activity.interface';

export class ActivityCreation {
    @ApiProperty({
        description: 'The activity name.',
    })
    @IsNotEmpty()
    @IsString()
    public name: string;

    @ApiProperty({
        description: 'The course linked to the activity.',
    })
    @IsNotEmpty()
    @IsString()
    public course: string;

    @ApiProperty({
        description: 'The activity type',
    })
    @IsNotEmpty()
    @IsString()
    public type: ActivityType;

}