import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TraceOutput {
    @ApiPropertyOptional({
        description: 'The trace id.',
        type: String,
    })
    @Type(() => String)
    public id = '';

    @ApiPropertyOptional({
        description: 'The trace action',
        type: String,
    })
    public action = 'unknow';

    @ApiPropertyOptional({
        description: 'The trace source',
        type: String,
    })
    public source = 'unknow';

    @ApiPropertyOptional({
        description: 'The trace payload',
        type: String,
    })
    public email = '';

    @ApiPropertyOptional({
        description: 'The activity linked to the trace',
        type: String,
    })
    public activity = '';

    @ApiPropertyOptional({
        description: 'The student linked to the trace',
        type: String,
    })
    public student = '';

    @ApiPropertyOptional({
        description: 'The date the resource was created.',
        type: String,
    })
    public createdAt = '';

    @ApiPropertyOptional({
        description: 'The trace who created the resource.',
        type: String,
    })
    public createdBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was updated.',
        type: String,
    })
    public updatedAt = '';

    @ApiPropertyOptional({
        description: 'The trace who updated the resource.',
        type: String,
    })
    public updatedBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was deleted.',
        type: String,
    })
    public deletedAt = '';

    @ApiPropertyOptional({
        description: 'The trace who deleted the resource.',
        type: String,
    })
    public deletedBy = '';

    constructor(partial) {
        Object.assign(this, partial);
    }
}
