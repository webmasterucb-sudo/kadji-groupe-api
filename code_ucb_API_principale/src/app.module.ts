import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OffresEmploisModule } from './applications/offres-emplois/offres-emplois.module';
import { ActualitesModule } from './applications/marketing-apps/actualites/actualites.module';
import { FormulairesModule } from './applications/marketing-apps/formulaires/formulaires.module';
import { FinanceAppModule } from './applications/finance-app/finance-app.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    // MongooseModule.forRoot(process.env.MONGODB_URI ?? (() => { throw new Error('MONGODB_URI is not defined'); })()),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // <-- Make ConfigModule available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI_DEV"), // <-- Get the URI from .env
      }),
      inject: [ConfigService], // <-- Inject ConfigService into the factory
    }),


    OffresEmploisModule,
    ActualitesModule,
    FormulairesModule,
    FinanceAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
