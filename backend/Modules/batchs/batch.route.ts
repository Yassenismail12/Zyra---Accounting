import { Router } from "express"
import { BatchController } from "./batch.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { createBatchSchema } from "./dto/createBatch.dto"
import expressAsyncHandler from "express-async-handler"

class BatchRouter {
  route = Router()
  private batchController: BatchController

  constructor() {
    this.batchController = new BatchController()
    this.initRouter()
  }

  private initRouter() {
    this.route.post(
      "batches",
      validate(createBatchSchema),
      expressAsyncHandler(this.batchController.createBatch),
    )

    this.route.get("batches", expressAsyncHandler(this.batchController.getAllBatch))
    this.route.get("batches/:id", expressAsyncHandler(this.batchController.getAllBatchById))
  }
}

export default BatchRouter