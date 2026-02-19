import pool from "../../db";
import { addInvoiceDTO } from "./dto/addInvoices.dto";
import { InvoicesSuccess, InvoicesError } from "../../Shared/utils/constant";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";

export class InvoicesService {

    public async createInvoice(dto: addInvoiceDTO) {
        const { type, invoice_date, status, notes, party_id, created_by, subtotal, tax, total } = dto
        await pool.query(
            `INSERT INTO invoices (type, invoice_date, status, notes, party_id, created_by, subtotal, tax, total)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [type, invoice_date, status, notes, party_id, created_by, subtotal, tax, total]
        )
        return { message: InvoicesSuccess.CREATE_INVOICES_SUCCESS }
    }

    public async getAllInvoices() {
        const result = await pool.query("select * from invoices")
        return { invoices: result.rows }
    }

    public async getInvoiceById(id: number) {
        const result = await pool.query("select * from invoices where id = $1", [id])
        const invoice = result.rows[0]
        if (!invoice)
            throw new AppError(InvoicesError.INVOICES_NOT_FOUND, StatusCode.NOT_FOUND)

        return { invoice }
    }
}
