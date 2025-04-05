/*
  Warnings:

  - You are about to drop the `htmlFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "htmlFile" DROP CONSTRAINT "htmlFile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "htmlFiles" TEXT;

-- DropTable
DROP TABLE "htmlFile";
