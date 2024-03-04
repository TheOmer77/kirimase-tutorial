import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/page-links/useOptimisticPageLinks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type PageLink, insertPageLinkParams } from "@/lib/db/schema/pageLinks";
import {
  createPageLinkAction,
  deletePageLinkAction,
  updatePageLinkAction,
} from "@/lib/actions/pageLinks";
import { type Page, type PageId } from "@/lib/db/schema/pages";

const PageLinkForm = ({
  pages,
  pageId,
  pageLink,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  pageLink?: PageLink | null;
  pages: Page[];
  pageId?: PageId
  openModal?: (pageLink?: PageLink) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<PageLink>(insertPageLinkParams);
  const editing = !!pageLink?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("page-links");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: PageLink },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`PageLink ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const pageLinkParsed = await insertPageLinkParams.safeParseAsync({ pageId, ...payload });
    if (!pageLinkParsed.success) {
      setErrors(pageLinkParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = pageLinkParsed.data;
    const pendingPageLink: PageLink = {
      updatedAt: pageLink?.updatedAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      createdAt: pageLink?.createdAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      id: pageLink?.id ?? "",
      userId: pageLink?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingPageLink,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updatePageLinkAction({ ...values, id: pageLink.id })
          : await createPageLinkAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPageLink 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.title ? "text-destructive" : "",
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? "ring ring-destructive" : "")}
          defaultValue={pageLink?.title ?? ""}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.url ? "text-destructive" : "",
          )}
        >
          Url
        </Label>
        <Input
          type="text"
          name="url"
          className={cn(errors?.url ? "ring ring-destructive" : "")}
          defaultValue={pageLink?.url ?? ""}
        />
        {errors?.url ? (
          <p className="text-xs text-destructive mt-2">{errors.url[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {pageId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.pageId ? "text-destructive" : "",
          )}
        >
          Page
        </Label>
        <Select defaultValue={pageLink?.pageId} name="pageId">
          <SelectTrigger
            className={cn(errors?.pageId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
          {pages?.map((page) => (
            <SelectItem key={page.id} value={page.id.toString()}>
              {page.id}{/* TODO: Replace with a field from the page model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.pageId ? (
          <p className="text-xs text-destructive mt-2">{errors.pageId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: pageLink });
              const error = await deletePageLinkAction(pageLink.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: pageLink,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default PageLinkForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
