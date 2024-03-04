'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/pages/useOptimisticPages';
import { type Page } from '@/lib/db/schema/pages';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import PageForm from '@/components/pages/PageForm';

export default function OptimisticPage({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Page) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPage, setOptimisticPage] = useOptimistic(page);
  const updatePage: TAddOptimistic = input =>
    setOptimisticPage({ ...input.data });

  return (
    <div className='m-4'>
      <Modal open={open} setOpen={setOpen}>
        <PageForm
          page={optimisticPage}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePage}
        />
      </Modal>
      <div className='mb-4 flex items-end justify-between'>
        <h1 className='text-2xl font-semibold'>{optimisticPage.name}</h1>
        <Button className='' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'text-wrap break-all rounded-lg bg-secondary p-4',
          optimisticPage.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticPage, null, 2)}
      </pre>
    </div>
  );
}
