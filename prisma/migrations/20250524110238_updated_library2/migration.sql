/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[container_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `container_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContainerStates" AS ENUM ('Running', 'Paused', 'Exited');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status",
ADD COLUMN     "container_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ProjectStates";

-- CreateTable
CREATE TABLE "Container" (
    "container_id" TEXT NOT NULL,
    "dockerImage_id" TEXT NOT NULL,
    "status" "ContainerStates" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("container_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_container_id_key" ON "Project"("container_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "Container"("container_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_dockerImage_id_fkey" FOREIGN KEY ("dockerImage_id") REFERENCES "DockerImage"("dockerImage_id") ON DELETE RESTRICT ON UPDATE CASCADE;
