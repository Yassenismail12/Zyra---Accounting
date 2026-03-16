import { Router } from "express"
import { PartiesController } from "./parties.controller"
import expressAsyncHandler from "express-async-handler"
import { validate } from "../../Shared/middlewares/validation.middleware"
import { addPartySchema } from "./dto/addparties.dto"
import { updatePartySchema } from "./dto/updateParties.dto"

class PartiesRouter {
  router = Router()
  private partiesController: PartiesController

  constructor() {
    this.partiesController = new PartiesController()
    this.initRouter()
  }

  private initRouter() {
    this.router.post(
      "/parties",
      validate(addPartySchema),
      expressAsyncHandler(this.partiesController.createParty),
    )

    this.router.get("/parties", expressAsyncHandler(this.partiesController.getAllParties))

    this.router.get("/parties/:id", expressAsyncHandler(this.partiesController.getPartyById))

    this.router.patch(
      "/parties/:id",
      validate(updatePartySchema),
      expressAsyncHandler(this.partiesController.updateParty),
    )

    this.router.delete("/parties/:id", expressAsyncHandler(this.partiesController.deleteParty))
  }
}

export default PartiesRouter
