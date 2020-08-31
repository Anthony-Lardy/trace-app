// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TraceAction, TraceSource } from '../trace.interface';

export class TraceCreation {
    @ApiProperty({
        description: 'The trace action.',
    })
    @IsNotEmpty()
    @IsString()
    public action: TraceAction;

    @ApiProperty({
        description: 'The trace source.',
    })
    @IsNotEmpty()
    @IsString()
    public source: TraceSource;

    @ApiPropertyOptional({
        description: 'The trace payload.'
    })
    @IsOptional()
    @IsString()
    public payload: string;

    @ApiPropertyOptional({
        description: 'The activity linked to the trace.'
    })
    @IsOptional()
    @IsString()
    public activity: string;

    @ApiPropertyOptional({
        description: 'The student linked to the trace.'
    })
    @IsNotEmpty()
    @IsString()
    public student: string;

}