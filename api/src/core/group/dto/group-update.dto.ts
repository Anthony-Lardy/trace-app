import { PartialType } from '@nestjs/swagger';
import { GroupCreation } from './group-creation.dto';

export class GroupEdition extends PartialType(GroupCreation) {}
