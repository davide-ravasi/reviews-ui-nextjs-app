import type { Metadata } from 'next';
import Heading from '@/components/Heading';
import ShareLinkButton from '@/components/ShareLinkButton';
import { getReview, getSlugs } from '@/lib/reviews';
import Image from 'next/image';

interface ReviewPageParams {
  slug: string;
}

interface ReviewPageProps {
  params: ReviewPageParams;
}

// The generateStaticParams function can be used in combination with dynamic route segments to statically generate routes at build time instead of on-demand at request time.
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams(): Promise<ReviewPageParams[]> {
  const slugs = await getSlugs();
  const slugsMap = slugs.map((slug) => ({ slug }));
  return slugsMap;
}

// export async function generateMetadata({ params: { slug } }: ReviewPageProps): Promise<Metadata> {
//   const review = await getReview(slug);
//   return {
//     title: review.title,
//   };
// }


// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function ReviewPage({ params: { slug } }: ReviewPageProps) {
  const review = await getReview(slug);
  return (
    <>
      <Heading>{review.title}</Heading>
      <div className="flex gap-3 items-baseline">
        <p className="italic pb-2">{review.date}</p>
        <ShareLinkButton />
      </div>
      {/* <img src={review.image} alt=""
        width="640" height="360" className="mb-2 rounded"
      /> */}
      <Image src={review.image} alt=""
        width="640" height="360" className="mb-2 rounded" />
      <article dangerouslySetInnerHTML={{ __html: review.body }}
        className="max-w-screen-sm prose prose-slate"
      />
    </>
  );
}
