import { PartialType } from '@nestjs/swagger';
import { ActivityCreation } from './activity-creation.dto';

export class ActivityEdition extends PartialType(ActivityCreation) {}
