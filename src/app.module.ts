import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Positions } from './positions/positions.model';
import { Applicants } from './applicants/applicants.model';
import { PositionsModule } from './positions/positions.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { ApplicntsMailerModule } from './common/mailer/mailer.module';
import { HandlerModule } from './common/handler/handler.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB_NAME,
      models: [Applicants, Positions],
      define: {
        timestamps: false,
      },
    }),
    ApplicantsModule,
    PositionsModule,
    ApplicntsMailerModule,
    HandlerModule,
  ],
})
export class AppModule {}
