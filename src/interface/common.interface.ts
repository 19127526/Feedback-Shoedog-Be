export declare type PlayInfo = {
    schedule_type?: number,
    schedule_id?: number,
    audio_id?: number,
    link?: string,
    position?: number,
}

export declare type RequestDefault = {
    box_id?: string,
    app_version?: string,
    manufacture_id?: string,
    last_login?: Date | string | null,
    last_disconnect?: Date | string | number,
    last_update?: Date | string | null,
    area_id?: number,
    online_status?: number,
    district_id?: number,
    ward_id?: number,
    region_id?: number,
    android_box_id?: number,
    device_manu?: string,
    device_model?: string,
    os_version?: string,
    mac_address?: string,
    current_volume?: number,
    max_volume?: number,
    socket_id?: string,
    play_status?: string | null, //mặc định để null, khi play box sẽ gọi event update lại field này (play/stop/error)
    playing_info?: PlayInfo | null,
    [key: string]: any;
}

export declare type RequestEvent = {
    box_id?: string,
    action?: string,
    schedules?: any,
    data?: any,
    event?: string,
}