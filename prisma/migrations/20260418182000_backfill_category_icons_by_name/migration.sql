-- Проставить icon у существующих категорий по стандартным именам (как в defaultSubscriptionCategories)

UPDATE "Category" SET "icon" = 'film' WHERE "name" = 'Entertainment';
UPDATE "Category" SET "icon" = 'briefcase' WHERE "name" = 'Work';
UPDATE "Category" SET "icon" = 'zap' WHERE "name" = 'Utilities';
UPDATE "Category" SET "icon" = 'wallet' WHERE "name" = 'Finance';
UPDATE "Category" SET "icon" = 'other' WHERE "name" = 'Other';
