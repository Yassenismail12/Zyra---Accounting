import { Router } from "express";
import { PaymentController } from "./payment.controller";
import expressAsyncHandler from "express-async-handler";
import { validate } from "../../Shared/middlewares/validation.middleware";
import { createPaymentSchema } from "./dto/createPayment.dto";


class PaymentRouter{
    private paymentController:PaymentController
    route = Router()

    constructor(){
        this.paymentController = new PaymentController()
        this.initRouter()
    }

    private initRouter(){

        this.route.post(
            '/payment/:InvoicesId',
            validate(createPaymentSchema) , 
            expressAsyncHandler(this.paymentController.createPayment)
        )

        this.route.get(
            '/payment/:InvoicesId',
            expressAsyncHandler(this.paymentController.getPayment)
        )
    }
}

export default PaymentRouter