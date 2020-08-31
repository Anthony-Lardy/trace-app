import { PartialType } from '@nestjs/swagger';
import { CourseCreation } from './course-creation.dto';

export class CourseEdition extends PartialType(CourseCreation) {}
