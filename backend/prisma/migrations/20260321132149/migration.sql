/*
  Warnings:

  - You are about to drop the column `batch_id` on the `stock_movement` table. All the data in the column will be lost.
  - Added the required column `stock_id` to the `stock_movement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_batch_id_fkey";

-- AlterTable
ALTER TABLE "stock_movement" DROP COLUMN "batch_id",
ADD COLUMN     "stock_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
