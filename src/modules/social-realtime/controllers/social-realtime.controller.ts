import {
    Inject,
    Post,
    Body,
    Controller,
    HttpException,
    HttpStatus,
    HttpCode,
    Get,
    Query,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {CreateFeedbackDto} from "../dto/create-feedback.dto";
import { SocialService } from '../services/social-realtime.service';
import { FilterFeedbackDto } from '../dto/filter-feedback.dto';

@Controller('feedback')
@ApiTags('Social')
export class SocialRealtimeController   {
    constructor(
        private readonly socialService: SocialService,
    ) {

    }

    @Post('')
    @ApiOperation({ description: 'API tạo feedback' })
    public async createFeedback(@Body() billInfo: CreateFeedbackDto) {
        try {
            const result = await this.socialService.createFeedback(billInfo as any);
            return {
                data: result,
                message: 'success'
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 400,
                    message: error.message,
                    data: null
                },
                400,
            );
        }
    }

    @Post('/excel')
    @ApiOperation({ description: 'API xuất excel feedback' })
    public async exportExcel(@Query() body: FilterFeedbackDto) {
        try {
            const result = await this.socialService.exportExcel(body);
            return {
                data: result,
                message: 'success'
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 400,
                    message: error.message,
                    data: null
                },
                400,
            );
        }
    }

    @Delete('')
    @ApiOperation({ description: 'API xóa feedback' })
    public async deleteFeedback(@Body() listId: number[]) {
        try {
            const result = await this.socialService.removeFeedback(listId);
            return {
                data: result,
                message: 'success'
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 400,
                    message: error.message,
                    data: null
                },
                400,
            );
        }
    }

    @Get('')
    @ApiOperation({ description: 'API lấy list feedback' })
    public async getListFeedBackByQuery(@Query() query: FilterFeedbackDto) {
        try {
            const result = await this.socialService.getListFeedBackByQuery(query);
            return {
                data: result,
                message: 'success'
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: 400,
                    message: error.message,
                    data: null
                },
                400,
            );
        }
    }
}
