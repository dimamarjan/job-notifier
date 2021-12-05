import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { PositionsDto } from 'src/positions/dto/positions.dto';

@Injectable()
export class ApplicantsMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailAdd(applicant: string, position: PositionsDto) {
    try {
      await this.mailerService.sendMail({
        to: applicant,
        from: process.env.MAIL_USER,
        subject: `New position add by ${position.company} company!`,
        text: `\n${position.company} looking for a ${position.level} ${
          position.category
        } developer.\n${position.description ? position.description : ''}${
          position.japaneseRequired ? '\nJapanese language is required.' : ''
        }`,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendEmailDel(applicant: string, position: PositionsDto) {
    try {
      await this.mailerService.sendMail({
        to: applicant,
        from: process.env.MAIL_USER,
        subject: `Position was closed by ${position.company} company`,
        text: `${position.company} just colse position for ${position.level} ${position.category} developer.`,
      });
    } catch (e) {
      console.log(e);
    }
  }

  @OnEvent('mail')
  public async example(
    applicantsMails: string[],
    positionsDto: PositionsDto,
  ): Promise<void> {
    if (positionsDto.emitMethod === 'add') {
      applicantsMails.forEach((applicant) => {
        this.sendEmailAdd(applicant, positionsDto).catch((err) => {
          if (err) console.log(err);
        });
      });
    }
    if (positionsDto.emitMethod === 'del') {
      applicantsMails.forEach((applicant) => {
        this.sendEmailDel(applicant, positionsDto).catch((err) => {
          if (err) console.log(err);
        });
      });
    }
  }
}
