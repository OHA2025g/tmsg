CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`kind` text NOT NULL,
	`business` text NOT NULL,
	`full_name` text NOT NULL,
	`organisation` text NOT NULL,
	`designation` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`interest` text NOT NULL,
	`message` text NOT NULL,
	`consent` integer NOT NULL,
	`source` text NOT NULL,
	`rate_key` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `enquiries_created_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `enquiries_rate_idx` ON `enquiries` (`rate_key`,`created_at`);