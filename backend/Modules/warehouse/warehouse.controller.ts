import { tr } from "zod/v4/locales"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { sendRespones } from "../../Shared/utils/sendResponse"
import { WarehouseService } from "./warehouse.service"
import { Request, Response } from "express"
export class WarehouseController {
  private warehouseService: WarehouseService

  constructor() {
    this.warehouseService = new WarehouseService()
  }

  public createWarehouse = async (req: Request, res: Response) => {
    const dto = req.body

    const warehouse = await this.warehouseService.createWarehouse(dto)

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: warehouse,
    })
  }

  public getAllWarehouse = async (req: Request, res: Response) => {
    const warehouses = await this.warehouseService.getAllWarehouse()

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: warehouses,
    })
  }

  public getWarehouseById = async (req: Request, res: Response) => {
    const {id}=req.params

    const warehouses = await this.warehouseService.getWarehouseById(Number(id))

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: warehouses,
    })
  }

  public getWarehouseByIdWithStock = async (req: Request, res: Response) => {
    const {id}=req.params

    const warehouses = await this.warehouseService.getWarehouseByIdWithStock(Number(id))

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: warehouses,
    })
  }
}
