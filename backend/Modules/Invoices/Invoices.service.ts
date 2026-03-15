<<<<<<< HEAD
import pool from "../../db";
import { addInvoiceDTO } from "./dto/addInvoices.dto";
import { InvoicesSuccess, InvoicesError, ProductsError } from "../../Shared/utils/constant";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { Typeinvoice } from "../../Shared/enums/invoice.enum";
=======
import { addInvoiceDTO } from "./dto/addInvoices.dto"
import { InvoicesSuccess, InvoicesError, ProductsError } from "../../Shared/utils/constant"
import { AppError } from "../../Shared/errors/app.error"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { Typeinvoice } from "../../Shared/enums/invoice.enum"
import { prisma } from "../../prisma/prisma"
>>>>>>> e96d1da4e961051ee48f049a5db6390c4c7026e2

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

<<<<<<< HEAD
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
=======
      const itemPrices = new Map<number, number>()
      for (const item of items) {
        const result = await client.query(
          `SELECT sale_price, purchase_price FROM products WHERE id = $1`,
          [item.product_id],
        )

        const product = result.rows[0]
        if (!product) throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

        const price =
          type === Typeinvoice.PURCHASE
            ? Number(product.purchase_price)
            : Number(product.sale_price)
        itemPrices.set(item.product_id, price)
        subtotal += price * item.qty
      }

      // calc the tax
      const tax = subtotal * 0
      // calc the total
      const total = subtotal + tax
      const result = await client.query(
        `INSERT INTO invoices (type, invoice_date, status, notes, party_id, created_by, subtotal, tax, total)
>>>>>>> e96d1da4e961051ee48f049a5db6390c4c7026e2
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id`,
        [type, invoice_date, finalstatus, notes, finalparty, created_by, subtotal, tax, total],
      )

      const invoice_id = result.rows[0].id
      for (const item of items) {
        const price = itemPrices.get(item.product_id) || 0
        await client.query(
          `INSERT INTO invoice_items (invoice_id, product_id, warehouse_id, qty, line_total)
                    VALUES ($1, $2, $3, $4, $5)`,
          [invoice_id, item.product_id, item.warehouse_id, item.qty, price * item.qty],
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
    if (!invoice) throw new AppError(InvoicesError.INVOICES_NOT_FOUND, StatusCode.NOT_FOUND)

    return { invoice }
  }
}
