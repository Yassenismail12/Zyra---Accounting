import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { AppError } from "../../Shared/errors/app.error"
import { UserError } from "../../Shared/utils/constant"
import { loginDTO } from "./dto/login.dto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../../prisma/prisma"
export class AuthService {
  public async login(dto: loginDTO) {
    const { email, password } = dto
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new AppError(UserError.USER_NOT_FOUND, StatusCode.UNAUTHORIZED)

    const ckeckPassword = await bcrypt.compare(password, user.password)

    if (!ckeckPassword) throw new AppError(UserError.PASSWORD_DO_NOT_MATCH, StatusCode.UNAUTHORIZED)

    const payload = { id: user.id, role: user.role }

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_expiresIn as jwt.SignOptions["expiresIn"],
    })

    return { token, user }
  }
}
