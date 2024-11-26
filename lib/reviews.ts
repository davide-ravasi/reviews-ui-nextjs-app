import { marked } from "marked";
import qs from "qs";
const CMS_URL =
  "https://1337-davideravas-reviewscmss-u5ly3m8kd39.ws-eu116.gitpod.io";
const API_URL =
  "https://1337-davideravas-reviewscmss-u5ly3m8kd39.ws-eu116.gitpod.io/api/";

//1337-davideravas-reviewscmss-u5ly3m8kd39.ws-eu116.gitpod.io

export interface Review {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  body: string;
}

// export async function getFeaturedReview(): Promise<Review> {
//   const reviews = await getReviews();
//   return reviews[0];
// }

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

  const { data } = await fetchReviews(query);
  const review = data[0];

  return {
    ...toReview(review),
    body: marked(review.attributes.body),
  };
}

export async function getReviews(count: number): Promise<Review[]> {
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
        pageSize: count,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL and don't include parameters name
    }
  );

  const { data } = await fetchReviews(query);

  const reviews = data?.map(toReview);

  return reviews;
}

async function fetchReviews(params) {
  const reviewsUrl = API_URL + "/reviews?" + params;
  const response = await fetch(reviewsUrl);

  if (!response.ok) {
    throw new Error("CMS returned" + response.status + " for " + reviewsUrl);
  }
  return await response.json();
}

function toReview(item) {
  const { attributes } = item;
  return {
    slug: attributes.slug,
    title: attributes.title,
    subtitle: attributes.subtitle,
    date: attributes.publishedAt.slice(0, "yyyy-mm-dd".length),
    image: CMS_URL + attributes.image.data.attributes.url,
  };
}

export async function getSlugs(): Promise<string[]> {
  // const files = await readdir("./content/reviews");
  // return files
  //   .filter((file) => file.endsWith(".md"))
  //   .map((file) => file.slice(0, -".md".length));
  const query = qs.stringify(
    {
      fields: ["slug"],
      sort: ["publishedAt:desc"],
      pagination: {
        pageSize: 100,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL and don't include parameters name
    }
  );
  const { data } = await fetchReviews(query);

  return data?.map((data) => data.attributes.slug);
}
