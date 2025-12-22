import fetchLatestArticle from "./fetchLatestArticle.js";
import checkUpdatedExists from "./checkUpdatedExists.js";
import searchGoogle from "./searchGoogle.js";
import scrapeArticle from "./scrapeArticle.js";
import rewriteWithLLM from "./rewriteWithLLM.js";
import publishUpdatedArticle from "./publishUpdatedArticle.js";

async function main() {
  try {
    const latestOriginalArticle = await fetchLatestArticle();
    if (!latestOriginalArticle) {
      console.log("No latest original article found");
    }

    // const updatedArticle = await checkUpdatedExists(latestOriginalArticle.id);

    // if(updatedArticle){
    //     console.log('Updated article found in DB!');
    //     return;
    // }

    const googleLinks = await searchGoogle(latestOriginalArticle.title);
    if (googleLinks.length === 0) {
      console.log("No blog links found on Google!");
    }

    console.log(googleLinks);

    const referenceContentArray = [];
    for (const link of googleLinks) {
        const referenceContent = await scrapeArticle(link);
        referenceContentArray.push(referenceContent);
    }
    // console.log(referenceContentArray);

    const rewrittenArticle = await rewriteWithLLM({ originalContent: latestOriginalArticle.content, referenceContent: referenceContentArray });
    if (!rewrittenArticle) {
      console.log("Failed to rewrite article with LLM");
      return;
    }
    console.log("Rewritten Article from LLM:");
    console.log(rewrittenArticle);

    const publishedArticle = await publishUpdatedArticle({ title: latestOriginalArticle.title, content: rewrittenArticle, parent_id: latestOriginalArticle.id });
    console.log("Article published successfully");
    console.log(publishedArticle);

  } catch (error) {
    console.error("Error in main function");
    console.error(error.message);
  }
}

main();
