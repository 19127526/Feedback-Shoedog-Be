import { forEach, isEmpty } from 'lodash';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as Excel from 'exceljs';
import { config } from '../config/config';

export const exportExcel = async (filePath: string, headers: any, data: any, headInfo: any[] = []) => {
    if (isEmpty(data)) {
        throw new HttpException('no data for download', HttpStatus.BAD_REQUEST);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = headers;
    if (headInfo.length > 0) {
        let columnLetter = '';
        let setHeaderLenght = headers.length;
        // Lấy chuỗi tương ứng với column từ header.lenght
        while (setHeaderLenght > 0) {
            const remainder = (setHeaderLenght - 1) % 26;
            columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
            setHeaderLenght = Math.floor((setHeaderLenght - remainder) / 26);
        }
        // kết quả columnLetter (example 1-->A, 2-->B, 28-->AB, 53-->BA, 737-->ABI) dùng đánh dấu cột merge đến
        worksheet.duplicateRow(1, headInfo.length, false);
        // duplicate Row đầu đến số lượng mảng info đầu +1.
        for (let i = 0; i < headInfo.length; i++) {
            // Gán các giá trị string vào từng hàng
            worksheet.getRow(i + 1).values = [headInfo[i]];
            // Gộp sau khi gán
            worksheet.mergeCells(`A${i + 1}:${columnLetter}${i + 1}`);
        }
        // đẩy giá trị header
        // worksheet.getRow(headInfo.length + 1).values = []
    }
    for (let rowItem in data) {
        worksheet.addRow(data[rowItem]);
    }
    workbook.xlsx
        .writeFile(process.cwd() + filePath)
        .then(() => {
            console.log('ghi file thành công');
        })
        .catch((error) => {
            console.log('error', error);
            throw new HttpException('data is invalid', HttpStatus.BAD_REQUEST);
        });
    const updatedPath = filePath.replace('/public/', '');
    let filename = `${config().appDomain}api/v1/socket/${updatedPath}`;
    console.log('filename', filename);
    return filename;
};
