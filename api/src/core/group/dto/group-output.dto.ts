import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GroupOutput {
    @ApiPropertyOptional({
        description: 'The group id.',
        type: String,
    })
    @Type(() => String)
    public id = '';

    @ApiPropertyOptional({
        description: 'The group name',
        type: String,
    })
    public name = '';

    @ApiPropertyOptional({
        description: 'The course linked to the group',
        type: String,
    })
    public course = '';

    @ApiPropertyOptional({
        description: 'The date the resource was created.',
        type: String,
    })
    public createdAt = '';

    @ApiPropertyOptional({
        description: 'The group who created the resource.',
        type: String,
    })
    public createdBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was updated.',
        type: String,
    })
    public updatedAt = '';

    @ApiPropertyOptional({
        description: 'The group who updated the resource.',
        type: String,
    })
    public updatedBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was deleted.',
        type: String,
    })
    public deletedAt = '';

    @ApiPropertyOptional({
        description: 'The group who deleted the resource.',
        type: String,
    })
    public deletedBy = '';

    constructor(partial) {
        Object.assign(this, partial);
    }
}
