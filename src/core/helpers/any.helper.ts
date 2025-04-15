import { v1 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Socket } from 'socket.io';
import { formatDateToString, getMTime } from './datetime.helper';
import { isEmptyString } from './string.helper';
import { FileCache } from './file.helper';
import { find, replace } from 'lodash';
import { isEmptyArray } from './array.helper';
import * as CommonConstant from '../constants/common.const';
export const isset = (key) => Boolean(typeof key !== 'undefined');




export const createFolderLog = (folderLog) => {
    let logsDirectory = path.resolve('./public');
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }
    logsDirectory = path.resolve('./public/logs');
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }
    logsDirectory = path.resolve(`./public/logs/${folderLog}`);
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }
    return logsDirectory
}

export const handleUUID = (serverAddress) => {
    const genStr = v1().substring(0, 10);
    const uid = serverAddress + ' - ' + genStr;
    return JSON.stringify({ uid });
};


export const writeLogEventSocket = (socket: Socket, data, eventName, responseBody) => {
    try {
        const clientIP = socket?.conn?.remoteAddress;
        const logsDirectory = createFolderLog('event');
        const accessLogStream = fs.createWriteStream(path.join(logsDirectory, `info-${formatDateToString('YYYY-MM-DD-HH')}.log`), { flags: 'a' });
        const start = getMTime();
        const serverAddress = socket?.handshake?.address;
        // uuid
        const reqUUID = handleUUID(serverAddress);
        const requestMessage = `${eventName} ${data} ${reqUUID}`;

        const resUUID = handleUUID(serverAddress);
        const serverData = {
            IP_SERVER: serverAddress,
            time_exec: Math.round((getMTime() - start) * 1000),
            ser_time: formatDateToString('YYYY-MM-DD HH:mm:ss'),
            ip_client: clientIP,
        };
        const resData = {...responseBody, ...serverData };
        const responseMessage = `${eventName} ${JSON.stringify(resData)} ${resUUID}`;

        const logData =
            `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] local.INFO: ${requestMessage}\n` +
            `[${formatDateToString('YYYY-MM-DD HH:mm:ss')}] local.INFO: ${responseMessage} \n`;

        accessLogStream.write(logData);
    } catch (error) {
        console.log('writeLogEventSocket error: ', error.message);
    }
}



export const getClientIP = (req) => req.ip;

export const anyToString = (data) => {
    if (typeof data === 'object') {
        const objectData = {};
        Object.getOwnPropertyNames(data).forEach((key) => {
            objectData[key] = data[key];
        });
        return JSON.stringify(objectData);
    } else {
        return JSON.stringify(data);
    }
};

export const getSystemConfigByKey = (key: string) => {
    try {
        const file = new FileCache();
        file.setPath('config');
        const aConfig = file.getJsonObjectFromFile(CommonConstant.COMMON.SYSTEM_CONFIG);
        let aResult = null;
        if (!isEmptyArray(aConfig)) {
            aResult = find(aConfig, (item) => item.CONFIG_KEY === key);
        }
        return aResult;
    } catch (error) {
        console.log('getSystemConfigByKey.error', error.message);
        return null;
    }
};

export const getBaseUrlStatic = (req) => {
    const http = process.env.NODE_ENV === 'local' ? 'http' : 'https';
    return `${http}://${req.hostname}${process.env.BASE_URL}/static`;
};

/**
 * @param string image Đường dẫn hình ảnh
 * @param int posterLayout loại hình : Đứng, ngang, ...
 */
// Poster đứng: 242x364
// Poster ngang: 345x194
export const changeFolderImage = (image, posterLayout) => {
    if (isEmptyString(image)) {
        return image;
    }
    if (parseInt(posterLayout) === 3 && image.indexOf('242x364') === -1) {
        if (image.indexOf('310x465') !== -1) {
            return replace(image, '/vimages/310x465/', '/vimages/242x364/');
        } else if (image.indexOf('184x277') !== -1) {
            return replace(image, '/vimages/184x277/', '/vimages/242x364/');
        }
        return replace(image, '/vimages/', '/vimages/242x364/');
    } else if (parseInt(posterLayout) === 4 && image.indexOf('345x194') === -1) {
        if (image.indexOf('400x225') !== -1) {
            return replace(image, '/vimages/400x225/', '/vimages/345x194/');
        } else if (image.indexOf('285x160') !== -1) {
            return replace(image, '/vimages/285x160/', '/vimages/345x194/');
        }
        return replace(image, '/vimages/', '/vimages/345x194/');
    } else if (parseInt(posterLayout) === 1 && image.indexOf('1920x1080') === -1) {
        return replace(image, '/vimages/', '/vimages/1920x1080/');
    } else return image;
};

