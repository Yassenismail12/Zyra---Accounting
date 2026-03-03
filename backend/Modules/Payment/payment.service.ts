import { Response ,Request} from "express";
import pool from "../../db";
import { createPaymentDTO } from "./dto/createPayment.dto";
import { AppError } from "../../Shared/errors/app.error";
import { InvoicesError, PaymentError } from "../../Shared/utils/constant";
import { StatusCode } from "../../Shared/enums/statusCode.enum";


export class PaymentService{

    public async createPayment(InvoicesId:number , dto : createPaymentDTO){
        
        const client = await pool.connect()
        try{
            await client.query("BEGIN")

            const result = await client.query(
                "select * from invoices where id = $1", 
                [InvoicesId]
            );

            if (result.rows.length === 0) {
                throw new AppError( InvoicesError.INVOICES_NOT_FOUND, StatusCode.NOT_FOUND );
            }

            const invoice = result.rows[0]

            const { amount } = dto
            
            const paymentSumResult = await client.query(
                `SELECT COALESCE(SUM(amount), 0) AS total_paid
                FROM payments
                WHERE invoice_id = $1`,
                [InvoicesId]
            );

            const totalPaid = Number(paymentSumResult.rows[0].total_paid)

            const remaining = Number(invoice.total) - totalPaid

            if( remaining < 0 ) throw new AppError( PaymentError.INVOICE_OVERPAID , StatusCode.CONFLICT)
            
            if( remaining === 0 || invoice.status === 'PAID') 
                throw new AppError( PaymentError.INVOICE_PAID , StatusCode.CONFLICT)

            if( amount > remaining ) throw new AppError( PaymentError.PAY_MORE_REMAINING , StatusCode.CONFLICT )
            
            const pay = await client.query(
                `INSERT INTO payments (amount , invoice_id)
                VALUES ($1 , $2)
                RETURNING *`,
                [ amount , InvoicesId ]
            )

            const newTotalPaid = totalPaid + amount;

            let newStatus = 'UNPAID';

            if ( newTotalPaid === Number(invoice.total) ) {
                newStatus = 'PAID';
            }

            await client.query(
                `UPDATE invoices SET status = $1 WHERE id = $2`,
                [newStatus, InvoicesId]
            );

            await client.query("COMMIT");

            return pay.rows[0];

        }catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async getPayment(InvoicesId:number){

        const result = await pool.query(
            `SELECT *
            FROM payments
            WHERE invoice_id = $1`,
            [InvoicesId]
        )
        if (result.rows.length === 0) {
            throw new AppError( PaymentError.PAYMENT_NOT_FOUND, StatusCode.NOT_FOUND );
        }

        const payments = result.rows

        return payments
    }
}