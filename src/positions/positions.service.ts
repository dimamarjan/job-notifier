import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';
import { PositionsDto } from './dto/positions.dto';
import { IQueryParamPositionsDto } from './interfaces/queryParamPositions.dto';
import { Positions } from './positions.model';
import { Op } from 'sequelize';
import { HandlerService } from '../common/handler/handler.service';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Positions) private positionsRepository: typeof Positions,
    private addPositionEvent: EventEmitter2,
    private handlerService: HandlerService,
  ) {}

  async addPositions(addPositionsDto: PositionsDto) {
    try {
      const positions = await this.positionsRepository.create(addPositionsDto);
      addPositionsDto.emitMethod = 'add';
      this.addPositionEvent.emit('getEqualApplicants', addPositionsDto);
      return positions.position_id;
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async getAllPositions() {
    try {
      const positions = await this.positionsRepository.findAll({
        raw: true,
      });
      return positions;
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async getEqualPositions(queryParams: IQueryParamPositionsDto) {
    try {
      if (!queryParams.tag) {
        const positions = await this.positionsRepository.findAll({
          raw: true,
          where: { ...queryParams },
        });
        return positions;
      } else {
        const findText: string = queryParams.tag;
        delete queryParams.tag;
        const positions = await this.positionsRepository.findAll({
          raw: true,
          where: {
            ...queryParams,
            description: { [Op.like]: `%${findText}%` },
          },
        });
        return positions;
      }
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async getPositionsById(positionId: string) {
    try {
      const positions = await this.positionsRepository.findOne({
        where: {
          position_id: positionId,
        },
      });
      return positions;
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async updatePositions(positionId: string, updatePositionDto: PositionsDto) {
    try {
      const positions = await this.positionsRepository.update(
        updatePositionDto,
        {
          where: {
            position_id: positionId,
          },
        },
      );
      return Boolean(positions[0]);
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async removePositions(positionId: string) {
    try {
      const positionsForMailer = await this.positionsRepository.findOne({
        raw: true,
        where: {
          position_id: positionId,
        },
      });
      const positions = await this.positionsRepository.destroy({
        where: {
          position_id: positionId,
        },
      });
      positionsForMailer.emitMethod = 'del';
      this.addPositionEvent.emit('getEqualApplicants', positionsForMailer);
      return Boolean(positions);
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }
}
