"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type PageLink, CompletePageLink } from "@/lib/db/schema/pageLinks";
import Modal from "@/components/shared/Modal";
import { type Page, type PageId } from "@/lib/db/schema/pages";
import { useOptimisticPageLinks } from "@/app/(app)/page-links/useOptimisticPageLinks";
import { Button } from "@/components/ui/button";
import PageLinkForm from "./PageLinkForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (pageLink?: PageLink) => void;

export default function PageLinkList({
  pageLinks,
  pages,
  pageId 
}: {
  pageLinks: CompletePageLink[];
  pages: Page[];
  pageId?: PageId 
}) {
  const { optimisticPageLinks, addOptimisticPageLink } = useOptimisticPageLinks(
    pageLinks,
    pages 
  );
  const [open, setOpen] = useState(false);
  const [activePageLink, setActivePageLink] = useState<PageLink | null>(null);
  const openModal = (pageLink?: PageLink) => {
    setOpen(true);
    pageLink ? setActivePageLink(pageLink) : setActivePageLink(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePageLink ? "Edit PageLink" : "Create Page Link"}
      >
        <PageLinkForm
          pageLink={activePageLink}
          addOptimistic={addOptimisticPageLink}
          openModal={openModal}
          closeModal={closeModal}
          pages={pages}
        pageId={pageId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticPageLinks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPageLinks.map((pageLink) => (
            <PageLink
              pageLink={pageLink}
              key={pageLink.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const PageLink = ({
  pageLink,
  openModal,
}: {
  pageLink: CompletePageLink;
  openModal: TOpenModal;
}) => {
  const optimistic = pageLink.id === "optimistic";
  const deleting = pageLink.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("page-links")
    ? pathname
    : pathname + "/page-links/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{pageLink.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + pageLink.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No page links
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new page link.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Page Links </Button>
      </div>
    </div>
  );
};
