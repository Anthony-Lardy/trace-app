import { PartialType } from '@nestjs/swagger';
import { UserCreation } from './user-creation.dto';

export class UserEdition extends PartialType(UserCreation) {}
