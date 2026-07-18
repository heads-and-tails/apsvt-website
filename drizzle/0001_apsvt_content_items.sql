CREATE TABLE IF NOT EXISTS `content_items` (
  `id` text PRIMARY KEY NOT NULL,
  `kind` text NOT NULL,
  `payload` text NOT NULL,
  `sort_order` integer NOT NULL DEFAULT 0,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `author_email` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `content_items_kind_sort_idx` ON `content_items` (`kind`, `sort_order`);
