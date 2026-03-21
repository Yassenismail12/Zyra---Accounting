import { prisma } from "../../prisma/prisma"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { AppError } from "../../Shared/errors/app.error"
import { BatchError, ProductsError } from "../../Shared/utils/constant"
import { createBatchDTO } from "./dto/createBatch.dto"

export class BatchService {
  public async createBatch(dto: createBatchDTO) {
    const { product_id, batch_number, expiry_date } = dto

    const product = await prisma.product.findUnique({
      where: { id: product_id },
    })

    if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

    const batchExists = await prisma.batch.findFirst({
      where: {
        product_id,
        batch_number,
      },
    })

    if (batchExists) throw new AppError(BatchError.BATCH_EXIT, StatusCode.BAD_REQUEST)

    const parsedExpiryDate = new Date(expiry_date)
    if (parsedExpiryDate <= new Date()) {
      throw new AppError(BatchError.EXPIRY_DATE, StatusCode.BAD_REQUEST)
    }

    const batch = await prisma.batch.create({
      data: {
        product_id,
        batch_number,
        expiry_date: parsedExpiryDate,
      },
    })

    return { batch }
  }

  public async getAllBatches() {
    const batches = await prisma.batch.findMany({
      include: {
        product: true,
      },
    })

    return batches
  }

  public async getAllBatchById(id:number) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        product: true,
      },
    })

    return batch
  }

}
