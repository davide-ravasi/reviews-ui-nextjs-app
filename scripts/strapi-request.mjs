const reviewsUrl = "https://1337-davideravas-reviewscmss-fad3fyv2ra8.ws-eu116.gitpod.io/api/reviews";

const response = await fetch(reviewsUrl);

const json = await response.json();
console.log(JSON.stringify(json, null, 2));