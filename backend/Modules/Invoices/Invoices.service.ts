import pool from "../../db";
import { addInvoiceDTO } from "./dto/addInvoices.dto";
import { InvoicesSuccess, InvoicesError, ProductsError } from "../../Shared/utils/constant";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { Typeinvoice } from "../../Shared/enums/invoice.enum";

export class InvoicesService {

    public async createInvoice(dto: addInvoiceDTO) {
        const client = await pool.connect()
        try {
            await client.query("BEGIN")
            const { type, invoice_date, status, notes, party_id, created_by, items } = dto
            // calc the subtotal
            let subtotal = 0
            let finalparty = party_id
            let finalstatus = status
            if (type === Typeinvoice.INTERNAL) {
                finalparty = null
                finalstatus = null
            }
            for (const item of items) {
                const result = await client.query(
                    `SELECT sale_price FROM products WHERE id = $1`,
                    [item.product_id]
                )
                const product = result.rows[0]
                if (!product)
                    throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)
                subtotal += product.sale_price * item.qty
            }
            // calc the tax
            const tax = subtotal * 0
            // calc the total
            const total = subtotal + tax
            const result = await client.query(
                `INSERT INTO invoices (type, invoice_date, status, notes, party_id, created_by, subtotal, tax, total)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id`,
                [type, invoice_date, finalstatus, notes, finalparty, created_by, subtotal, tax, total]
            )
            const invoice_id = result.rows[0].id
            for (const item of items) {
                await client.query(
                    `INSERT INTO invoice_items (invoice_id, product_id, qty , line_total)
                    VALUES ($1, $2, $3, $4)`,
                    [invoice_id, item.product_id, item.qty, 0]
                )
            }
            await client.query("COMMIT")
            return { message: InvoicesSuccess.CREATE_INVOICES_SUCCESS, invoice_id: invoice_id }
        } catch (error) {
            await client.query("ROLLBACK")
            throw error
        }
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
