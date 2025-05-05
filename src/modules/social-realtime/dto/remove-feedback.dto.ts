import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CommonRequestDto } from './common-emit.dto';

export class RemoveFeedback {
    @ApiProperty({
        type: 'number[]',
        example: [1,2,3,4]
    })
    list_id: number[]
}

// Dùng IntersectionType
export class RemoveFeedbackDto extends IntersectionType(CommonRequestDto, RemoveFeedback) {}
