import {
    split,
} from 'lodash';
import { isset, getClientIP } from './any.helper';
import { isEmptyString } from './string.helper';
import { baseApi } from './api.helper';

export const getDomainCDN = (req = null) => {
    try {
        const ip = getClientIP(req);
        const ips = split(ip, '.');
        const iIp = parseInt(ips[0]);
        const iIp2 = parseInt(ips[0]);

        if ((iIp === 10 && iIp2 === 0) || (iIp === 172 && iIp2 === 16) || (iIp === 192 && iIp2 === 168)) {
            return process.env.CDN_DOMAIN_LOCAL;
        } else {
            return process.env.CDN_DOMAIN_PUBLIC;
        }
    } catch (error) {
        console.log('getDomainCDN.error', error.message);
        return null;
    }
};

export const getInfoCDN = async (areaCode = 'ECO', req = null) => {
    try {
        if (areaCode === 'TS' || areaCode === 'VAS' || isEmptyString(areaCode)) {
            areaCode = 'ECO';
        }
        const url = getDomainCDN(req) + '/?location=' + areaCode + '&service=webapp&ip=' + getClientIP(req);
        const oResult = await baseApi('POST', url, '', []);
        return oResult;
    } catch (error) {
        console.log('getInfoCDN.error', error.message);
        return null;
    }
};

export const getIpCDN = async (areaCode = 'ECO', req = null) => {
    try {
        const oResult = await getInfoCDN(areaCode, req);
        if (isset(oResult.node_addr) && !isEmptyString(oResult.node_addr)) {
            return (isset(oResult.scheme) ? oResult.scheme : 'https') + '://' + oResult.node_addr;
        }
        return null;
    } catch (error) {
        console.log('getIpCDN.error', error.message);
        return null;
    }
};
