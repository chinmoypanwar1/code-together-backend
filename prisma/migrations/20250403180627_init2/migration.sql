/*
  Warnings:

  - You are about to drop the column `display_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "display_name",
ADD COLUMN     "username" TEXT NOT NULL;
