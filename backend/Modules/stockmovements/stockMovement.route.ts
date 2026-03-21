import { Router } from "express";
import { StockMovementController } from "./stockMovement.controller";
import { validate } from "../../Shared/middlewares/validation.middleware";
import { createMovementDTO } from "./dto/createmovement.dto";

export default class StockMovementRouter {
    public router = Router();
    private stockMovementController: StockMovementController;

    constructor() {
        this.stockMovementController = new StockMovementController();
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.post("/stock-movements",
            validate(createMovementDTO),
            this.stockMovementController.registerMovement);

        this.router.get("/stock-movements",
            this.stockMovementController.getAllStockMovements);
    }
}
