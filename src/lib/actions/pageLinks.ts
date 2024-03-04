'use server';

import { revalidatePath } from 'next/cache';
import {
  createPageLink,
  deletePageLink,
  updatePageLink,
} from '@/lib/api/pageLinks/mutations';
import {
  PageLinkId,
  NewPageLinkParams,
  UpdatePageLinkParams,
  pageLinkIdSchema,
  insertPageLinkParams,
  updatePageLinkParams,
} from '@/lib/db/schema/pageLinks';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePageLinks = () => revalidatePath('/page-links');

export const createPageLinkAction = async (input: NewPageLinkParams) => {
  try {
    const payload = insertPageLinkParams.parse(input);
    await createPageLink(payload);
    revalidatePageLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePageLinkAction = async (input: UpdatePageLinkParams) => {
  try {
    const payload = updatePageLinkParams.parse(input);
    await updatePageLink(payload.id, payload);
    revalidatePageLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePageLinkAction = async (input: PageLinkId) => {
  try {
    const payload = pageLinkIdSchema.parse({ id: input });
    await deletePageLink(payload.id);
    revalidatePageLinks();
  } catch (e) {
    return handleErrors(e);
  }
};
