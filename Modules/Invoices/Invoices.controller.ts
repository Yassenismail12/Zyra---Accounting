import { Request, Response } from "express";
import { sendRespones } from "../../Shared/utils/sendResponse";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { InvoicesService } from "./Invoices.service";
import { ProductsError } from "../../Shared/utils/constant";

export class InvoicesController {
    private invoicesService: InvoicesService;

    constructor() {
        this.invoicesService = new InvoicesService();
    }

    public createInvoice = async (req: Request, res: Response) => {
        const dto = req.body;
        const { message } = await this.invoicesService.createInvoice(dto);
        sendRespones(res, StatusCode.OK, {
            success: true,
            message
        })
    }

    public getAllInvoices = async (req: Request, res: Response) => {
        const { invoices } = await this.invoicesService.getAllInvoices();
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: invoices
        })
    }

    public getInvoiceById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id || isNaN(Number(id)))
            sendRespones(res, StatusCode.NOT_FOUND, {
                success: false,
                message: ProductsError.INVALID_ID
            })
        const { invoice } = await this.invoicesService.getInvoiceById(Number(id));
        sendRespones(res, StatusCode.OK, {
            success: true,
            data: invoice
        })
    }
}