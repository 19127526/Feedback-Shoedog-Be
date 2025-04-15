export const PLATFORM = {
    WEB_PLATFORM: 'WEBAPP',
    ANDROID_PHONE_PLATFORM: 'ANDROID_PHONE',
    IOS_PHONE_PLATFORM: 'IOS',
    HTML5_PLATFORM: 'HTML5',
    ANDROID_PLATFORM: 'ANDROID_TV',
};

export const COMMON = {
    SYSTEM_CONFIG: 'system_config',
    REDIS_SERVER_AREA: 'redis_server',
    ADNETWORK_FOLDER: 'adnetwork',
    ADNETWORK_FILENAME: 'adnetwork',
    PRODUCT_DEVICE: 'product_device',
    KEY_CACHE_DEVICE_MODEL: 'key_cache_device_model',
    KEY_CACHE_LOW_LATENCY: 'key_cache_low_latency',
    KEY_CACHE_ABR_CONFIG: 'key_cache_abr_config',
};

export const URL = {
    VERIFY_PASSWORD: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=',
    GET_MOVIE: '/offica/api/movie/action?_f=9999&s=',
    GET_MUSIC_MP3: '/offica/api/movie/action?_f=9999&s=',
    GET_CHANNEL: '/offica/api/tv/action?_f=7777&c=',
    GET_TVOD: '/offica/api/tv/action?_f=4444&c=',
    GET_TIMESHIFT: '/offica/api/tv/action?_f=5555&c=',
    TOKEN_MYTVNET:
        'ngVwecjCavZvcbupvAfpsZpsoGbprsv8ZqOCEP3K1SEHZZwxJe/DwEJ6MhqARo7zkGukcTmqFdvjdgaNUhTRiXVwvn5FmsDLoHehDQJUqkb7jFQrtqSbP5F0/5yZjZTtxo8EphtbE5b0bRIiMVM78w==',
};

export enum REDIS_TYPE {
    REDIS_DATA = 'redis_data',
    REDIS_MEMBER = 'redis_member_',
    REDIS_RECOMMEND = 'redis_recommend',
    REDIS_VMX = 'redis_vmx',
    REDIS_CCU = 'redis_ccu',
    REDIS_PROMOTION = 'redis_promotion',
    REDIS_PROMOTION_DATA = 'redis_promotion_data',
}

export enum KEY_REDIS {
    KEY_REDIS_CCU_PLAY_CONTENT = 'PLAY_CONTENT_', //check play ccu content
}

export const FILE_NAME = {
    CONTENT_TYPE_SEARCH: 'content_type_search',
};
