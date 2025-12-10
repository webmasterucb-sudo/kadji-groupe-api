import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FournisseurBilletService } from './fournisseur-billet.service';
import { FournisseurBilletController } from './fournisseur-billet.controller';
import { FournisseurBillet, FournisseurBilletSchema } from './entities/fournisseur-billet.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FournisseurBillet.name, schema: FournisseurBilletSchema },
        ]),
    ],
    controllers: [FournisseurBilletController],
    providers: [FournisseurBilletService],
    exports: [FournisseurBilletService],
})
export class FournisseurBilletModule { }
