import { Suspense } from "react";

import Loading from "@/app/loading";
import PageLinkList from "@/components/pageLinks/PageLinkList";
import { getPageLinks } from "@/lib/api/pageLinks/queries";
import { getPages } from "@/lib/api/pages/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function PageLinksPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Page Links</h1>
        </div>
        <PageLinks />
      </div>
    </main>
  );
}

const PageLinks = async () => {
  await checkAuth();

  const { pageLinks } = await getPageLinks();
  const { pages } = await getPages();
  return (
    <Suspense fallback={<Loading />}>
      <PageLinkList pageLinks={pageLinks} pages={pages} />
    </Suspense>
  );
};
