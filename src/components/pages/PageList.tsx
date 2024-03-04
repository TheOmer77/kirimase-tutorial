"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Page, CompletePage } from "@/lib/db/schema/pages";
import Modal from "@/components/shared/Modal";

import { useOptimisticPages } from "@/app/(app)/pages/useOptimisticPages";
import { Button } from "@/components/ui/button";
import PageForm from "./PageForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (page?: Page) => void;

export default function PageList({
  pages,
   
}: {
  pages: CompletePage[];
   
}) {
  const { optimisticPages, addOptimisticPage } = useOptimisticPages(
    pages,
     
  );
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const openModal = (page?: Page) => {
    setOpen(true);
    page ? setActivePage(page) : setActivePage(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePage ? "Edit Page" : "Create Page"}
      >
        <PageForm
          page={activePage}
          addOptimistic={addOptimisticPage}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticPages.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPages.map((page) => (
            <Page
              page={page}
              key={page.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Page = ({
  page,
  openModal,
}: {
  page: CompletePage;
  openModal: TOpenModal;
}) => {
  const optimistic = page.id === "optimistic";
  const deleting = page.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("pages")
    ? pathname
    : pathname + "/pages/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{page.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + page.id }>
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
        No pages
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new page.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Pages </Button>
      </div>
    </div>
  );
};
