import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { sendRespones } from "../../Shared/utils/sendResponse";
import { PartiesService } from "./parties.service";
import { Request , Response } from "express";

export class PartiesController{

    private partiesService: PartiesService

    constructor(){
        this.partiesService= new PartiesService()
    }

    public createParty=async(req:Request,res:Response)=>{

        const dto= req.body

        const {message} = await this.partiesService.createPatries(dto)

        sendRespones(res,StatusCode.OK,{
            success:true,
            message
        })
    }

    public getAllParties=async(req:Request,res:Response)=>{

        const {parties}= await this.partiesService.getAllParties()

        sendRespones(res,StatusCode.OK,{
            success:true,
            data:parties
        })
    }
}