import { prisma } from "../../prisma/prisma";
import { addInvoiceDTO } from "./dto/addInvoices.dto";
import { InvoicesSuccess, InvoicesError, ProductsError } from "../../Shared/utils/constant";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { Typeinvoice } from "../../Shared/enums/invoice.enum";
import { StockMovementService } from "../stockmovements/stockMovement.service";

export class InvoicesService {
    private stockMovementService = new StockMovementService();

    public async createInvoice(dto: addInvoiceDTO) {
        const { type, invoice_date, status, notes, party_id, created_by, items } = dto
        // calc the subtotal
        let subtotal = 0
        const processedItems = []

        for (const item of items) {
            const stock = await prisma.stock.findUnique({
                where: { id: item.stock_id },
                include: {
                    batch: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            if (!stock)
                throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)
            
            const unitPrice = (type === Typeinvoice.PURCHASE) 
                ? Number(stock.batch.product.purchase_price) 
                : Number(stock.batch.product.sale_price)

            const line_total = unitPrice * item.qty
            subtotal += line_total

            processedItems.push({
                stock_id: stock.id,
                qty: item.qty,
                line_total
            })
        }

        // calc the tax
        const tax = subtotal * 0
        // calc the total
        const total = subtotal + tax

        const result = await prisma.invoice.create({
            data: {
                type: type,
                invoice_date: new Date(invoice_date),
                status: status as any,
                notes: notes!,
                party_id: party_id!,
                created_by,
                subtotal,
                tax,
                total
            }
        })
        const invoice_id = result.id

        for (const item of processedItems) {
            await prisma.invoice_items.create({
                data: {
                    invoice_id,
                    stock_id: item.stock_id,
                    qty: item.qty,
                    line_total: item.line_total,
                },
            })

            let movement_type: 'SALE' | 'PURCHASE' | 'ADJUSTMENT' = 'ADJUSTMENT'
            if (type === Typeinvoice.SALE) movement_type = 'SALE'
            else if (type === Typeinvoice.PURCHASE) movement_type = 'PURCHASE'
            
            await this.stockMovementService.registerMovement({
                stock_id: item.stock_id,
                qty: item.qty,
                movement_type: movement_type as any
            })
        }

        return { message: InvoicesSuccess.CREATE_INVOICES_SUCCESS, invoice_id: invoice_id }
    }

    public async getAllInvoices() {
        const result = await prisma.invoice.findMany(
          {
            include: {
              party: {select:{name:true}},
              user: {select:{name:true}},
              invoice_items: true,
              payments: true,
            }
          }
        )
        return { invoices: result }
    }

    public async getInvoiceById(id: number) {
        const result = await prisma.invoice.findUnique({
            where: { id },
        })
        const invoice = result
        if (!invoice)
            throw new AppError(InvoicesError.INVOICES_NOT_FOUND, StatusCode.NOT_FOUND)

        return { invoice }
    }
}