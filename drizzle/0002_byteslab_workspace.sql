CREATE TABLE IF NOT EXISTS `workspace_items` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `system` text NOT NULL,
  `status` text NOT NULL DEFAULT 'planned',
  `priority` text NOT NULL DEFAULT 'medium',
  `owner` text NOT NULL,
  `progress` integer NOT NULL DEFAULT 0,
  `due_date` text,
  `external_url` text,
  `notes` text NOT NULL DEFAULT '',
  `sort_order` integer NOT NULL DEFAULT 0,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `author_email` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `workspace_items_status_sort_idx` ON `workspace_items` (`status`, `sort_order`);
CREATE INDEX IF NOT EXISTS `workspace_items_system_idx` ON `workspace_items` (`system`);
