import fetchLatestArticle from "./fetchLatestArticle.js";
import checkUpdatedExists from "./checkUpdatedExists.js";
import searchGoogle from "./searchGoogle.js";
import scrapeArticle from "./scrapeArticle.js";
import rewriteWithLLM from "./rewriteWithLLM.js";
import publishUpdatedArticle from "./publishUpdatedArticle.js";

async function main() {
  try {
    console.log("Starting the script...");

    // Fetching latest original article
    console.log("Fetching latest original article...");
    const latestOriginalArticle = await fetchLatestArticle();
    if (!latestOriginalArticle) {
      console.log("No latest original article found");
      return;
    }

    // Checking if updated article exists
    console.log("Checking if updated article exists...");
    const updatedArticle = await checkUpdatedExists(latestOriginalArticle.id);
    if (updatedArticle) {
      console.log("Updated article already exists, Exiting script!");
      return;
    }
    console.log("No updated article found, continuing...");


    // Search Google
    console.log("Searching for blog links on Google...");
    const googleLinks = await searchGoogle(latestOriginalArticle.title);
    if (googleLinks.length < 2) {
      console.log("Not enough blog links found on Google, Exiting script!");
      return;
    }

    // Scrape reference articles
    console.log("Scraping reference articles...");
    const referenceContentArray = [];
    for (const link of googleLinks) {
      const referenceContent = await scrapeArticle(link);
      referenceContentArray.push(referenceContent);
    }

    // Invoke and rewrite article with LLM
    console.log("Rewriting article with LLM...");
    const rewrittenArticle = await rewriteWithLLM({
      originalContent: latestOriginalArticle.content,
      referenceContent: referenceContentArray,
    });

    // Stich rewritten article with reference links
    const finalContent = `${rewrittenArticle}

---
# References
${googleLinks.map((r, i) => `${i + 1}. [${r}](${r})`).join("\n")}`;


    // Publish updated article
    console.log("Publishing updated article...");
    const publishedArticle = await publishUpdatedArticle({
      title: latestOriginalArticle.title,
      content: finalContent,
      parent_id: latestOriginalArticle.id,
    });
    if (!publishedArticle) {
      console.log("Failed to publish updated article, Exiting script!");
      return;
    }
    console.log("Article published successfully");


    
    console.log("Script completed successfully!");
  } catch (error) {
    console.error("Error in main function");
    console.error(error.message);
  }
}

main();
