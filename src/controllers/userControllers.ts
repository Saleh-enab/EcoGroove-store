import { Request, Response } from "express";

const getHome = (req: Request, res: Response) => {
    res.send("Hello From Users page")
}

export { getHome }