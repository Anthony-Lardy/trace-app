import { PartialType } from '@nestjs/swagger';
import { StudentCreation } from './student-creation.dto';

export class StudentEdition extends PartialType(StudentCreation) {}
