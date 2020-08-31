import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserOutput {
    @ApiPropertyOptional({
        description: 'The user id.',
        type: String,
    })
    @Type(() => String)
    public id = '';

    @ApiPropertyOptional({
        description: 'The user first name.',
        type: String,
    })
    public firstName = '';

    @ApiPropertyOptional({
        description: 'The user last name.',
        type: String,
    })
    public lastName = '';

    @ApiPropertyOptional({
        description: 'The user email.',
        type: String,
    })
    public email = '';

    @ApiPropertyOptional({
        description: 'The courses linked to the student',
        type: Array,
    })
    public courses = [];

    @ApiPropertyOptional({
        description: 'The date the resource was created.',
        type: String,
    })
    public createdAt = '';

    @ApiPropertyOptional({
        description: 'The user who created the resource.',
        type: String,
    })
    public createdBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was updated.',
        type: String,
    })
    public updatedAt = '';

    @ApiPropertyOptional({
        description: 'The user who updated the resource.',
        type: String,
    })
    public updatedBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was deleted.',
        type: String,
    })
    public deletedAt = '';

    @ApiPropertyOptional({
        description: 'The user who deleted the resource.',
        type: String,
    })
    public deletedBy = '';

    constructor(partial) {
        Object.assign(this, partial);
    }
}
