import { Router } from "express"
import { BatchController } from "./batch.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { createBatchSchema } from "./dto/createBatch.dto"
import expressAsyncHandler from "express-async-handler"

class BatchRouter {
  router = Router()
  private batchController: BatchController

  constructor() {
    this.batchController = new BatchController()
    this.initRouter()
  }

  private initRouter() {
    this.router.post(
      "/batches",
      validate(createBatchSchema),
      expressAsyncHandler(this.batchController.createBatch),
    )

    this.router.get(
      "/batches",
      expressAsyncHandler(this.batchController.getAllBatch)
    )
    this.router.get(
      "/batches/:id",
      expressAsyncHandler(this.batchController.getAllBatchById)
    )
  }
}

export default BatchRouter