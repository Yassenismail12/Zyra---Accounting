import { addPartyDTO } from "./dto/createparties.dto";
import pool from "../../db/index";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { PartiesError, PartiesSuccess } from "../../Shared/utils/constant";

export class PartiesService{

    public async createPatries(dto:addPartyDTO){

        const { name , type ,phone , address } =dto

        const result = await pool.query(
            `SELECT * FROM parties WHERE name = $1`,
            [name]
        );

        if(result.rows.length > 0)
            throw new AppError(PartiesError.PARTIES_ALREADY_EXSITS,StatusCode.CONFLICT,result.rows)

        await pool.query(
            `INSERT INTO parties (name, type, phone ,address)
            VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, type, phone , address]
        );

        return { message:PartiesSuccess.CREATE_PARTIES_SUCCESS}
    }

    public async getAllParties(){
        const result= await pool.query("select * from parties")

        return {parties:result.rows}
    }
}