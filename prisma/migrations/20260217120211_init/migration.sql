/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marketplace_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marketplaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sync_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_marketplace_accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "marketplace_products" DROP CONSTRAINT "marketplace_products_marketplace_account_id_fkey";

-- DropForeignKey
ALTER TABLE "marketplace_products" DROP CONSTRAINT "marketplace_products_marketplace_id_fkey";

-- DropForeignKey
ALTER TABLE "marketplace_products" DROP CONSTRAINT "marketplace_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "marketplace_products" DROP CONSTRAINT "marketplace_products_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_marketplace_account_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_order_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_product_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "sync_logs" DROP CONSTRAINT "sync_logs_marketplace_account_id_fkey";

-- DropForeignKey
ALTER TABLE "user_marketplace_accounts" DROP CONSTRAINT "user_marketplace_accounts_marketplace_id_fkey";

-- DropForeignKey
ALTER TABLE "user_marketplace_accounts" DROP CONSTRAINT "user_marketplace_accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "full_name",
DROP COLUMN "is_active",
DROP COLUMN "phone",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "inventory";

-- DropTable
DROP TABLE "marketplace_products";

-- DropTable
DROP TABLE "marketplaces";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "product_variants";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "stock_movements";

-- DropTable
DROP TABLE "sync_logs";

-- DropTable
DROP TABLE "user_marketplace_accounts";

-- DropEnum
DROP TYPE "MovementType";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "SyncStatus";

-- DropEnum
DROP TYPE "SyncType";

-- DropEnum
DROP TYPE "UserRole";
