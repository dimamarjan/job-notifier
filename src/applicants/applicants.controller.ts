import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsDto } from './dto/applicants.dto';

@Controller('applicants')
export class ApplicantsController {
  constructor(private applicantsService: ApplicantsService) {}

  @Post()
  async create(@Body() applicantsDto: ApplicantsDto) {
    const response = await this.applicantsService.addApplicants(applicantsDto);
    return {
      status: 'Created',
      code: 201,
      applicant: {
        id: response.applicant_id,
      },
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') applicantId: string) {
    const response = await this.applicantsService.removeApplicants(applicantId);
    if (response) {
      return;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') applicantId: string,
    @Body() updateApplicantsDto: ApplicantsDto,
  ) {
    const response = await this.applicantsService.updateApplicants(
      applicantId,
      updateApplicantsDto,
    );
    if (response) {
      return {
        status: 'OK',
        code: 200,
      };
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
