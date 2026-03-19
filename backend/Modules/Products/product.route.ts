import { Router } from "express"
import { ProductController } from "./product.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addProductSchema } from "./dto/addProduct.dto"
import expressAsyncHandler from "express-async-handler"
import { updateProductSchema } from "./dto/updateProduct.dto"

class ProductRouter {
  route = Router()
  private productController: ProductController

  constructor() {
    this.productController = new ProductController()
    this.initRouter()
  }

  private initRouter() {
    this.route.post(
      "/products",
      validate(addProductSchema),
      expressAsyncHandler(this.productController.createProduct),
    )

    this.route.get(
      "/products",
      expressAsyncHandler(this.productController.getAllProducts)
    )

    this.route.get(
      "/product/:id",
      expressAsyncHandler(this.productController.getProductById)
    )

    this.route.get(
      "/product/batch/:id",
      expressAsyncHandler(this.productController.getProductByIdWithBatch),
    )

    this.route.patch(
      "/product/:id",
      validate(updateProductSchema),
      expressAsyncHandler(this.productController.updateProduct),
    )

    this.route.delete(
      "/product/:id",
      expressAsyncHandler(this.productController.deleteProduct)
    )
  }
}

export default ProductRouter
