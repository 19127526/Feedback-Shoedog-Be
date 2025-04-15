export const responseMsg = {
    SUCCESS: {
        CODE: 0,
        MESSAGE: 'Thành công!',
    },
    FAILED: {
        CODE: -1,
        MESSAGE: 'Thất bại!',
    },
    DATA_INVALID: {
        CODE: 100,
        MESSAGE: 'Không tìm thấy nội dung!',
    },
    SERVER_ERROR: {
        CODE: 500,
        MESSAGE: 'Có lỗi khi kết nối đến máy chủ. (500)',
    },
    REQUEST_FAILED: {
        CODE: 400,
        MESSAGE: 'Có lỗi khi kết nối đến máy chủ. (400)',
    },
    CONFIG_DB_INVALID: {
        CODE: -3,
        MESSAGE: 'Config DB invalid!',
    }
};
