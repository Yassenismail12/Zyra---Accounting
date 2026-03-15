import { addUserDTO } from "./dto/addUser.dto"
import { AppError } from "../../Shared/errors/app.error"
import { UserError, UserSuccess } from "../../Shared/utils/constant"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import bcrypt from "bcrypt"
import { prisma } from "../../prisma/prisma"
export class UserService {
  public async createUser(dto: addUserDTO) {
    const { name, email, password, role } = dto
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role,
      },
    })
    return {
      message: UserSuccess.CREATE_USER_SUCCESS,
      data: user,
    }
  }

  public async getAllUsers() {
    const users = await prisma.user.findMany()
    return {
      data: users,
    }
  }

  public async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) throw new AppError(UserError.USER_NOT_FOUND, StatusCode.NOT_FOUND)
    return {
      data: user,
    }
  }
}
