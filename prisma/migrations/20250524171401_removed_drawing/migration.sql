/*
  Warnings:

  - You are about to drop the column `drawing_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Drawing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_drawing_id_fkey";

-- DropIndex
DROP INDEX "Project_drawing_id_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "drawing_id";

-- DropTable
DROP TABLE "Drawing";
