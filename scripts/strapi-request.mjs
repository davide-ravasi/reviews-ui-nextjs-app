import { writeFileSync } from 'node:fs';
import qs from 'qs';

// const query = qs.stringify(
//   {
//     fields: ['slug', 'title', 'subtitle', 'publishedAt'],
//     populate: {
//       image: {
//         fields: 'url'
//       }
//     },
//     sort: ['publishedAt:desc'],
//     pagination: {
//       pageSize: 6,
//     },
//   },
//   {
//     encodeValuesOnly: true, // prettify URL and doon't include parameters name
//   }
// );

const query = qs.stringify({
  fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
  populate: {
    image: {
      fields: 'url'
    }
  },
  filters: {
    slug: {
      $eq: 'hades-2018',
    },
  },
}, {
  encodeValuesOnly: true, // prettify URL
});

const reviewsUrl = "https://1337-davideravas-reviewscmss-fad3fyv2ra8.ws-eu116.gitpod.io/api/reviews?" + query;

console.log(reviewsUrl);

const response = await fetch(reviewsUrl);
console.log("response", response);

const json = await response.json();
console.log(JSON.stringify(json, null, 2));
writeFileSync("scripts/strapi-response.json", JSON.stringify(json, null, 2), 'utf8');