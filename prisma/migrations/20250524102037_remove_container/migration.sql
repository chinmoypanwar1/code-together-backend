/*
  Warnings:

  - You are about to drop the column `container_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Container` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStates" AS ENUM ('Running', 'Paused', 'Exited');

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_dockerImage_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_container_id_fkey";

-- DropIndex
DROP INDEX "Project_container_id_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "container_id",
ADD COLUMN     "status" "ProjectStates" NOT NULL;

-- DropTable
DROP TABLE "Container";

-- DropEnum
DROP TYPE "ContainerStates";
