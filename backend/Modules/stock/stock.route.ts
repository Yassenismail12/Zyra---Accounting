import { Router } from "express"
import { StockController } from "./stock.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addStockDTO } from "./dto/addStock.dto"
import expressAsyncHandler from "express-async-handler"

class StockRouter {
    router = Router()
    private stockController: StockController

    constructor() {
        this.stockController = new StockController()
        this.initRouter()
    }

    private initRouter = () => {
        this.router.post(
            "/stock",
            validate(addStockDTO),
            expressAsyncHandler(this.stockController.createStock),
        )

        this.router.get(
            "/stock",
            expressAsyncHandler(this.stockController.getAllStock),
        )

        this.router.get(
            "/stock/:id",
            expressAsyncHandler(this.stockController.getStockById),
        )
    }
}

export default StockRouter