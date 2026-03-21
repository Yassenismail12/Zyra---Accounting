import { prisma } from "../../prisma/prisma"
import { addWarehouseDTO } from "./dto/addWarehouse.dto"

export class WarehouseService {
  public async createWarehouse(dto: addWarehouseDTO) {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: dto.name,
      },
    })

    return { warehouse }
  }

  public async getAllWarehouse() {
    const warehouses = await prisma.warehouse.findMany()

    return { warehouses }
  }

  public async getWarehouseById(id: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    })

    return { warehouse }
  }

  public async getWarehouseByIdWithStock(id: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        stock: {
          include: {
            batch: true
          },
        },
      },
    })

    return { warehouse }
  }
}
