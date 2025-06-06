export const isEmptyArray = (data) => Boolean(!data || data.constructor !== Array || !data.length);

export const paginate = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
};
