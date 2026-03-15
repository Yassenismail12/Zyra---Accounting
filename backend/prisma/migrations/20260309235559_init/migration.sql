-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
-- CreateEnum
CREATE TYPE "partyType" AS ENUM ('CUSTOMER', 'SUPPLIER');
-- CreateEnum
CREATE TYPE "invoiceType" AS ENUM ('SALE', 'PURCHASE');
-- CreateEnum
CREATE TYPE "invoiceStatus" AS ENUM ('PAID', 'UNPAID');
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "party" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "partyType" NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT,
    "address" TEXT,
    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sale_price" DECIMAL(65, 30) NOT NULL,
    "purchase_price" DECIMAL(65, 30) NOT NULL,
    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "batch" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "type" "invoiceType" NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "status" "invoiceStatus" NOT NULL,
    "notes" TEXT,
    "party_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "subtotal" DECIMAL(65, 30) NOT NULL,
    "tax" DECIMAL(65, 30) NOT NULL,
    "total" DECIMAL(65, 30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "line_total" DECIMAL(65, 30) NOT NULL,
    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "amount" DECIMAL(65, 30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "_batchToinvoice_items" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_batchToinvoice_items_AB_pkey" PRIMARY KEY ("A", "B")
);
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- CreateIndex
CREATE UNIQUE INDEX "party_name_key" ON "party"("name");
-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");
-- CreateIndex
CREATE UNIQUE INDEX "warehouse_name_key" ON "warehouse"("name");
-- CreateIndex
CREATE UNIQUE INDEX "stock_warehouse_id_product_id_key" ON "stock"("warehouse_id", "product_id");
-- CreateIndex
CREATE INDEX "_batchToinvoice_items_B_index" ON "_batchToinvoice_items"("B");
-- AddForeignKey
ALTER TABLE "batch"
ADD CONSTRAINT "batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "stock"
ADD CONSTRAINT "stock_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "stock"
ADD CONSTRAINT "stock_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "invoice"
ADD CONSTRAINT "invoice_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "invoice"
ADD CONSTRAINT "invoice_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "_batchToinvoice_items"
ADD CONSTRAINT "_batchToinvoice_items_A_fkey" FOREIGN KEY ("A") REFERENCES "batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "_batchToinvoice_items"
ADD CONSTRAINT "_batchToinvoice_items_B_fkey" FOREIGN KEY ("B") REFERENCES "invoice_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;