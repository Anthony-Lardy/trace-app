import { InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { v4 as uuidv4} from 'uuid';

// we don't use 0 (zero) to avoid confusion with O (the letter o)
const ALPHABET = '0123456789';

export const BADGE_ID = /^BDG-[0-9]{9}$/;
export const DEVICE_ID = /^DVC-[0-9]{9}$/;

export type ResourceType = 'users' | 'groups' | 'courses' | 'students' | 'traces' | 'activities';

const RESOURCE_MAP: { [key in ResourceType]: { prefix: string, length: number, hasSeparator: boolean } } = {
    users: { prefix: 'USR', length: 9, hasSeparator: true },
    groups: { prefix: 'GRP', length: 9, hasSeparator: true},
    courses: { prefix: 'CRS', length: 9, hasSeparator: true},
    students: { prefix: 'STD', length: 9, hasSeparator: true},
    traces: { prefix: 'TRC', length: 9, hasSeparator: true},
    activities: { prefix: 'ACT', length: 9, hasSeparator: true},
};

export function generateId(resourceType: ResourceType): string {
    const map = RESOURCE_MAP[resourceType];
    if (!map) {
        throw new InternalServerErrorException(`Cannot generate id: unknown resource type ${resourceType}.`);
    }

    const { hasSeparator, prefix } = map;

    const nanoid = customAlphabet(ALPHABET, map.length);

    return `${prefix}${hasSeparator ? '-' : ''}${nanoid()}`;
}

export function checkIdFormat(id: string, resourceType: ResourceType): boolean {
    const map = RESOURCE_MAP[resourceType];
    if (!map) {
        throw new InternalServerErrorException(`Cannot check id: unknown resource type ${resourceType}.`);
    }
    if (!id.startsWith(map.prefix)) {
        return false;
    }
    if (map.hasSeparator && id.charAt(map.prefix.length) !== '-') {
        return false;
    }
    const expectedLength = map.prefix.length + (map.hasSeparator ? 1 : 0) + map.length;
    if (id.length !== expectedLength) {
        return false;
    }
    return true;
}

export function generateOneId(): string {
    return uuidv4();
}

generateOneId.description = 'OneId is unique ';
