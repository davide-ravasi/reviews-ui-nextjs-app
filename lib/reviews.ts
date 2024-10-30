import { readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import qs from "qs";
const CMS_URL =
  "https://1337-davideravas-reviewscmss-fad3fyv2ra8.ws-eu116.gitpod.io";
const API_URL =
  "https://1337-davideravas-reviewscmss-fad3fyv2ra8.ws-eu116.gitpod.io/api/";

export interface Review {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  body: string;
}

export async function getFeaturedReview(): Promise<Review> {
  const reviews = await getReviews();
  return reviews[0];
}

export async function getReview(slug: string): Promise<Review> {
  // const text = await readFile(`./content/reviews/${slug}.md`, "utf8");
  // const {
  //   content,
  //   data: { title, date, image },
  // } = matter(text);
  // const body = marked(content);
  const query = qs.stringify(
    {
      fields: ["slug", "title", "subtitle", "publishedAt", "body"],
      populate: {
        image: {
          fields: "url",
        },
      },
      filters: {
        slug: {
          $eq: slug,
        },
      },
      pagination: { pageSize: 1, withCount: false },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  const reviewUrl = API_URL + "/reviews?" + query;
  const response = await fetch(reviewUrl);
  const { data } = await response.json();
  const review = data[0];
  const { title, subtitle, body } = review.attributes;

  return {
    slug: review.attributes.slug,
    title,
    subtitle,
    date: review.attributes.publishedAt.slice(0, "yyyy-mm-dd".length),
    image: CMS_URL + review.attributes.image.data.attributes.url,
    body: marked(body),
  };
}

export async function getReviews(): Promise<Review[]> {
  // const slugs = await getSlugs();
  // const reviews: Review[] = [];
  // for (const slug of slugs) {
  //   const review = await getReview(slug);
  //   reviews.push(review);
  // }
  // reviews.sort((a, b) => b.date.localeCompare(a.date));
  // so we use the qs library to easily add parameters to
  // the strapi request as recommended by the framework
  // https://docs.strapi.io/dev-docs/api/rest/populate-select
  const query = qs.stringify(
    {
      fields: ["slug", "title", "subtitle", "publishedAt"],
      populate: {
        image: {
          fields: "url",
        },
      },
      sort: ["publishedAt:desc"],
      pagination: {
        pageSize: 6,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL and don't include parameters name
    }
  );

  const reviewsUrl = API_URL + "/reviews?" + query;
  const response = await fetch(reviewsUrl);
  const json = await response.json();

  const reviews = json.data.map((review) => {
    const { slug, title, subtitle } = review.attributes;
    return {
      slug,
      title,
      subtitle,
      date: review.attributes.publishedAt.slice(0, "yyyy-mm-dd".length),
      image: CMS_URL + review.attributes.image.data.attributes.url,
    };
  });

  return reviews;
}

export async function getSlugs(): Promise<string[]> {
  const files = await readdir("./content/reviews");
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -".md".length));
}
