import { Router } from "express"
import { WarehouseController } from "./warehouse.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addWarehouseSchema } from "./dto/addWarehouse.dto"
import expressAsyncHandler from "express-async-handler"

class WarehouseRouter {
  route = Router()
  private warehouseController: WarehouseController

  constructor() {
    this.warehouseController = new WarehouseController()
    this.initRouter()
  }

  private initRouter() {
    this.route.post(
      "/warehouse",
      validate(addWarehouseSchema),
      expressAsyncHandler(this.warehouseController.createWarehouse),
    )

    this.route.get('/warehouse',
      expressAsyncHandler(this.warehouseController.getAllWarehouse)
    )

    this.route.get('/warehouse/:id',
      expressAsyncHandler(this.warehouseController.getWarehouseById)
    )
  }
}

export default WarehouseRouter
