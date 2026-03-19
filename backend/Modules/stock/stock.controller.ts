import { StockService } from "./stock.service"
import { Request, Response } from "express"
import { sendRespones } from "../../Shared/utils/sendResponse"
import { StatusCode } from "../../Shared/enums/statusCode.enum"

export class StockController {
    private stockService: StockService
    constructor() {
        this.stockService = new StockService()
    }

    public createStock = async (req: Request, res: Response) => {
        const stock = await this.stockService.createStock(req.body)
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: stock,
        })
    }

    public getAllStock = async (req: Request, res: Response) => {
        const stock = await this.stockService.getAllStock()
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: stock,
        })
    }

    public getStockById = async (req: Request, res: Response) => {
        const stock = await this.stockService.getStockById(Number(req.params.id))
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: stock,
        })
    }
}