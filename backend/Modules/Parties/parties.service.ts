import { addPartyDTO } from "./dto/addparties.dto"
import { AppError } from "../../Shared/errors/app.error"
import { StatusCode } from "../../Shared/enums/statusCode.enum"
import { PartiesError, PartiesSuccess } from "../../Shared/utils/constant"
import { prisma } from "../../prisma/prisma"
import { updatePartyDTO } from "./dto/updateParties.dto"

export class PartiesService {
  public async createPatries(dto: addPartyDTO) {
    const { name, type, phone, address } = dto

    const result = await prisma.party.findUnique({
      where: { name },
    })

    if (result) throw new AppError(PartiesError.PARTIES_ALREADY_EXSITS, StatusCode.CONFLICT)

    await prisma.party.create({
      data: {
        name,
        type,
        phone,
        address,
      },
    })

    return { message: PartiesSuccess.CREATE_PARTIES_SUCCESS }
  }

  public async getAllParties() {
    const result = await prisma.party.findMany()

    return { parties: result }
  }

  public async getPartyById(id: number) {
    const result = await prisma.party.findUnique({
      where: { id },
    })
    if (!result) throw new AppError(PartiesError.PARTIES_NOT_FOUND, StatusCode.NOT_FOUND)

    return { party: result }
  }

  public async updateParty(id:number ,dto:updatePartyDTO){
    const result = await prisma.party.findUnique({
      where: { id },
    })
    if (!result) throw new AppError(PartiesError.PARTIES_NOT_FOUND, StatusCode.NOT_FOUND)

    const newParty= await prisma.party.update({
      where:{id},
      data: dto
    })

    return {party:newParty}
  }

  public async deleteParty(id:number){
    const result = await prisma.party.findUnique({
      where: { id },
    })
    if (!result) throw new AppError(PartiesError.PARTIES_NOT_FOUND, StatusCode.NOT_FOUND)

    await prisma.party.delete({
      where:{id}
    })

    return {msg:PartiesSuccess.DELETE_PARTY_SUCCESS}
  }
}
