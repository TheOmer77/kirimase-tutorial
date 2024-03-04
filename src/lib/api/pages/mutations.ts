import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PageId, 
  NewPageParams,
  UpdatePageParams, 
  updatePageSchema,
  insertPageSchema, 
  pages,
  pageIdSchema 
} from "@/lib/db/schema/pages";
import { getUserAuth } from "@/lib/auth/utils";

export const createPage = async (page: NewPageParams) => {
  const { session } = await getUserAuth();
  const newPage = insertPageSchema.parse({ ...page, userId: session?.user.id! });
  try {
    const [p] =  await db.insert(pages).values(newPage).returning();
    return { page: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePage = async (id: PageId, page: UpdatePageParams) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  const newPage = updatePageSchema.parse({ ...page, userId: session?.user.id! });
  try {
    const [p] =  await db
     .update(pages)
     .set({...newPage, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(pages.id, pageId!), eq(pages.userId, session?.user.id!)))
     .returning();
    return { page: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePage = async (id: PageId) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(pages).where(and(eq(pages.id, pageId!), eq(pages.userId, session?.user.id!)))
    .returning();
    return { page: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

