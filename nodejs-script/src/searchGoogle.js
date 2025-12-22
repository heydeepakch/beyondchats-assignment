import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const SERPER_API_KEY = process.env.SERPER_API_KEY;

export default async function searchGoogle(query) {
  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: query,
        num: 5,
      },
      {
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.organic || [];

    //Filtering links that are not from BeyondChats site and are blog related
    const filtered = results
      .map((r) => r.link)
      .filter(
        (link) =>
          !link.includes("beyondchats.com") &&
          (link.includes("/blog") ||
            link.includes("/article") ||
            link.includes("/post"))
      );

    return filtered.slice(0, 2);
  } catch (error) {
    console.error("Failed to search Google");
    console.error(error.message);
    return [];
  }
}
