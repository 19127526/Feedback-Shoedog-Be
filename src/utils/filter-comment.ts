import * as fs from 'fs/promises';
import * as path from 'path';
const stringSimilarity = require('string-similarity');

// Đường dẫn đến các file danh sách từ nhạy cảm
const sensitiveFiles = ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt'];

/**
 * Tạo regex từ từ nhạy cảm, cho phép tìm kiếm các biến thể hoặc các kí tự đặc biệt
 * @param {string} word - Từ nhạy cảm
 * @returns {RegExp} - Biểu thức chính quy tương ứng với từ nhạy cảm
 */
function createRegexForSensitiveWord(word) {
    const escapedWord = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape các ký tự đặc biệt
    // Thêm sự linh động để cho phép bỏ qua dấu cách, dấu gạch nối và các ký tự có dấu tiếng Việt
    return new RegExp(
        // escapedWord
        //     .replace(/\s+/g, '\\s*') // Thay thế dấu cách với \\s* cho phép nhiều hoặc không có khoảng trắng
        //     .replace(/-/g, '\\s*') // Thay thế dấu gạch nối với \\s* để cho phép gạch nối hoặc không
        //     .replace(/[àáạảãàâăđèéẹẻẽêềểễèìíịỉĩìòóọỏõôốồổộơờởỡởùúụủũưừứựửữưỳýỷỹỵỳ]/gi, '[a-z]*'), // Đặt lại các chữ có dấu tiếng Việt linh hoạt
        // 'i',
        escapedWord
            .split('')
            .map((char) => `[${char.toLowerCase()}${char.toUpperCase()}]+`) // Ký tự lặp
            .join('[\\W_]*'), // Chèn ký tự bất kỳ
        'gi',
    ); // Không phân biệt chữ hoa và chữ thường
}

function validateMatchedWord(match, originalWord) {
    // const repeatPattern = new RegExp(`(.)\\1{${maxRepeats},}`, "gi");
    // if (repeatPattern.test(match)) return false;

    const similarity = stringSimilarity.compareTwoStrings(match, originalWord);
    return similarity >= 0.8; // Độ tương đồng tối thiểu
}

/**
 * Kiểm tra từ nhạy cảm trong câu chat
 * @param {string} message - Câu chat người dùng
 * @param {string} filePath - Đường dẫn tới file danh sách từ nhạy cảm
 * @returns {Promise<string|null>} - Trả về từ nhạy cảm nếu tìm thấy, null nếu không
 */
async function checkSensitiveWords(message, filePath) {
    try {
        const fullPath = path.resolve('./') + '/public/cache/filter/' + filePath;
        let sensitiveWords;
        try {
            const data = await fs.readFile(fullPath, { encoding: 'utf8' });
            sensitiveWords = JSON.parse(data);
        } catch (error) {
            sensitiveWords = [];
        }

        // Tạo regex để kiểm tra từng từ
        for (const word of sensitiveWords) {
            // Kiểm tra từ có tồn tại trong câu chat
            const regex = createRegexForSensitiveWord(word); // Tạo regex từ từ nhạy cảm
            if (regex.test(message)) {
                return word; // Trả về từ nhạy cảm nếu khớp
            }
            if (validateMatchedWord(word, message)) {
                console.log(word);

                return word; // Trả về từ nhạy cảm
            }
        }
        return Promise.reject(); // Rejected khi không có từ nhạy cảm
    } catch (error) {
        console.error(`Lỗi khi đọc file: ${filePath}`, error);
        return Promise.reject(); // Rejected khi có lỗi xảy ra
    }
}

/**
 * Lọc câu chat với 3 file song song
 * @param {string} message - Câu chat người dùng
 * @param {string[]} filePaths - Danh sách file từ nhạy cảm
 * @returns {Promise<string|null>} - Trả về từ nhạy cảm hoặc null nếu không có
 */
export const filterMessage = async (message) => {
    const tasks = sensitiveFiles.map((filePath) => checkSensitiveWords(message, filePath));

    // Sử dụng Promise.any để trả về kết quả đầu tiên không bị lỗi
    try {
        const results = await Promise.any(tasks);
        // const found = results.find(result => result.status === 'fulfilled' && result.value !== null);
        // Nếu tìm thấy kết quả hợp lệ (từ nhạy cảm), trả về nó
        //  if (found) {
        //     console.log('Từ nhạy cảm tìm thấy:', found);
        //     return found;
        // }

        return results;
    } catch {
        return null; // Không có từ nhạy cảm nào
    }
};
