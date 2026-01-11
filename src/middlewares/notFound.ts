import { date } from "better-auth/*";
import { Request, Response } from "express";


const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: "route not found",
    path: req.originalUrl, 
    date: Date()
  });
}

export default notFound
