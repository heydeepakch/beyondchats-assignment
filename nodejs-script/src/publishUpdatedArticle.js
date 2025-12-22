import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.LARAVEL_BASE_URL;

export default async function publishUpdatedArticle({
  title,
  content,
  parent_id,
}) {
  try {
    const payload = {
      title,
      content,
      status: "updated",
      parent_id,
    };

    const response = await axios.post(`${BASE_URL}/articles`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to publish updated article");
    console.error(error.message);

    return null;
  }
}
