import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StudentOutput {
    @ApiPropertyOptional({
        description: 'The student id.',
        type: String,
    })
    @Type(() => String)
    public id = '';

    @ApiPropertyOptional({
        description: 'The student firstName',
        type: String,
    })
    public firstName = '';

    @ApiPropertyOptional({
        description: 'The student lastName',
        type: String,
    })
    public lastName = '';

    @ApiPropertyOptional({
        description: 'The student email',
        type: String,
    })
    public email = '';

    @ApiPropertyOptional({
        description: 'The courses linked to the student',
        type: Array,
    })
    public courses = [];

    @ApiPropertyOptional({
        description: 'The groups linked to the student',
        type: Array,
    })
    public groups = [];

    @ApiPropertyOptional({
        description: 'The course linked to the student',
        type: String,
    })
    public student = '';

    @ApiPropertyOptional({
        description: 'The date the resource was created.',
        type: String,
    })
    public createdAt = '';

    @ApiPropertyOptional({
        description: 'The student who created the resource.',
        type: String,
    })
    public createdBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was updated.',
        type: String,
    })
    public updatedAt = '';

    @ApiPropertyOptional({
        description: 'The student who updated the resource.',
        type: String,
    })
    public updatedBy = '';

    @ApiPropertyOptional({
        description: 'The date the resource was deleted.',
        type: String,
    })
    public deletedAt = '';

    @ApiPropertyOptional({
        description: 'The student who deleted the resource.',
        type: String,
    })
    public deletedBy = '';

    constructor(partial) {
        Object.assign(this, partial);
    }
}
