import { Module } from '@nestjs/common';

import { FinanceAppController } from './finance-app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/finance-schema';
import { FinanceAppService } from './finance-app.service';
import { BienImmo, BienImmoSchema } from './schemas/immoSchema';
import { BiensImmoController } from './immobilisation-controler';
import { BiensImmoService } from './immobilisation-service';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Users.name, schema: UsersSchema },
        { name: BienImmo.name, schema: BienImmoSchema },
      ]),
    ],
  controllers: [FinanceAppController, BiensImmoController],
  providers: [FinanceAppService, BiensImmoService],
})
export class FinanceAppModule {}
