import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const enquiries = sqliteTable('enquiries', {
 id:text('id').primaryKey(), createdAt:integer('created_at').notNull(), kind:text('kind').notNull(), business:text('business').notNull(), fullName:text('full_name').notNull(), organisation:text('organisation').notNull(), designation:text('designation').notNull(), email:text('email').notNull(), phone:text('phone').notNull(), country:text('country').notNull(), interest:text('interest').notNull(), message:text('message').notNull(), consent:integer('consent').notNull(), source:text('source').notNull(), rateKey:text('rate_key').notNull()
},t=>[index('enquiries_created_idx').on(t.createdAt),index('enquiries_rate_idx').on(t.rateKey,t.createdAt)]);
