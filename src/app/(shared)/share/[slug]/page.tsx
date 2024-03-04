import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HomeIcon } from 'lucide-react';

import { getPageBySlugWithPageLinks } from '@/lib/api/pages/queries';

export default async function SharedPage({
  params,
}: {
  params: { slug: string };
}) {
  const { page, pageLinks } = await getPageBySlugWithPageLinks(params.slug);

  if (!page) notFound();
  if (!page.public) return <main>This page is not public</main>;

  return (
    <main>
      <div className='flex h-screen flex-col items-center justify-center bg-[#708238] px-4 py-8 text-center'>
        <header className='mb-10'>
          <div className='flex justify-center'>
            <div className='h-24 w-24 rounded-full bg-gray-300' />
          </div>
          <h1 className='mt-4 text-2xl font-bold text-white'>{page.name}</h1>
          <p className='text-white'>{page.description}</p>
        </header>
        <nav className='flex w-full max-w-md flex-1 flex-col gap-4'>
          {pageLinks.map(l => (
            <Link key={l.id} href={l.url}>
              <div className='flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4 transition-all duration-300 hover:bg-gray-200'>
                <HomeIcon className='h-5 w-5 text-gray-500' />
                <span className='text-gray-800'>{l.title}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
