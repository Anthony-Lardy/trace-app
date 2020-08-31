import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ActivityOutput {
    @ApiPropertyOptional({
        description: 'The activity id.',
        type: String,
    })
    @Type(() => String)
    public id = '';

    @ApiPropertyOptional({
        description: 'The activity name',
        type: String,
    })
    public name = '';

    @ApiPropertyOptional({
        description: 'The activity type',
        type: String,
    })
    public type = '';

    @ApiPropertyOptional({
        description: 'The course linked to the activity',
        type: String,
    })
    public course = '';

    @ApiPropertyOptional({
        description: 'The date the resource was created.',
        type: String,
    })
    public createdAt = '';

    @ApiPropertyOptional({
        description: 'The activity who created the resource.',
        type: String,
    })
    public createdBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was updated.',
        type: String,
    })
    public updatedAt = '';

    @ApiPropertyOptional({
        description: 'The activity who updated the resource.',
        type: String,
    })
    public updatedBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was deleted.',
        type: String,
    })
    public deletedAt = '';

    @ApiPropertyOptional({
        description: 'The activity who deleted the resource.',
        type: String,
    })
    public deletedBy = '';

    constructor(partial) {
        Object.assign(this, partial);
    }
}
