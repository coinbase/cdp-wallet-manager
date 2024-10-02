-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "wallet_id" VARCHAR(255) NOT NULL,
    "encrypted_seed" TEXT NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);
