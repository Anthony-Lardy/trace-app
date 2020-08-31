import { existField } from '@lib/search-filter';
import { BadRequestException } from '@nestjs/common';
import { FieldDefinition } from './filter-parser';

export const commonFilter: FieldDefinition[] = [
    {
        field: '_id',
        alias: ['id'],
        parser: 'string',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'updatedAt',
        parser: 'date',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'createdAt',
        parser: 'date',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'updatedBy',
        parser: 'string',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'createdBy',
        parser: 'string',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'has',
        parser: ({term, terms, prefix, op}, _opts, _context) => {
            switch (op) {
                case 'eq': return existField(term, prefix);
                case 'in': return { $or: terms.map((it) => existField(it, prefix)) };
                case 'all': return { $and: terms.map((it) => existField(it, prefix)) };
                default: throw new BadRequestException(`Operator ${op} is not allowed on exist filter`);
            }
        },
    },
];
