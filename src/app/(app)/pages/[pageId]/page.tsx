import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import OptimisticPage from './OptimisticPage';
import TogglePublic from './_components/TogglePublic';
import PageLinkList from '@/components/pageLinks/PageLinkList';
import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { checkAuth } from '@/lib/auth/utils';
import { getPageByIdWithPageLinks } from '@/lib/api/pages/queries';
import { getUserSubscriptionPlan } from '@/lib/stripe/subscription';

export const revalidate = 0;

export default async function PagePage({
  params,
}: {
  params: { pageId: string };
}) {
  return (
    <main className='overflow-auto'>
      <Page id={params.pageId} />
    </main>
  );
}

const Page = async ({ id }: { id: string }) => {
  await checkAuth();
  const { isSubscribed } = await getUserSubscriptionPlan();

  const { page, pageLinks } = await getPageByIdWithPageLinks(id);

  if (!page) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='pages' />
        <OptimisticPage page={page} />
      </div>
      <TogglePublic page={page} isSubscribed={Boolean(isSubscribed)} />
      <div className='relative mx-4 mt-8'>
        <h3 className='mb-4 text-xl font-medium'>
          {page.name}&apos;s Page Links
        </h3>
        <PageLinkList pages={[]} pageId={page.id} pageLinks={pageLinks} />
      </div>
    </Suspense>
  );
};
