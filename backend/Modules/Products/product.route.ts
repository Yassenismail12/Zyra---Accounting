import { Router } from "express"
import { ProductController } from "./product.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addProductSchema } from "./dto/addProduct.dto"
import expressAsyncHandler from "express-async-handler"
import { updateProductSchema } from "./dto/updateProduct.dto"

class ProductRouter {
  router = Router()
  private productController: ProductController

  constructor() {
    this.productController = new ProductController()
    this.initRouter()
  }

  private initRouter() {
    this.router.post(
      "/products",
      validate(addProductSchema),
      expressAsyncHandler(this.productController.createProduct),
    )

    this.router.get(
      "/products",
      expressAsyncHandler(this.productController.getAllProducts)
    )

    this.router.get(
      "/product/:id",
      expressAsyncHandler(this.productController.getProductById)
    )

    this.router.get(
      "/product/batch/:id",
      expressAsyncHandler(this.productController.getProductByIdWithBatch),
    )

    this.router.patch(
      "/product/:id",
      validate(updateProductSchema),
      expressAsyncHandler(this.productController.updateProduct),
    )

    this.router.delete(
      "/product/:id",
      expressAsyncHandler(this.productController.deleteProduct)
    )
  }
}

export default ProductRouter
