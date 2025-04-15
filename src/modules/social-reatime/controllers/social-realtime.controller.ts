import {Controller, Inject, Post, Body,} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseController } from 'src/core/controllers/base.controller';
import { ISocialService } from '../services/isocial-realtime.service';
import {CreateFeedbackDto} from "../dto/create-feedback.dto";
import {decryptString, encryptString} from "../../../utils/helper";

@Controller('')
@ApiTags('Social')
export class SocialRealtimeController extends BaseController {
    constructor(
        @Inject('ISocialService')
        private readonly socialService: ISocialService,
    ) {
        super();
    }

    @Post('/feedback')
    @ApiOperation({ description: 'API tạo feedback' })
    public async createFeedback(@Body() body: CreateFeedbackDto) {
        try {
            const result = await this.socialService.createFeedback(body);
            return this.sendOkResponse(result, 'success');
        } catch (error) {
            return this.sendFailedResponse(error.message, error.status);
        }
    }
}
