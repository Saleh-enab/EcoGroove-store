import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer';
import path from 'path'
import { CustomError } from './errorHandler'
dotenv.config();

const port = Number(process.env.PORT || 3000)
const dbURI = process.env.mongoURI

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})


// File filter to allow only specific file types
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
        cb(null, true); // Accept file
    } else {
        cb(new CustomError("only .jpg, .jpeg, .png files allowed", 400));  // Reject file
    }
};

const upload = multer({ storage, fileFilter })


const uploadMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, (err) => {
        if (err.messages === "only .jpg, .jpeg, .png files allowed") {
            next(err);
        } else if (err) {
            next(new CustomError("An error occurred while uploading the file.", 500));
        } else {
            next();
        }
    });
};

export { port, dbURI, uploadMiddleware }