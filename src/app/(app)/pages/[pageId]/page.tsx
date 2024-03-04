import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPageByIdWithPageLinks } from "@/lib/api/pages/queries";
import OptimisticPage from "./OptimisticPage";
import { checkAuth } from "@/lib/auth/utils";
import PageLinkList from "@/components/pageLinks/PageLinkList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PagePage({
  params,
}: {
  params: { pageId: string };
}) {

  return (
    <main className="overflow-auto">
      <Page id={params.pageId} />
    </main>
  );
}

const Page = async ({ id }: { id: string }) => {
  await checkAuth();

  const { page, pageLinks } = await getPageByIdWithPageLinks(id);
  

  if (!page) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="pages" />
        <OptimisticPage page={page}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{page.name}&apos;s Page Links</h3>
        <PageLinkList
          pages={[]}
          pageId={page.id}
          pageLinks={pageLinks}
        />
      </div>
    </Suspense>
  );
};
