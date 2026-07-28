ALTER TABLE "order_items"
ADD COLUMN IF NOT EXISTS "product_name" varchar(100);

UPDATE "order_items"
SET "product_name" = ''
WHERE "product_name" IS NULL;

ALTER TABLE "order_items"
ALTER COLUMN "product_name" SET NOT NULL;
