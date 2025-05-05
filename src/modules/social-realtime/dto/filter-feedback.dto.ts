import { ApiProperty } from '@nestjs/swagger';
import { RATE_FEEDBACK } from '../entities/log-feedback.entity';

export class FilterFeedbackDto {
    @ApiProperty({
        type: 'string',
        description: 'user_name',
        nullable: true,
        required: false
    })
    user_name: string

    @ApiProperty({
        type: 'number',
        description: 'status',
        nullable: true,
        required: false
    })
    status: number

    @ApiProperty({
        type: RATE_FEEDBACK,
        enum: RATE_FEEDBACK,
        description: 'feedback',
        nullable: true,
        required: false
    })
    feedback: RATE_FEEDBACK


    @ApiProperty({
        type: 'string',
        description: 'from_date',
        example: '2025-04-01',
        nullable: true,
        required: false
    })
    from_date: string

    @ApiProperty({
        type: 'string',
        description: 'create_date',
        example: '2025-04-01',
        nullable: true,
        required: false
    })
    create_date: string

    @ApiProperty({
        type: 'string',
        description: 'to_date',
        example: '2025-04-25',
        nullable: true,
        required: false
    })
    to_date: string

    @ApiProperty({
        type: 'number',
        description: 'page',
        nullable: true,
        required: false
    })
    page: number

    @ApiProperty({
        type: 'number',
        description: 'limit',
        nullable: true,
        required: false
    })
    limit: number
}
