-- إضافة حقل النبذة التعريفية للمستخدم (يُستخدم لمكاتب الترجمة)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;
