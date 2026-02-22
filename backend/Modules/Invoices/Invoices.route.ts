import { Router } from "express";
import { InvoicesController } from "./Invoices.controller";
import { validate } from "../../Shared/middlewares/validation.middleware";
import { addInvoiceSchema } from "./dto/addInvoices.dto";
import expressAsyncHandler from "express-async-handler";

class InvoicesRouter {
    route = Router()
    private invoicesController: InvoicesController

    constructor() {
        this.invoicesController = new InvoicesController()
        this.initRouter()
    }

    private initRouter() {

        this.route.post('/invoices',
            validate(addInvoiceSchema),
            expressAsyncHandler(this.invoicesController.createInvoice)
        )

        this.route.get('/invoices',
            expressAsyncHandler(this.invoicesController.getAllInvoices)
        )

        this.route.get('/invoices/:id',
            expressAsyncHandler(this.invoicesController.getInvoiceById)
        )
    }
}

export default InvoicesRouter