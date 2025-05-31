/*
  Warnings:

  - Added the required column `dockerContainer_id` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "dockerContainer_id" TEXT NOT NULL;
