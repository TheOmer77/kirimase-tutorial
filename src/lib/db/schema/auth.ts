import { z } from "zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
        id: text("id").notNull().primaryKey(),
        email: text("email").notNull().unique(),
        hashedPassword: text("hashed_password").notNull(),
        name: text("name"),
});

export const sessions = sqliteTable("session", {
        id: text("id").notNull().primaryKey(),
        userId: text("user_id")
        .notNull()
        .references(() => users.id),
        expiresAt: integer("expires_at").notNull(),
});


export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(31),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" })
    .max(15, { message: "cannot be more than 15 characters long" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
});

export type UsernameAndPassword = z.infer<typeof authenticationSchema>;
