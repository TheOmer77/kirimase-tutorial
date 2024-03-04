import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PageLinkId, 
  NewPageLinkParams,
  UpdatePageLinkParams, 
  updatePageLinkSchema,
  insertPageLinkSchema, 
  pageLinks,
  pageLinkIdSchema 
} from "@/lib/db/schema/pageLinks";
import { getUserAuth } from "@/lib/auth/utils";

export const createPageLink = async (pageLink: NewPageLinkParams) => {
  const { session } = await getUserAuth();
  const newPageLink = insertPageLinkSchema.parse({ ...pageLink, userId: session?.user.id! });
  try {
    const [p] =  await db.insert(pageLinks).values(newPageLink).returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePageLink = async (id: PageLinkId, pageLink: UpdatePageLinkParams) => {
  const { session } = await getUserAuth();
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  const newPageLink = updatePageLinkSchema.parse({ ...pageLink, userId: session?.user.id! });
  try {
    const [p] =  await db
     .update(pageLinks)
     .set({...newPageLink, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(pageLinks.id, pageLinkId!), eq(pageLinks.userId, session?.user.id!)))
     .returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePageLink = async (id: PageLinkId) => {
  const { session } = await getUserAuth();
  const { id: pageLinkId } = pageLinkIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(pageLinks).where(and(eq(pageLinks.id, pageLinkId!), eq(pageLinks.userId, session?.user.id!)))
    .returning();
    return { pageLink: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

