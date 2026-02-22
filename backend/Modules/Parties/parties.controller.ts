import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { PartiesError } from "../../Shared/utils/constant";
import { sendRespones } from "../../Shared/utils/sendResponse";
import { PartiesService } from "./parties.service";
import { Request, Response } from "express";

export class PartiesController {

    private partiesService: PartiesService

    constructor() {
        this.partiesService = new PartiesService()
    }

    public createParty = async (req: Request, res: Response) => {

        const dto = req.body

        const { message } = await this.partiesService.createPatries(dto)

        sendRespones(res, StatusCode.OK, {
            success: true,
            message
        })
    }

    public getAllParties = async (req: Request, res: Response) => {

        const { parties } = await this.partiesService.getAllParties()

        sendRespones(res, StatusCode.OK, {
            success: true,
            data: parties
        })
    }

    public getPartyById = async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id || isNaN(Number(id)))
            sendRespones(res, StatusCode.NOT_FOUND, {
                success: false,
                message: PartiesError.INVALID_ID
            })
        const { party } = await this.partiesService.getPartyById(Number(id))
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: party
        })
    }
}