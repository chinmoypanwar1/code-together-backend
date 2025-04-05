-- CreateEnum
CREATE TYPE "ContainerStates" AS ENUM ('Running', 'Paused', 'Exited');

-- CreateEnum
CREATE TYPE "TodoStates" AS ENUM ('Pending', 'Done', 'Cancelled');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture_url" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "container_id" TEXT NOT NULL,
    "dockerImage_id" TEXT NOT NULL,
    "drawing_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "Container" (
    "container_id" TEXT NOT NULL,
    "dockerImage_id" TEXT NOT NULL,
    "status" "ContainerStates" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("container_id")
);

-- CreateTable
CREATE TABLE "DockerImage" (
    "dockerImage_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DockerImage_pkey" PRIMARY KEY ("dockerImage_id")
);

-- CreateTable
CREATE TABLE "ProjectTodo" (
    "todo_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "TodoStates" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTodo_pkey" PRIMARY KEY ("todo_id")
);

-- CreateTable
CREATE TABLE "Drawing" (
    "drawing_id" TEXT NOT NULL,
    "drawing_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("drawing_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_container_id_key" ON "Project"("container_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_drawing_id_key" ON "Project"("drawing_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "Container"("container_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_dockerImage_id_fkey" FOREIGN KEY ("dockerImage_id") REFERENCES "DockerImage"("dockerImage_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_drawing_id_fkey" FOREIGN KEY ("drawing_id") REFERENCES "Drawing"("drawing_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_dockerImage_id_fkey" FOREIGN KEY ("dockerImage_id") REFERENCES "DockerImage"("dockerImage_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTodo" ADD CONSTRAINT "ProjectTodo_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTodo" ADD CONSTRAINT "ProjectTodo_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
