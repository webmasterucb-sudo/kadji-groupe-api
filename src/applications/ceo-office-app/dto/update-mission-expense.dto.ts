import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionExpenseDto } from './create-mission-expense.dto';

export class UpdateMissionExpenseDto extends PartialType(CreateMissionExpenseDto) { }
