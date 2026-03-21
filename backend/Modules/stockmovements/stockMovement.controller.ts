import { Request, Response } from "express";
import { StockMovementService } from "./stockMovement.service";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { sendRespones } from "../../Shared/utils/sendResponse";

export class StockMovementController {
    private stockMovementService: StockMovementService;
    constructor() {
        this.stockMovementService = new StockMovementService();
    }

    public registerMovement = async (req: Request, res: Response) => {
        const result = await this.stockMovementService.registerMovement(req.body);
        sendRespones(res, StatusCode.CREATED, {
            success: true,
            data: result
        });
    }

    public getAllStockMovements = async (req: Request, res: Response) => {
        const result = await this.stockMovementService.getAllStockMovements();
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: result
        });
    }
}
