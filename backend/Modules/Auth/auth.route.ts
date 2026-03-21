import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { loginSchema } from "./dto/login.dto"
import expressAsyncHandler from "express-async-handler"

class AuthRouter {
  router = Router()
  private authController: AuthController

  constructor() {
    this.authController = new AuthController()
    this.initRouter()
  }

  private initRouter = () => {
    this.router.post(
      "/auth/login",
      validate(loginSchema),
      expressAsyncHandler(this.authController.login),
    )
  }
}

export default AuthRouter
