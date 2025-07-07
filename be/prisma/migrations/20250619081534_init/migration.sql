-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'dev');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "bank_account" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
