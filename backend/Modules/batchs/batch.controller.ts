import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { sendRespones } from "../../Shared/utils/sendResponse"
import { BatchService } from "./batch.service"
import { Request, Response } from "express"

export class BatchController {
  private batchService: BatchService
  constructor() {
    this.batchService= new BatchService()
  }

  public createBatch = async (req: Request, res: Response) => {
    const dto = req.body

    const batch = await this.batchService.createBatch(dto)

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: batch,
    })
  }

  public getAllBatch = async (req: Request, res: Response) => {
    const batches = await this.batchService.getAllBatches()

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: batches,
    })
  }

  public getAllBatchById = async (req: Request, res: Response) => {
    const { id } = req.params
    const batches = await this.batchService.getAllBatchById(Number(id))

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: batches,
    })
  }
}
