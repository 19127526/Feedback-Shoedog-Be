import { Inject, Post, Body, Controller, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {CreateFeedbackDto} from "../dto/create-feedback.dto";
import { SocialService } from '../services/social-realtime.service';

@Controller('')
@ApiTags('Social')
export class SocialRealtimeController   {
    constructor(
        private readonly socialService: SocialService,
    ) {

    }

    @Post('/feedback')
    @ApiOperation({ description: 'API tạo feedback' })
    public async createFeedback(@Body() billInfo: CreateFeedbackDto) {
        try {
            const result = await this.socialService.createFeedback(billInfo);
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
