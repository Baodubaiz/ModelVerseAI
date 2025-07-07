/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order_Confirmation" DROP CONSTRAINT "Order_Confirmation_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_buyer_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_model_id_fkey";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "Transaction_VND" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "amount_vnd" DECIMAL(65,30) NOT NULL,
    "proof_image" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_VND_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction_Blockchain" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "amount_eth" DECIMAL(65,30) NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_Blockchain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction_VND" ADD CONSTRAINT "Transaction_VND_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_VND" ADD CONSTRAINT "Transaction_VND_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_Blockchain" ADD CONSTRAINT "Transaction_Blockchain_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_Blockchain" ADD CONSTRAINT "Transaction_Blockchain_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Confirmation" ADD CONSTRAINT "Order_Confirmation_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction_VND"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
