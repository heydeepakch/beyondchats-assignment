import fetchLatestArticle from "./fetchLatestArticle.js";

async function fetchLatest(){
    const article = await fetchLatestArticle();
    console.log(article)
}

fetchLatest()