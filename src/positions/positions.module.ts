import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PositionsController } from './positions.controller';
import { Positions } from './positions.model';
import { Applicants } from '../applicants/applicants.model';
import { PositionsService } from './positions.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HandlerModule } from '../common/handler/handler.module';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [
    SequelizeModule.forFeature([Positions, Applicants]),
    EventEmitterModule.forRoot(),
    HandlerModule,
  ],
  exports: [SequelizeModule, EventEmitterModule],
})
export class PositionsModule {}
