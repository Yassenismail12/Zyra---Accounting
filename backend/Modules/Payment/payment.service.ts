import { createPaymentDTO } from "./dto/createPayment.dto"
import { AppError } from "../../Shared/errors/app.error"
import { InvoicesError, PaymentError } from "../../Shared/utils/constant"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { prisma } from "../../prisma/prisma"
import { invoiceStatus } from "../../generated/prisma/enums"

export class PaymentService {
  public async createPayment(InvoicesId: number, dto: createPaymentDTO) {
    const invoice = await prisma.invoice.findUnique({ where: { id: InvoicesId } })

    if (!invoice) {
      throw new AppError(InvoicesError.INVOICES_NOT_FOUND, StatusCode.NOT_FOUND)
    }

    const { amount } = dto

    const paymentSumResult = await prisma.payment.aggregate({
      where: {
        invoice_id: InvoicesId,
      },
      _sum: {
        amount: true,
      },
    })

    const totalPaid = Number(paymentSumResult._sum.amount ?? 0)

    const remaining = Number(invoice.total) - totalPaid

    if (remaining < 0) throw new AppError(PaymentError.INVOICE_OVERPAID, StatusCode.CONFLICT)

    if (remaining === 0 || invoice.status === invoiceStatus.PAID)
      throw new AppError(PaymentError.INVOICE_PAID, StatusCode.CONFLICT)

    if (amount > remaining) throw new AppError(PaymentError.PAY_MORE_REMAINING, StatusCode.CONFLICT)

    const pay = await prisma.payment.create({
      data: {
        amount: amount,
        invoice_id: InvoicesId,
        payment_date: new Date(),
      },
    })
    const newTotalPaid = totalPaid + amount

    if (newTotalPaid === Number(invoice.total)) {
      await prisma.invoice.update({
        where: {
          id: InvoicesId,
        },
        data: {
          status: invoiceStatus.PAID,
        },
      })
    }

    return pay
  }

  public async getPayment(InvoicesId: number) {
    const payment = await prisma.payment.findMany({
      where: { invoice_id: InvoicesId },
    })
    if (!payment) {
      throw new AppError(PaymentError.PAYMENT_NOT_FOUND, StatusCode.NOT_FOUND)
    }

    return payment
  }
}
