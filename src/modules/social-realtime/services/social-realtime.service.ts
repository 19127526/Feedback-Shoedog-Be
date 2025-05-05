import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Between, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogFeedBackEntity } from '../entities/log-feedback.entity';
import { LogSocketEntity } from '../entities/log-socket.entity';
import { SocialGatewayV2 } from '../events/social-realtime.gateway';
import { SendResultFeedbackDto } from '../dto/send-result-feedback.dto';
import { FilterFeedbackDto } from '../dto/filter-feedback.dto';
import { formatDateTime } from '../../../core/helpers/datetime.helper';
import { FEEDBACK_TYPE, STATUS_TYPE } from '../../../constant/common.const';
import * as fs from 'fs';
import { exportExcel } from '../../../utils/excel.helper';
import * as console from 'console';

@Injectable()
export class SocialService {
    constructor(
        @InjectRepository(LogFeedBackEntity)
        private logFeedbackRepository: Repository<LogFeedBackEntity>,
        @InjectRepository(LogSocketEntity)
        private logSocketRepository: Repository<LogSocketEntity>,
        @Inject(forwardRef(() => SocialGatewayV2))  // Đảm bảo rằng module chứa SocialGatewayV2 đã được import
        private readonly socialGatewayV2: SocialGatewayV2,
    ) {
    }

    removeLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.delete({
            socket_id: socketId
        });
    }

    removeFeedback(listId: number[]) : any {
        let count = 0;
        for(let i = 0; i < listId.length; i++) {
            this.logFeedbackRepository.delete({
                id: listId[i]
            });
            count++;
        }
        return count;
    }

    async checkLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.findBy({
            socket_id: socketId,
        });
    }

    //Save log socket when connect socket
    createLogSocket(socketId: string): Promise<any> {
        return this.logSocketRepository.save({
            socket_id: socketId,
        }) as any;
    }

    async getNewLogFeedBack(): Promise<LogFeedBackEntity> {
        return await this.logFeedbackRepository.findOne({
            where: {
                status: 0,
            },
            order: {
                id: 'ASC',
            },
        });
    }


    //Save feedback when start app
    async createFeedback(billInfo: {Invoice: any}): Promise<any> {
        try {
            if(billInfo && billInfo.Invoice) {
                if(billInfo?.Invoice?.Seller?.GivenName != 'Shopee'
                    && billInfo?.Invoice?.Seller?.GivenName != 'Vệ sinh giày'
                    && billInfo?.Invoice?.Seller?.GivenName != 'Website'
                ) {
                    const data = await this.logFeedbackRepository.save({
                        note: JSON.stringify(billInfo),
                        status: 0,
                        create_date: new Date().toString(),
                        user_name: billInfo?.Invoice?.Seller?.GivenName ?? ''
                    });
                    const result = await this.getNewLogFeedBack()
                    await this.socialGatewayV2.emitSendNotiFeedback(result);
                    return data;
                } else {
                    return null;
                }
            }
            throw new Error('Body không hợp lệ')
        } catch (err) {
           throw err
        }
    }


    //Update after app send feedback
    async updateFeedbackById(body: SendResultFeedbackDto): Promise<{isError: boolean, data: LogFeedBackEntity | null, message: string}> {
        try {
            const isExistSocket = await this.checkLogSocket(body.socket_id)

            //check exist socket
            if(!isExistSocket) {
                return {
                    data: null,
                    isError: true,
                    message: 'Socket không hợp lệ'
                }
            }

            const isUpdatedFeedback = await this.logFeedbackRepository.findOne({
                where: {
                    id: body.id,
                    status: 1
                }
            })

            //check exist socket
            if(isUpdatedFeedback) {
                return {
                    data: null,
                    isError: true,
                    message: 'Form này đã được dánh giá'
                }
            }

            await this.logFeedbackRepository.update(body.id,{
                status: 1,
                message: body.message,
                feedback: body.feedback,
            })
            const newData = await this.getNewLogFeedBack() ?? null;

            return {
                isError: false,
                data: newData,
                message: 'Bạn đã gửi đánh giá thành công'
            }

        } catch (err) {
            return {
                isError: true,
                message: err?.message ?? err?.toString(),
                data: null
            }
        }
    }

    async getListFeedBackByQuery(query: FilterFeedbackDto): Promise<{total: number, items: LogFeedBackEntity[]}> {
        console.log('query', query)
        let where: any = {}
        if (query.user_name) {
            where.user_name = ILike(`%${query.user_name}%`);
        }

        if (query.status !== undefined) {
            where.status = query.status;
        }

        if (query.feedback) {
            where.feedback = query.feedback;
        }
        if (query.from_date && query.to_date) {
            const startOfDay = new Date(query.from_date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(query.to_date);
            endOfDay.setHours(23, 59, 59, 999);

            where.create_date = Between(startOfDay, endOfDay);
        } else if (query.from_date) {
            const startOfDay = new Date(query.from_date);
            startOfDay.setHours(0, 0, 0, 0);
            where.create_date = Between(startOfDay, new Date()); // đến hiện tại
        } else if (query.to_date) {
            const endOfDay = new Date(query.to_date);
            endOfDay.setHours(23, 59, 59, 999);

            where.create_date = Between(new Date('1970-01-01'), endOfDay);
        }

        if(query.create_date) {
            const startOfDay = new Date(query.create_date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(query.create_date);
            endOfDay.setHours(23, 59, 59, 999);

            where.create_date = Between(startOfDay, endOfDay);
        }

        const page = query.page || 1;
        const limit = query.limit || 30;
        const skip = (page - 1) * limit;

        const [items, total] = await this.logFeedbackRepository.findAndCount({
            ...(Object.keys(where).length > 0 ? { where } : {}),
            ...(page != -1 ? {
                skip,
                take: limit,
            } : {}),
            order: {
                id: 'DESC'
            }
        })
        return {
            total: total,
            items: items
        }
    }



    async exportExcel(body): Promise<any> {
        const { items } = await this.getListFeedBackByQuery({
            ...body,
            page: -1
        })

        for (const item of items) {
            // Tự tăng số thứ tự (STT)
            const stt = items.indexOf(item) + 1;
            item['id'] = stt;
            item['user_name'] = item.user_name ?? '';
            item['create_date'] = item?.create_date ? formatDateTime('DD/MM/YYYY HH:mm:ss', item.create_date) : '';
            item['message'] = item.message;
            item['feedback_label'] = item.feedback != null ? FEEDBACK_TYPE.find(index => index.value == item.feedback)?.label : 'N/A';
            item['status_label'] = item.status != null ? STATUS_TYPE.find(index => index.value == item.status)?.label : 'N/A';
        }

        let headers = [
            { header: 'STT', key: 'id' },
            { header: 'Tên nhân viên', key: 'user_name' },
            { header: 'Thời gian tạo', key: 'create_date' },
            { header: 'Lời đánh giá', key: 'message' },
            { header: 'Loại Đánh giá', key: 'feedback_label' },
            { header: 'Trạng thái', key: 'status_label' },
        ];

        console.log('items', items)

        let outputFilePath = '/public/static/' + 'feedback' + `/${new Date().getFullYear()}` + `/${new Date().getMonth() + 1}` + '/export';
        let path = outputFilePath + '/export_list.xlsx';
        console.log(process.cwd() + outputFilePath)
        if (!fs.existsSync(process.cwd() + outputFilePath)) {
            // Nếu thư mục không tồn tại, tạo mới nó
            fs.mkdirSync(process.cwd() + outputFilePath, { recursive: true });
        }
        let filename = await exportExcel(path, headers, items);
        return {
            data: filename,
            message: 'Export file successfully',
        };
    }
}
