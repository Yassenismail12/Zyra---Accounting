/*
  Warnings:

  - You are about to drop the column `qty` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the `_batchToinvoice_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[product_id,batch_number]` on the table `batch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouse_id,batch_id]` on the table `stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batch_number` to the `batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch_id` to the `invoice_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch_id` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "movementType" AS ENUM ('SALE', 'PURCHASE', 'TRANSFER', 'ADJUSTMENT');

-- AlterEnum
ALTER TYPE "invoiceType" ADD VALUE 'RETURN';

-- DropForeignKey
ALTER TABLE "_batchToinvoice_items" DROP CONSTRAINT "_batchToinvoice_items_A_fkey";

-- DropForeignKey
ALTER TABLE "_batchToinvoice_items" DROP CONSTRAINT "_batchToinvoice_items_B_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "stock" DROP CONSTRAINT "stock_product_id_fkey";

-- DropIndex
DROP INDEX "stock_warehouse_id_product_id_key";

-- AlterTable
ALTER TABLE "batch" DROP COLUMN "qty",
ADD COLUMN     "batch_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "product_id",
DROP COLUMN "warehouse_id",
ADD COLUMN     "batch_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stock" DROP COLUMN "product_id",
ADD COLUMN     "batch_id" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0;

-- DropTable
DROP TABLE "_batchToinvoice_items";

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "movement_type" "movementType" NOT NULL,
    "movement_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batch_product_id_batch_number_key" ON "batch"("product_id", "batch_number");

-- CreateIndex
CREATE UNIQUE INDEX "stock_warehouse_id_batch_id_key" ON "stock"("warehouse_id", "batch_id");

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
