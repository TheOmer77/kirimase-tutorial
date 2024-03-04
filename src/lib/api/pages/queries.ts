import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PageId, pageIdSchema, pages } from "@/lib/db/schema/pages";
import { pageLinks, type CompletePageLink } from "@/lib/db/schema/pageLinks";

export const getPages = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(pages).where(eq(pages.userId, session?.user.id!));
  const p = rows
  return { pages: p };
};

export const getPageById = async (id: PageId) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  const [row] = await db.select().from(pages).where(and(eq(pages.id, pageId), eq(pages.userId, session?.user.id!)));
  if (row === undefined) return {};
  const p = row;
  return { page: p };
};

export const getPageByIdWithPageLinks = async (id: PageId) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  const rows = await db.select({ page: pages, pageLink: pageLinks }).from(pages).where(and(eq(pages.id, pageId), eq(pages.userId, session?.user.id!))).leftJoin(pageLinks, eq(pages.id, pageLinks.pageId));
  if (rows.length === 0) return {};
  const p = rows[0].page;
  const pp = rows.filter((r) => r.pageLink !== null).map((p) => p.pageLink) as CompletePageLink[];

  return { page: p, pageLinks: pp };
};

