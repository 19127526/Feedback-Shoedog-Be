import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm'
import {IBaseEntity} from "@devhcm/core-nestjs-fastify";

export enum RATE_FEEDBACK {
    VERY_DISSATISFIED = 1,
    DISSATISFIED = 2,
    NORMAL = 3,
    SATISFIED = 4,
    VERY_SATISFIED = 5
}

@Entity({ name: 'LOG_FEEDBACK' })
export class LogFeedBackEntity extends IBaseEntity {

    @PrimaryGeneratedColumn() //'ID log'
    id: number;

    @Column() //'đánh giá khách hàng'
    message: string

    @Column() //'Trạng thái'
    status: number

    @CreateDateColumn({type: 'timestamp'}) //'Thời gian tạo đơn'
    create_date: string

    @Column() //'Tên nhân viên'
    user_name: string

    @Column({enum: RATE_FEEDBACK}) // 'feedback rate'
    feedback: RATE_FEEDBACK

    @Column() // ''
    note: string
}
