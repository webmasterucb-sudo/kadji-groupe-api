import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersParametresController } from './users-parametres.controller';
import { UsersParametresService } from './users-parametres.service';
import { AdminUser, AdminUserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
    ]),
  ],
  controllers: [UsersParametresController],
  providers: [UsersParametresService],
  exports: [UsersParametresService],
})
export class UsersParametresModule {}
