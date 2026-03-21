
import { Response } from "express"
import { StatusCode } from '../enums/statusCode.enum'
interface ResponsePayload{
    success:boolean,
    message?:string | null,
    data?:any,
    error?:any
    
}

export const sendRespones=(
    res:Response,
    status:StatusCode,
    payload:ResponsePayload
)=>{
    res
    .status(status || 500)
    .json({
        ...payload
    })
}