/*
  Warnings:

  - You are about to drop the column `batch_id` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `stock_movement` table. All the data in the column will be lost.
  - Added the required column `stock_id` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "batch_id",
ADD COLUMN     "stock_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stock_movement" DROP COLUMN "warehouse_id";

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
