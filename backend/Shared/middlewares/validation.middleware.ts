import { Request,Response ,NextFunction } from 'express'
import  {ZodObject,ZodRawShape,ZodError} from 'zod'
import { AppError } from '../errors/app.error'
import { ValidationError } from '../utils/constant'
import { StatusCode } from '../enums/statusCode.enum'

export const validate= (
    schema:ZodObject<ZodRawShape>
)=>(
    req:Request,res:Response,next:NextFunction
)=>{
    try{
        schema.parse({
            body:req.body,
            params:req.params,
            query:req.query
        })
        next()
    }catch(err){
        if(err instanceof ZodError){
            throw new AppError(
                ValidationError.VALIDATION_ERROR,
                StatusCode.BAD_REQUEST,
                err.issues
            )
        }
        next(err)
    }
}