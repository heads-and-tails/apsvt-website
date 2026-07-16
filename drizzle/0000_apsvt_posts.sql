CREATE TABLE IF NOT EXISTS `posts` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `title` text NOT NULL,
  `excerpt` text NOT NULL,
  `body` text NOT NULL,
  `category` text NOT NULL,
  `image_url` text NOT NULL,
  `image_alt` text NOT NULL,
  `status` text NOT NULL DEFAULT 'draft',
  `featured` integer NOT NULL DEFAULT 0,
  `published_at` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `author_email` text NOT NULL
);
CREATE INDEX IF NOT EXISTS `posts_status_published_idx` ON `posts` (`status`, `published_at`);
