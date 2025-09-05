-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "selectedAcctType" "public"."AccountType" NOT NULL DEFAULT 'CHECKING',
ALTER COLUMN "country" DROP NOT NULL;
