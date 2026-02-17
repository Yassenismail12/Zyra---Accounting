import { Router } from "express";
import { PartiesController } from "./parties.controller";
import expressAsyncHandler from "express-async-handler";
import { validate } from "../../Shared/middlewares/validation.middleware";
import { createProductSchema } from "../Products/dto/createProduct.dto";


class PartiesRouter{
    router=Router()
    private partiesController:PartiesController

    constructor(){
        this.partiesController=new PartiesController()
        this.initRouter()
    }

    private initRouter(){

        this.router.post('/parties',
            validate(createProductSchema),
            expressAsyncHandler(this.partiesController.createParty)
        )

        this.router.get('/parties',
            expressAsyncHandler(this.partiesController.getAllParties)
        )

    }
}

export default PartiesRouter