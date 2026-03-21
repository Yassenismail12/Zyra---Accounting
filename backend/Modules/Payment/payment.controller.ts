import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { sendRespones } from "../../Shared/utils/sendResponse"
import { Response, Request } from "express"
import { PaymentService } from "./payment.service"

export class PaymentController {
  private paymentService: PaymentService

  constructor() {
    this.paymentService = new PaymentService()
  }

  public createPayment = async (req: Request, res: Response) => {
    const { InvoicesId } = req.params

    const dto = req.body

    const pay = await this.paymentService.createPayment(Number(InvoicesId), dto)

    sendRespones(res, StatusCode.OK, { success: true, data: { pay } })
  }

  public getPayment = async (req: Request, res: Response) => {
    const { InvoicesId } = req.params

    const payments = await this.paymentService.getPayment(Number(InvoicesId))

    sendRespones(res, StatusCode.OK, { success: true, data: { payments } })
  }
}
