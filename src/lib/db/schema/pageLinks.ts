import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { pages } from "./pages"
import { type getPageLinks } from "@/lib/api/pageLinks/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const pageLinks = sqliteTable('page_links', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  url: text("url").notNull(),
  pageId: text("page_id").notNull(),
  userId: text("user_id").notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for pageLinks - used to validate API requests
const baseSchema = createSelectSchema(pageLinks).omit(timestamps)

export const insertPageLinkSchema = createInsertSchema(pageLinks).omit(timestamps);
export const insertPageLinkParams = baseSchema.extend({
  pageId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updatePageLinkSchema = baseSchema;
export const updatePageLinkParams = baseSchema.extend({
  pageId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const pageLinkIdSchema = baseSchema.pick({ id: true });

// Types for pageLinks - used to type API request params and within Components
export type PageLink = typeof pageLinks.$inferSelect;
export type NewPageLink = z.infer<typeof insertPageLinkSchema>;
export type NewPageLinkParams = z.infer<typeof insertPageLinkParams>;
export type UpdatePageLinkParams = z.infer<typeof updatePageLinkParams>;
export type PageLinkId = z.infer<typeof pageLinkIdSchema>["id"];
    
// this type infers the return from getPageLinks() - meaning it will include any joins
export type CompletePageLink = Awaited<ReturnType<typeof getPageLinks>>["pageLinks"][number];

