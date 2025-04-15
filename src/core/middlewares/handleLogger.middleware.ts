import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import { v1 } from 'uuid';
import { isString } from 'lodash';
import { createFolderLog, getClientIP, handleUUID, isset } from '../helpers/any.helper';
import { getMTime, formatDateToString } from '../helpers/datetime.helper';

export const monoLogger = (req, res, payload: any, next: () => void) => {
    try {
        const logsDirectory = createFolderLog('api');
        if (req.url.startsWith(process.env.BASE_URL) &&
            !req.url.startsWith(`${process.env.BASE_URL}/cache/`) &&
            !req.url.startsWith(`${process.env.BASE_URL}/api-docs`) &&
            !req.url.startsWith(`${process.env.BASE_URL}/view-log`)
        ) {
            const accessLogStream = fs.createWriteStream(path.join(logsDirectory, `info-${formatDateToString('YYYY-MM-DD-HH')}.log`), { flags: 'a' });
            let logWritten = false;
            const start = getMTime();
            if (!logWritten) {
                const originalStatus = res.statusCode;

                const originalStatusText = http.STATUS_CODES[originalStatus];
                const responseBody = isString(payload) ? JSON.parse(payload) : payload;
                if (isset(responseBody.status) && responseBody.status !== 429) {
                    const fullUrl = req.protocol + '://' + req.hostname + req.url;
                    const aData = JSON.stringify([]);
                    const serverAddress = req.socket.localAddress || req.headers['x-forwarded-for'];
                    // uuid
                    const reqUUID = handleUUID(serverAddress);
                    const reqData = { ...req.auth, ...req.query, ...req.body, ...req.headers };

                    const requestMessage = `${req.method} ${fullUrl} ${new URLSearchParams(reqData).toString()} ${aData} ${reqUUID}`;

                    const resUUID = handleUUID(serverAddress);
                    const clientIp = getClientIP(req);
                    const serverData = {
                        IP_SERVER: serverAddress,
                        time_exec: Math.round((getMTime() - start) * 1000),
                        ser_time: formatDateToString('YYYY-MM-DD HH:mm:ss'),
                        ip_client: clientIp,
                    };
                    const resData = { ...responseBody, ...serverData };

                    const responseMessage = `${originalStatus} ${originalStatusText} ${JSON.stringify(resData)} ${aData} ${resUUID}`;

                    const logData =
                        `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] local.INFO: ${requestMessage}\n` +
                        `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] local.INFO: ${responseMessage} \n`;

                    accessLogStream.write(logData);
                    logWritten = true;
                }
            }
        }
    } catch (error) {
        console.log('monoLogger error: ', error.message);
    }
    return next();
};
