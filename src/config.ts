import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer';
import path from 'path'
import fs from 'fs'
import { CustomError } from './errorHandler'
import mongoose from 'mongoose';
type CustomRequest = Request & { productId?: string }
dotenv.config();

const port = Number(process.env.PORT || 3000)
const dbURI = process.env.mongoURI

const mkdir = (path: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const rmdir = (path: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.rm(path, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const moveFiles = (filePath: string, newPath: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.rename(filePath, newPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const readFile = (path: string) => {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(path, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const writeFile = (path: string, content: Buffer) => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const readDir = (dirPath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        })

    })
}

const createImagesFolders = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const productId = String(new mongoose.Types.ObjectId());
    const productPath = path.join(__dirname, '../public/images', productId)
    const galleryPath = path.join(__dirname, '../public/images', productId, '/gallery')
    const galleryThumb = path.join(__dirname, '../public/images', productId, '/gallery/thumb')
    await mkdir(productPath)
    await mkdir(galleryPath)
    await mkdir(galleryThumb)
    req.productId = productId
    next();
}

const storage = multer.diskStorage({
    destination: (req: CustomRequest, file, cb) => {
        const id = req.productId || req.params.id
        cb(null, path.join(__dirname, `../public/images/${id}`))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const galleryStorage = multer.diskStorage({
    destination: (req: CustomRequest, file, cb) => {
        const id = req.productId || req.params.id
        cb(null, path.join(__dirname, `../public/images/${id}/gallery`))
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
        if (err !== undefined && err.messages === "only .jpg, .jpeg, .png files allowed") {
            next(err);
        } else if (err) {
            next(new CustomError(err.message, 500));
        } else {
            next();
        }
    });
};

const uploadGalleryMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
    const uploadSingle = upload.array('file');
    uploadSingle(req, res, (err) => {

        console.log(req.body)
        if (err !== undefined && err.messages === "only .jpg, .jpeg, .png files allowed") {
            next(err);
        } else if (err) {
            next(new CustomError(err.message, 500));
        } else {
            next();
        }
    });
};

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', "User must be logged-in");
        res.redirect('/users/login');
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user && req.session.user.admin) {
        next();
    } else {
        req.flash('error', "Only admins can access this page");
        res.redirect('/products');
    }
}

export { port, dbURI, uploadMiddleware, uploadGalleryMiddleware, mkdir, rmdir, createImagesFolders, moveFiles, readFile, writeFile, readDir, isAuth, isAdmin }