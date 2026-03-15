import { Router } from "express"
import { ProductController } from "./product.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addProductSchema } from "./dto/addProduct.dto"
import expressAsyncHandler from "express-async-handler"

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

    this.route.get("/products", expressAsyncHandler(this.productController.getAllProducts))

    this.route.get("/product/:id", expressAsyncHandler(this.productController.getProductById))
  }
}

export default ProductRouter
