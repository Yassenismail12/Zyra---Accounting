import { prisma } from "../../prisma/prisma"
import { AppError } from "../../Shared/errors/app.error"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { StockError, StockSuccess } from "../../Shared/utils/constant"
import { addStockDTO } from "./dto/addStock.dto"

export class StockService {

    public async createStock(dto: addStockDTO) {
        const { warehouse_id, batch_id, quantity } = dto

        const result = await prisma.stock.findUnique({
            where: { warehouse_id_batch_id: { warehouse_id, batch_id } },
        })

        if (result) throw new AppError(StockError.STOCK_ALREADY_EXSITS, StatusCode.CONFLICT)

        await prisma.stock.create({
            data: {
                warehouse_id,
                batch_id,
                quantity,
            },
        })

        return { message: StockSuccess.CREATE_STOCK_SUCCESS }
    }

    public async getAllStock() {
        const stock = await prisma.stock.findMany({
            include: {
                warehouse: {
                    select: {
                        name: true,
                    },
                },
                batch: {
                    select: {
                        batch_number: true,
                        expiry_date: true,
                    },
                },
            },
        })
        return { stock }
    }

    public async getStockById(id: number) {
        const stock = await prisma.stock.findUnique({
            where: { id },
            include: {
                warehouse: {
                    select: {
                        name: true,
                    },
                },
                batch: {
                    select: {
                        batch_number: true,
                        expiry_date: true,
                    },
                }
            },
        })
        return { stock }
    }
}