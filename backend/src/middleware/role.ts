import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";

export function RoleMiddleware(req: AuthRequest, res: Response, next: NextFunction)
{
    if(req.user?.role !== "SELLER"){
        res.status(403).json({message: "Vous n'êtes pas autorisé"})
        return
    }

    next()
}