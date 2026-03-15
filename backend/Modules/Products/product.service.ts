import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { AppError } from "../../Shared/errors/app.error"
import { ProductsError, ProductsSuccess } from "../../Shared/utils/constant"
import { addProductDTO } from "./dto/addProduct.dto"
import { prisma } from "../../prisma/prisma"

export class ProductService {
  public async createProduct(dto: addProductDTO) {
    const { name, sale_price, purchase_price } = dto

    const result = await  prisma.product.findUnique({
      where: { name },
    })

    if (result) throw new AppError(ProductsError.PRODUCTS_ALREADY_EXSITS, StatusCode.CONFLICT)

    await prisma.product.create({
      data: {
        name,
        sale_price,
        purchase_price,
      },
    })

    return { message: ProductsSuccess.CREATE_PRODUCTS_SUCCESS }
  }

  public async getAllProducts() {
    const result = await prisma.product.findMany()

    return { products: result }
  }

  public async getProductById(id: number) {
    const result = await prisma.product.findUnique({
      where: { id },
    })

    const product = result

    if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

    return { product }
  }
}
