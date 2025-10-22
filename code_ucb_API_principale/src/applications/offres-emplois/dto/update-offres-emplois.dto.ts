// import { PartialType } from '@nestjs/mapped-types';
// import { CreateOffresEmploisDto } from './create-offres-emplois.dto';
// export class UpdateOffresEmploisDto extends PartialType(CreateOffresEmploisDto) {}


// update-job-offer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto } from './create-offres-emplois.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {
    @IsOptional()
    @IsNumber()
    @Min(0)
    totalPostuleNumber?: number;
}

