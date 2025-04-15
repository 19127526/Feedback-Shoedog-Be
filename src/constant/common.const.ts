

export enum DB_TYPE {
    DB_CONTENT_READ = 'DB_CONTENT_READ',
    DB_CONTENT_WRITE = 'DB_CONTENT_WRITE',
    DB_MEMBER_READ = 'DB_MEMBER_READ',
    DB_MEMBER_WRITE = 'DB_MEMBER_WRITE',
}

export enum REDIS_TYPE {
    REDIS_DATA = 'redis_data',
    REDIS_MEMBER = 'MEMBER',
    REDIS_RECOMMEND = 'redis_recommend',
    REDIS_VMX = 'redis_vmx',
    REDIS_CCU = 'redis_ccu',
    REDIS_PROMOTION = 'redis_promotion',
    REDIS_PROMOTION_DATA = 'redis_promotion_data',
    REDIS_SOCKET_IO = 'redis_socket_io',
    REDIS_GATEWAY = 'redis_gateway',
}

export enum ACCOUNT_DEFAULT {
    PRODUCT_ID = 87,
    USER_TERM_ID = 303,
    DEVICE_TYPE = 127,
    MYTV_ISDN_TYPE = 2,
    AREA_CODE = 'ECO',
    ANONYMOUS_PRODUCT_ID = 101,
    ANONYMOUS_USER_TEAM = 351,
}




export enum CONSTANT_V2 {
    EVENT_CONNECTION = 'connection',
    EVENT_DISCONNECT = 'disconnect',
    EVENT_SEND_RESULT_FEEDBACK = 'send_feedback',
}


export const EMIT_TYPE = {
    RESULT_CONNECT:`result_connect`,
    RESULT_SEND_NOTI_FEEDBACK: 'result_send_noti_feedback'
}
