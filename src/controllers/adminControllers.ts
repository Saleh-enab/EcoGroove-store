import { Request, Response } from "express";

const getHome = (req: Request, res: Response) => {
    res.send("Hello From Admin page")
}

const addPage = (req: Request, res: Response) => {
    const title = ""
    const slug = ""
    const content = ""

    res.render('./admin/addPage', {
        title,
        slug,
        content
    })
}

export { getHome, addPage }