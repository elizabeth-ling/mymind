-- DropIndex
DROP INDEX "Item_userId_isPinned_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "isPinned";
