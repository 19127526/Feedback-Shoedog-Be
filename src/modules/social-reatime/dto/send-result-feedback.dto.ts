import {ApiProperty} from "@nestjs/swagger";
import {RATE_FEEDBACK} from "../entities/log-feedback.entity";

export class SendResultFeedbackDto {
    @ApiProperty({
        type: 'string'
    })
    user_name: string

    @ApiProperty({
        type: RATE_FEEDBACK,
        enum: RATE_FEEDBACK
    })
    feedback: RATE_FEEDBACK
}
