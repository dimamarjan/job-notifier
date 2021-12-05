import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PositionsDto } from './dto/positions.dto';
import { IQueryParamPositionsDto } from './interfaces/queryParamPositions.dto';
import { ICreatePosition } from './interfaces/response-create.interface';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Post()
  async create(@Body() addPositionsDto: PositionsDto) {
    try {
      const response = await this.positionsService.addPositions(
        addPositionsDto,
      );
      const respData: ICreatePosition = {
        status: 'Created',
        code: 201,
        Position: { id: response },
      };
      return respData;
    } catch (e) {
      console.log(e);
    }
  }

  @Get()
  async getAll(@Query() queryParams: IQueryParamPositionsDto) {
    if (Object.keys(queryParams)) {
      const response = await this.positionsService.getEqualPositions(
        queryParams,
      );
      return {
        status: 'OK',
        code: 200,
        Position: response,
      };
    }
    const response = await this.positionsService.getAllPositions();
    return {
      status: 'OK',
      code: 200,
      Position: response,
    };
  }

  @Get(':id')
  async findOne(@Param('id') positionId: string) {
    const response = await this.positionsService.getPositionsById(positionId);
    if (response) {
      return {
        status: 'OK',
        code: 200,
        Position: response,
      };
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') positionId: string,
    @Body() updatePositionDto: PositionsDto,
  ) {
    const response = await this.positionsService.updatePositions(
      positionId,
      updatePositionDto,
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

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') positionId: string) {
    const response = await this.positionsService.removePositions(positionId);
    if (response) {
      return;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
