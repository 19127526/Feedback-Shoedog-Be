import * as CryptoJS from 'crypto-js';

const HASH_PASSWORD = {
    HASH_SECRET_KEY: 'nFgAIwYQumyveJTb',
    HASH_SECRET_IV: 'bTJevymuQYwIAgFn',
    HASH_PREFIX: '!@#bXVsdGlwYXNz123-',
};


//vo
export const encryptString = (text,
                              {
                                  hashPrefix,
                                  hashSecretKey,
                                  hashSecretIV,
                              } = {
                                  hashPrefix: HASH_PASSWORD.HASH_PREFIX,
                                  hashSecretKey: HASH_PASSWORD.HASH_SECRET_KEY,
                                  hashSecretIV: HASH_PASSWORD.HASH_SECRET_IV,
                              }) => {
    const key = CryptoJS.enc.Utf8.parse(hashSecretKey);
    const iv = CryptoJS.enc.Utf8.parse(hashSecretIV);
    const encrypt = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding,
    }).toString();
    return hashPrefix + encrypt;
};

//ra
export const decryptString = (text,
                              {
                                  hashPrefix,
                                  hashSecretKey,
                                  hashSecretIV,
                              } = {
                                  hashPrefix: HASH_PASSWORD.HASH_PREFIX,
                                  hashSecretKey: HASH_PASSWORD.HASH_SECRET_KEY,
                                  hashSecretIV: HASH_PASSWORD.HASH_SECRET_IV,
                              }) => {
    if (text.indexOf(hashPrefix) !== -1) {
        text = text.replace(hashPrefix, '');
        const key = CryptoJS.enc.Utf8.parse(hashSecretKey);
        const iv = CryptoJS.enc.Utf8.parse(hashSecretIV);
        const bytes = CryptoJS.AES.decrypt(text, key, {
            iv: iv,
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.NoPadding,
        });
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    return text;
};
