import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { ProductsError } from "../../Shared/utils/constant"
import { sendRespones } from "../../Shared/utils/sendResponse"
import { ProductService } from "./product.service"
import { Request, Response } from "express"

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  public createProduct = async (req: Request, res: Response) => {
    const dto = req.body

    const { message } = await this.productService.createProduct(dto)

    sendRespones(res, StatusCode.OK, {
      success: true,
      message,
    })
  }

  public getAllProducts = async (req: Request, res: Response) => {
    const { products } = await this.productService.getAllProducts()

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: products,
    })
  }

  public getProductById = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id || isNaN(Number(id)))
      sendRespones(res, StatusCode.NOT_FOUND, {
        success: false,
        message: ProductsError.INVALID_ID,
      })
    const { product } = await this.productService.getProductById(Number(id))

    sendRespones(res, StatusCode.OK, {
      success: true,
      data: product,
    })
  }
}
