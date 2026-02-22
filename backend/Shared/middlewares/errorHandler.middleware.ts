import { AppError } from "../errors/app.error"
import { Response , Request , NextFunction } from "express"
import { sendRespones } from "../utils/sendResponse"

export const errorHandler=(
    err:AppError,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    if(err){
        return sendRespones(res,err.status,{
            success:false,
            message:err.message,
            error:err.errors
        })
    }
    next()
}