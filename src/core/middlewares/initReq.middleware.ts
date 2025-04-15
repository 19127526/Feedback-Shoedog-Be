import { isset } from '../helpers/any.helper';

export const initRequestMiddleware = (req, res, next) => {
    if (!isset(req.body)) {
        req.body = {};
    }
    next();
};
