import {Injectable} from "@nestjs/common";
import {BaseRepository} from "@devhcm/core-nestjs-fastify";
import {LogFeedBackEntity} from "../entities/log-feedback.entity";
import {DB_TYPE} from "../../../constant/common.const";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ILogFeedbackRepository} from "./ilog-feedback.repository";

@Injectable()
export class LogFeedbackRepository extends BaseRepository<LogFeedBackEntity> implements ILogFeedbackRepository {
    constructor(
        @InjectRepository(LogFeedBackEntity, DB_TYPE.DB_CONTENT_WRITE)
        private readonly logFeedBackRepository: Repository<LogFeedBackEntity>,
    ) {
        super(logFeedBackRepository);
    }
}
