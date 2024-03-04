'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updatePageAction } from '@/lib/actions/pages';
import { Page } from '@/lib/db/schema/pages';

export default function TogglePublic({
  isSubscribed,
  page,
}: {
  isSubscribed: boolean;
  page: Page;
}) {
  const pageLink = 'http://localhost:3000/share/' + page.slug;
  return (
    <div className='relative'>
      {isSubscribed ? null : (
        <div className='absolute right-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-white opacity-90'>
          <p className='mb-2 select-none text-lg font-bold'>
            You need to subscribe to share this page
          </p>
          <Button asChild variant={'secondary'}>
            <Link href='/account/billing'>Subscribe</Link>
          </Button>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Share this page</CardTitle>
          <CardDescription>
            Anyone with the link can view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {page.public ? (
            <div className='flex space-x-2'>
              <Input value={pageLink} readOnly disabled={!isSubscribed} />
              <Button
                variant='secondary'
                className='shrink-0'
                disabled={!isSubscribed}
                onClick={() => {
                  navigator.clipboard.writeText(pageLink);
                  toast.success('Copied to clipboard');
                }}
              >
                Copy Link
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={async () =>
                  await updatePageAction({ ...page, public: true })
                }
              >
                Make public
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
