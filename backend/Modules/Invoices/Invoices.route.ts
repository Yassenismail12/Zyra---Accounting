import { Router } from "express"
import { InvoicesController } from "./Invoices.controller"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addInvoiceSchema } from "./dto/addInvoices.dto"
import expressAsyncHandler from "express-async-handler"

class InvoicesRouter {
  router = Router()
  private invoicesController: InvoicesController

  constructor() {
    this.invoicesController = new InvoicesController()
    this.initRouter()
  }

  private initRouter() {
    this.router.post(
      "/invoices",
      validate(addInvoiceSchema),
      expressAsyncHandler(this.invoicesController.createInvoice),
    )

    this.router.get("/invoices", expressAsyncHandler(this.invoicesController.getAllInvoices))

    this.router.get("/invoices/:id", expressAsyncHandler(this.invoicesController.getInvoiceById))
  }
}

export default InvoicesRouter
