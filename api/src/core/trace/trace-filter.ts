// tslint:disable:tsr-detect-non-literal-regexp

import { existField, MongoFilterParser } from '@lib/search-filter';
import { BadRequestException } from '@nestjs/common';
import { escapeRegExp } from 'lodash';

export const traceFilter = new MongoFilterParser({
    default: {
        field: 'default', parser: (expr) => {
            const reg = new RegExp(escapeRegExp(expr.term), 'i');
            return { $or: [{ action: reg }, { source: reg }] };
        },
    }, defaultSort: '-updatedAt',
    fields: [{
        field: '_id',
        alias: ['id'],
        parser: 'string',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'action',
        parser: 'string',
        options: { sortable: true, selectable: true, caseSensitive: true },
    },
    {
        field: 'source',
        parser: 'string',
        options: { sortable: true, selectable: true, caseSensitive: true },
    },
    {
        field: 'payload',
        parser: 'string',
        options: { sortable: true, selectable: true, caseSensitive: true },
    },
    {
        field: 'student',
        parser: 'string',
        options: { sortable: true, selectable: true },
    },
    {
        field: 'activity',
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
    ],
});
