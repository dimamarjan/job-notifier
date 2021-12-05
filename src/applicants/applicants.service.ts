import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';
import { PositionsDto } from '../positions/dto/positions.dto';
import { Applicants } from './applicants.model';
import { ApplicantsDto } from './dto/applicants.dto';
import { Op } from 'sequelize';
import { HandlerService } from '../common/handler/handler.service';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(Applicants) private applicantsRepository: typeof Applicants,
    private addPositionEvent: EventEmitter2,
    private handlerService: HandlerService,
  ) {}

  @OnEvent('getEqualApplicants')
  async findApplicants(positionsDto: PositionsDto) {
    const applicants = await this.applicantsRepository.findAll({
      raw: true,
      where: {
        level: positionsDto.level,
        categories: { [Op.contains]: [positionsDto.category] },
      },
    });
    const applicantsMails: string[] = applicants.map(
      (applicant) => applicant.email,
    );
    this.addPositionEvent.emit('mail', applicantsMails, positionsDto);
  }

  async addApplicants(addApplicantsDto: ApplicantsDto) {
    try {
      const applicants = await this.applicantsRepository.create(
        addApplicantsDto,
      );
      return applicants;
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async removeApplicants(applicantId: string) {
    try {
      const applicants = await this.applicantsRepository.destroy({
        where: {
          applicant_id: applicantId,
        },
      });
      return Boolean(applicants[0]);
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }

  async updateApplicants(
    applicantId: string,
    updateApplicantsDto: ApplicantsDto,
  ) {
    try {
      const applicants = await this.applicantsRepository.update(
        updateApplicantsDto,
        {
          where: {
            applicant_id: applicantId,
          },
        },
      );
      return Boolean(applicants[0]);
    } catch (err) {
      this.handlerService.dbError(err);
    }
  }
}
