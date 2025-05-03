-- CreateTable
CREATE TABLE "BackofficeSettings" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackofficeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BackofficeSettingsToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BackofficeSettingsToCategory_AB_unique" ON "_BackofficeSettingsToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BackofficeSettingsToCategory_B_index" ON "_BackofficeSettingsToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BackofficeSettingsToCategory" ADD CONSTRAINT "_BackofficeSettingsToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BackofficeSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BackofficeSettingsToCategory" ADD CONSTRAINT "_BackofficeSettingsToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
