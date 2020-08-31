import { PartialType } from '@nestjs/swagger';
import { TraceCreation } from './trace-creation.dto';

export class TraceEdition extends PartialType(TraceCreation) {}
