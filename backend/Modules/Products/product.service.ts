import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { AppError } from "../../Shared/errors/app.error"
import { ProductsError, ProductsSuccess } from "../../Shared/utils/constant"
import { addProductDTO } from "./dto/addProduct.dto"
import { prisma } from "../../prisma/prisma"
import { updateProductDTO } from "./dto/updateProduct.dto"

export class ProductService {
  public async createProduct(dto: addProductDTO) {
    const { name, sale_price, purchase_price } = dto

    const result = await prisma.product.findUnique({
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

  public async getProductByIdWithBatches(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include:{
        batches:true
      }
    })

    if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

    return { product }
  }

  public async updateProduct(id: number, dto: updateProductDTO) {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

    const nProduct = await prisma.product.update({
      where: { id },
      data: dto,
    })

    return { product: nProduct }
  }

  public async deleteProduct(id:number){
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

    await prisma.product.delete({
      where: { id },
    })

    return { message : ProductsSuccess.DELETE_PRODUCT_SUCCESS}
  }
}
