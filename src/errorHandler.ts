import { Request, Response, NextFunction } from "express";

class CustomError extends Error {

    status: number | number[]
    messages: string | string[]
    constructor(messages: string | string[], status: number) {
        super()
        this.messages = messages
        this.status = status
    }


}


const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.status === 400 && Array.isArray(err.messages)) {
        req.flash('error', err.messages);
        res.redirect('back');
    } else {
        err.status = err.status || 500;
        err.message = String(err.messages) || 'Internal Server Error';
        req.flash('error', err.message);
        res.redirect('back');
    }
};


export { errorHandler, CustomError }