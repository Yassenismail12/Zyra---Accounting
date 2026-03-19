import { Router } from "express"
import { UserController } from "./user.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addUserSchema } from "./dto/addUser.dto"
import expressAsyncHandler from "express-async-handler"
import { auth, authRoles } from "../../Shared/middlewares/auth.middleware"
import { UserRoles } from "../../Shared/enums/userRoles.enum"
import { UpdateUserSchema } from "./dto/updateUser.dto"

class UserRouter {
  router = Router()
  private userController: UserController

  constructor() {
    this.userController = new UserController()
    this.initRouter()
  }

  private initRouter = () => {
    this.router.post(
      "/users",
      validate(addUserSchema),
      // auth,
      // authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.createUser),
    )

    this.router.get(
      "/users",
      // auth,
      // authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.getAllUsers),
    )

    this.router.get(
      "/users/:id",
      // auth,
      // authRoles(UserRoles.ADMIN),
      expressAsyncHandler(this.userController.getUserById),
    )

    this.router.patch(
      "/users/:id",
      validate(UpdateUserSchema),
      expressAsyncHandler(this.userController.updateUser),
    )

    this.router.delete(
      "/users/:id",
      expressAsyncHandler(this.userController.deleteUser),
    )

  }
}

export default UserRouter
