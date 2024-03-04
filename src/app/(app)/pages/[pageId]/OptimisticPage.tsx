"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/pages/useOptimisticPages";
import { type Page } from "@/lib/db/schema/pages";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PageForm from "@/components/pages/PageForm";


export default function OptimisticPage({ 
  page,
   
}: { 
  page: Page; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Page) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPage, setOptimisticPage] = useOptimistic(page);
  const updatePage: TAddOptimistic = (input) =>
    setOptimisticPage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PageForm
          page={optimisticPage}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPage.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPage.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPage, null, 2)}
      </pre>
    </div>
  );
}
