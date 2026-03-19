import { Router } from "express"
import { WarehouseController } from "./warehouse.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addWarehouseSchema } from "./dto/addWarehouse.dto"
import expressAsyncHandler from "express-async-handler"

class WarehouseRouter {
  router = Router()
  private warehouseController: WarehouseController

  constructor() {
    this.warehouseController = new WarehouseController()
    this.initRouter()
  }

  private initRouter() {
    this.router.post(
      "/warehouse",
      validate(addWarehouseSchema),
      expressAsyncHandler(this.warehouseController.createWarehouse),
    )

    this.router.get('/warehouse',
      expressAsyncHandler(this.warehouseController.getAllWarehouse)
    )

    this.router.get('/warehouse/:id',
      expressAsyncHandler(this.warehouseController.getWarehouseById)
    )

    this.router.get('/warehouse/:id/stock',
      expressAsyncHandler(this.warehouseController.getWarehouseByIdWithStock)
    )
  }
}

export default WarehouseRouter
