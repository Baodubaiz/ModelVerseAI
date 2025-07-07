-- CreateTable
CREATE TABLE "AI_Category" (
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AI_Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "AI_Model_Category" (
    "model_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "AI_Model_Category_pkey" PRIMARY KEY ("model_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AI_Category_name_key" ON "AI_Category"("name");

-- AddForeignKey
ALTER TABLE "AI_Model_Category" ADD CONSTRAINT "AI_Model_Category_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "AI_Model"("model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_Model_Category" ADD CONSTRAINT "AI_Model_Category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "AI_Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
