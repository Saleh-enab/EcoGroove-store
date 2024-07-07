import { Request, Response } from "express";

const getHome = (req: Request, res: Response) => {
    res.render('index', { title: "Home" })
}

export { getHome }