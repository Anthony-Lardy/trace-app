import { SetMetadata } from '@nestjs/common';

import { Entity as EntityType } from '@lib/helper';

export const Entity = (entity: EntityType) => SetMetadata('entity', entity);
