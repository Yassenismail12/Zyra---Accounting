import { addUserDTO } from "./dto/addUser.dto";
import pool from "../../db/index";
import { AppError } from "../../Shared/errors/app.error";
import { UserError, UserSuccess } from "../../Shared/utils/constant";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import bcrypt from 'bcrypt'
export class UserService{

    public async createUser(dto:addUserDTO){
        const { name,email,password,role}=dto

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if(result.rows.length > 0)
            throw new AppError(UserError.USER_ALREADY_EXSITS,StatusCode.CONFLICT)

        const hashPassword= await bcrypt.hash(password,10)
        
        await pool.query(
            `INSERT INTO users (name, email, password ,role)
            VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, email, hashPassword , role]
        );

        return {message:UserSuccess.CREATE_USER_SUCCESS}
    }

    public async getAllUsers(){

        const result= await pool.query("select * from users")

        return {users:result.rows}
    }
}