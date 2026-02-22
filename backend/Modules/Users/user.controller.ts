import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { sendRespones } from "../../Shared/utils/sendResponse";
import { UserService } from "./user.service";
import { Request , Response } from "express";

export class UserController{
    private userService: UserService

    constructor(){
        this.userService= new UserService()
    }

    public createUser= async(req:Request,res:Response)=>{
        const dto = req.body

        const {message}= await this.userService.createUser(dto)

        sendRespones(res,StatusCode.OK,{
            success:true,
            message:message
        })
    }

    public getAllUsers=async(req:Request,res:Response)=>{

        const {users} =await this.userService.getAllUsers()

        sendRespones(res,StatusCode.OK,{
            success:true,
            data:users
        })
    }
}