import {CreateFeedbackDto} from "../dto/create-feedback.dto";


export interface ISocialService {
    createFeedback(body: CreateFeedbackDto): Promise<any>;

    createLogSocket(socketId: string): Promise<any>;
    removeLogSocket(socketId: string): Promise<any>;
    checkLogSocket(socketId: string): Promise<any>;
}
