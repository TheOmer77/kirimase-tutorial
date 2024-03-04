'use server';

import { revalidatePath } from 'next/cache';
import { createPage, deletePage, updatePage } from '@/lib/api/pages/mutations';
import {
  PageId,
  NewPageParams,
  UpdatePageParams,
  pageIdSchema,
  insertPageParams,
  updatePageParams,
} from '@/lib/db/schema/pages';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePages = () => revalidatePath('/pages');

export const createPageAction = async (input: NewPageParams) => {
  try {
    const payload = insertPageParams.parse(input);
    await createPage(payload);
    revalidatePages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePageAction = async (input: UpdatePageParams) => {
  try {
    const payload = updatePageParams.parse(input);
    await updatePage(payload.id, payload);
    revalidatePages();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePageAction = async (input: PageId) => {
  try {
    const payload = pageIdSchema.parse({ id: input });
    await deletePage(payload.id);
    revalidatePages();
  } catch (e) {
    return handleErrors(e);
  }
};
