import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-finance-app.dto';
import { CreateBienImmoDto } from './bienImmo.dto';


export class UpdateUserAppDto extends PartialType(CreateUsersDto) {}

export class UpdateBienImmoDto extends PartialType(CreateBienImmoDto) {}

