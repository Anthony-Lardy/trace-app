import { ApiPropertyOptional } from '@nestjs/swagger';

export class StatOuptut {
    @ApiPropertyOptional({
        description: 'The activity id.',
        type: Array,
    })
    public students = [];

    @ApiPropertyOptional({
        description: 'The activity name',
        type: Array,
    })
    public activities = [];

    constructor(partial) {
        Object.assign(this, partial);
    }
}
