import { Entity, PrimaryColumn,} from 'typeorm'
import {IBaseEntity} from "@devhcm/core-nestjs-fastify";

@Entity({ name: 'LOG_SOCKET' })
export class LogSocketEntity extends IBaseEntity {
    @PrimaryColumn() //'socket_id'
    socket_id: string
}
