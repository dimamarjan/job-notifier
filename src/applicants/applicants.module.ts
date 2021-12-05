import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicantsController } from './applicants.controller';
import { Applicants } from './applicants.model';
import { ApplicantsService } from './applicants.service';
import { HandlerService } from '../common/handler/handler.service';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService, HandlerService],
  imports: [SequelizeModule.forFeature([Applicants])],
})
export class ApplicantsModule {}
