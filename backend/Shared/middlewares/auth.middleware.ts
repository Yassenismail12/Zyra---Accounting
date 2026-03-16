import { Request, Response , NextFunction } from "express"
import { UserRoles } from "../enums/userRoles.enum"
import jwt, { JwtPayload } from "jsonwebtoken"
import { AppError } from "../errors/app.error"
import { AuthErrors, UserError } from "../utils/constant"
import { StatusCode } from "../enums/statusCode.enum"

interface UserJWTPayload extends JwtPayload{
    id:number,
    role:UserRoles
}

interface userRequset extends Request{
    user?:UserJWTPayload
}

export const auth=async(
    req:userRequset,
    res:Response,
    next:NextFunction
)=>{

    const [type , token] = req.headers.authorization?.split(" ") ?? []

    if(token && type==='Bearer')
    {
        try{
            const payload= jwt.verify(token,process.env.JWT_SECRET! ) as UserJWTPayload

            const result = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [payload.id]
            );

            const user = result.rows[0];

            if(!user)
                throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND)

            req.user=payload
            next()
        }catch(err){
            throw new AppError(AuthErrors.INVALID_TOKEN, StatusCode.UNAUTHORIZED)
        }
    }else{
        throw new AppError(AuthErrors.NO_TOKEN_PROVIDED,StatusCode.UNAUTHORIZED)
    }
}


export const authRoles=(
    ...roles:Array<UserRoles>
)=>async(
    req:userRequset,
    res:Response,
    next:NextFunction
)=>{
    if(req.user && !roles.includes(req.user.role))
        throw new AppError(AuthErrors.ACCESS_DENIED,StatusCode.FORBIDDEN)
    next()
}