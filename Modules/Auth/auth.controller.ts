import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { sendRespones } from "../../Shared/utils/sendResponse";
import { AuthService } from "./auth.service";
import { Request , Response } from 'express'

export class AuthController{
    private authService: AuthService

    constructor(){
        this.authService= new AuthService()
    }

    public login = async(req:Request,res:Response)=>{

        const dto = req.body
        const {token , user} = await this.authService.login(dto)

        sendRespones(res,StatusCode.OK,{
            success:true,
            data:{token,user}
        })
    }
}