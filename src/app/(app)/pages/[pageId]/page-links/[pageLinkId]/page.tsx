import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPageLinkById } from "@/lib/api/pageLinks/queries";
import { getPages } from "@/lib/api/pages/queries";import OptimisticPageLink from "@/app/(app)/page-links/[pageLinkId]/OptimisticPageLink";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PageLinkPage({
  params,
}: {
  params: { pageLinkId: string };
}) {

  return (
    <main className="overflow-auto">
      <PageLink id={params.pageLinkId} />
    </main>
  );
}

const PageLink = async ({ id }: { id: string }) => {
  await checkAuth();

  const { pageLink } = await getPageLinkById(id);
  const { pages } = await getPages();

  if (!pageLink) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="page-links" />
        <OptimisticPageLink pageLink={pageLink} pages={pages}
        pageId={pageLink.pageId} />
      </div>
    </Suspense>
  );
};
