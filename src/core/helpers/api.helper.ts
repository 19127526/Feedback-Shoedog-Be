import axios, { AxiosRequestConfig } from 'axios';
import { request } from 'undici';
import * as https from 'https';
import * as qs from 'qs';

export const baseApi = async (method: string, url: string, token = null, params = null, cookie = null, type = 'form', timeout = 5000) => {
    // contentType: form or json
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        let contentType = 'application/x-www-form-urlencoded';
        if (type === 'json') {
            contentType = 'application/json';
            // application/json; charset=utf-8
        }
        const options: AxiosRequestConfig = {
            method: method,
            headers: { 'content-type': contentType, Cookie: cookie, 'Set-Cookie': cookie },
            url: url,
            timeout: timeout, // Wait for ms
            httpsAgent,
        };
        if (params) {
            // console.log('paramSMS',params);
            options.data = qs.stringify(params);
            if (type === 'json') {
                options.data = params;
            }
        }
        if (token) {
            options.headers = { 'content-type': contentType, Authorization: 'Bearer ' + token, Cookie: cookie, 'Set-Cookie': cookie };
        }
        const res = await axios(options);
        if (res.headers['set-cookie']) {
            res.data.cookie = res.headers['set-cookie'][0];
        }
        return res.data || null;
    } catch (error) {
        console.log('url: ', url);
        console.log('baseApi.error: ', error.message);
        console.log('baseApi.error res: ', error.response);
    }
    return null;
};

export const baseApiV2 = async (method: string, url: string, token = null, params = null, cookie = null, type = 'form', timeout = 5000) => {
    // contentType: form or json
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        let contentType = 'application/x-www-form-urlencoded';
        if (type === 'json') {
            contentType = 'application/json';
            // application/json; charset=utf-8
        }
        const options: AxiosRequestConfig = {
            method: method,
            headers: { 'content-type': contentType, Cookie: cookie, 'Set-Cookie': cookie },
            url: url,
            timeout: timeout, // Wait for ms
            httpsAgent,
        };
        if (params) {
            // console.log('paramSMS',params);
            options.data = qs.stringify(params);
            if (type === 'json') {
                options.data = params;
            }
        }
        if (token) {
            options.headers = { 'content-type': contentType, Authorization: token, Cookie: cookie, 'Set-Cookie': cookie };
        }
        console.log('url: ', url);
        console.log('options: ', options);
        const res = await axios(options);
        if (res.headers['set-cookie']) {
            res.data.cookie = res.headers['set-cookie'][0];
        }
        return res.data || null;
    } catch (error) {
        console.log('url: ', url);
        console.log('baseApi.error: ', error.message);
        console.log('baseApi.error res: ', error.response);
    }
    return null;
};

export const callApi = async (method: string, url: string, token = null, params = null, cookie = null, type = 'form', timeout = 5000): Promise<any> => {
    try {
        let contentType = 'application/x-www-form-urlencoded';
        if (type === 'json') {
            contentType = 'application/json';
        }
        let headers: any = { 'content-type': contentType };

        if (cookie) {
            headers = { 'content-type': contentType, Cookie: cookie, 'Set-Cookie': cookie };
        }
        const options: any = { method, headers, bodyTimeout: timeout };
        if (params) {
            options.body = qs.stringify(params);
            if (type === 'json') {
                options.body = JSON.stringify(params);
            }
        }
        if (token) {
            options.headers = { 'content-type': contentType, Authorization: 'Bearer ' + token, Cookie: cookie, 'Set-Cookie': cookie };
        }
        console.log('options: ', options);
        const { body } = await request(url, options);
        const data = await body.json();
        console.log('callApi data: ', data);
        return data;
    } catch (error) {
        console.log('url: ', url);
        console.log('callApi.error: ', error.message);
    }
    return null;
};

