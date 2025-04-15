import {Injectable} from "@nestjs/common";
import {BaseRepository} from "@devhcm/core-nestjs-fastify";
import {LogFeedBackEntity} from "../entities/log-feedback.entity";
import {DB_TYPE} from "../../../constant/common.const";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ILogFeedbackRepository} from "./ilog-feedback.repository";
import {ILogSocketRepository} from "./ilog-socket.repository";
import {LogSocketEntity} from "../entities/log-socket.entity";

@Injectable()
export class LogSocketRepository extends BaseRepository<LogSocketEntity> implements ILogSocketRepository {
    constructor(
        @InjectRepository(LogSocketEntity, DB_TYPE.DB_CONTENT_WRITE)
        private readonly LogSocketRepository: Repository<LogSocketEntity>,
    ) {
        super(LogSocketRepository);
    }
}
