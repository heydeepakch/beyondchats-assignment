import fetchLatestArticle from "./fetchLatestArticle.js";
import checkUpdatedExists from "./checkUpdatedExists.js";
import searchGoogle from "./searchGoogle.js";

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
  } catch (error) {
    console.error("Error in main function");
    console.error(error.message);
  }
}

main();
