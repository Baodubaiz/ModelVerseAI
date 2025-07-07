-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('VND', 'ETH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "ConfirmStatus" AS ENUM ('waiting', 'confirmed', 'rejected');

-- CreateTable
CREATE TABLE "AI_Model" (
    "model_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "price_vnd" DECIMAL(65,30) NOT NULL,
    "price_eth" DECIMAL(65,30) NOT NULL,
    "input_type" TEXT NOT NULL,
    "output_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AI_Model_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "amount_vnd" DECIMAL(65,30) NOT NULL,
    "amount_eth" DECIMAL(65,30) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "proof_image" TEXT,
    "transaction_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Order_Confirmation" (
    "confirm_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "dev_id" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ConfirmStatus" NOT NULL,

    CONSTRAINT "Order_Confirmation_pkey" PRIMARY KEY ("confirm_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Demo_Usage" (
    "demo_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "input_file" TEXT NOT NULL,
    "output_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Demo_Usage_pkey" PRIMARY KEY ("demo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_Confirmation_transaction_id_key" ON "Order_Confirmation"("transaction_id");

-- AddForeignKey
ALTER TABLE "AI_Model" ADD CONSTRAINT "AI_Model_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Confirmation" ADD CONSTRAINT "Order_Confirmation_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Confirmation" ADD CONSTRAINT "Order_Confirmation_dev_id_fkey" FOREIGN KEY ("dev_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demo_Usage" ADD CONSTRAINT "Demo_Usage_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demo_Usage" ADD CONSTRAINT "Demo_Usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
