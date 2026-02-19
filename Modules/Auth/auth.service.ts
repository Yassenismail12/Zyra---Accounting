import pool from "../../db/index";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { AppError } from "../../Shared/errors/app.error";
import { UserError } from "../../Shared/utils/constant";
import { loginDTO } from "./dto/login.dto";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
export class AuthService {

    public async login(dto: loginDTO) {
        const { email, password } = dto

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        if (!user)
            throw new AppError(UserError.USER_NOT_FOUND, StatusCode.UNAUTHORIZED)

        const ckeckPassword = await bcrypt.compare(password, user.password)

        if (!ckeckPassword)
            throw new AppError(UserError.PASSWORD_DO_NOT_MATCH, StatusCode.UNAUTHORIZED)

        const payload = { id: user.id, role: user.role }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.JWT_expiresIn as jwt.SignOptions["expiresIn"]
            })

        return { token, user }
    }
}