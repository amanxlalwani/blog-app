/*
  Warnings:

  - Added the required column `has_liked` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "has_liked" BOOLEAN NOT NULL;
