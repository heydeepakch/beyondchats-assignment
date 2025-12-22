import fetchLatestArticle from "./fetchLatestArticle.js";
import checkUpdatedExists from "./checkUpdatedExists.js";
import searchGoogle from "./searchGoogle.js";
import scrapeArticle from "./scrapeArticle.js";
import rewriteWithLLM from "./rewriteWithLLM.js";
import publishUpdatedArticle from "./publishUpdatedArticle.js";

async function main() {
  try {
    console.log("Starting the script...");

    const latestOriginalArticle = await fetchLatestArticle();

    if (!latestOriginalArticle) {
      console.log("No latest original article found");
      return;
    }

    const updatedArticle = await checkUpdatedExists(latestOriginalArticle.id);

    if (updatedArticle) {
      console.log("Updated article already exists in DB, Exiting script!");
      return;
    }

    const googleLinks = await searchGoogle(latestOriginalArticle.title);
    if (googleLinks.length < 2) {
      console.log("Not enough blog links found on Google, Exiting script!");
      return;
    }

    const referenceContentArray = [];
    for (const link of googleLinks) {
      const referenceContent = await scrapeArticle(link);
      referenceContentArray.push(referenceContent);
    }

    const rewrittenArticle = await rewriteWithLLM({
      originalContent: latestOriginalArticle.content,
      referenceContent: referenceContentArray,
    });

    const finalContent = `${rewrittenArticle}

---
# References
${googleLinks.map((r, i) => `${i + 1}. [${r}](${r})`).join("\n")}`;

    const publishedArticle = await publishUpdatedArticle({
      title: latestOriginalArticle.title,
      content: finalContent,
      parent_id: latestOriginalArticle.id,
    });
    console.log("Article published successfully");
    console.log(publishedArticle);
  } catch (error) {
    console.error("Error in main function");
    console.error(error.message);
  }
}

main();
