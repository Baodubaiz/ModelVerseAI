-- AlterTable
ALTER TABLE "User" ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "wallet_address" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "bank_account" DROP NOT NULL,
ALTER COLUMN "bank_name" DROP NOT NULL;
