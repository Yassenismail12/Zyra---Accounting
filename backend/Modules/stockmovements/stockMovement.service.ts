import { prisma } from "../../prisma/prisma";
import { AppError } from "../../Shared/errors/app.error";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { createMovementDTO } from "./dto/createmovement.dto";

export class StockMovementService {
    public async registerMovement(dto: createMovementDTO) {
        const { stock_id, qty, movement_type } = dto;

        // Check if stock exists and get warehouse_id
        const stock = await prisma.stock.findUnique({
            where: { id: stock_id }
        });

        if (!stock) {
            throw new AppError("Stock not found", StatusCode.NOT_FOUND);
        }

        // Determine stock change
        let quantityChange = 0;
        if (movement_type === 'PURCHASE' || movement_type === 'ADJUSTMENT') {
            quantityChange = qty;
        } else if (movement_type === 'SALE' || movement_type === 'TRANSFER') {
            quantityChange = -qty;
        }

        // Validate insufficient stock for outgoing movements
        if (stock.quantity + quantityChange < 0) {
            throw new AppError(`Insufficient stock. Current stock is ${stock.quantity}`, StatusCode.BAD_REQUEST);
        }

        // Execute transaction to create movement and update stock
        await prisma.$transaction([
            prisma.stock_movement.create({
                data: {
                    stock: { connect: { id: stock_id } },
                    qty: qty,
                    movement_type: movement_type,
                }
            }),
            prisma.stock.update({
                where: { id: stock_id },
                data: {
                    quantity: {
                        increment: quantityChange
                    }
                }
            })
        ]);

        return { message: "Stock movement recorded and stock updated successfully" };
    }

    public async getAllStockMovements() {
        const stockMovements = await prisma.stock_movement.findMany(
            {
                include: {
                    stock: true
                }
            }
        );

        return stockMovements;
    }
}
