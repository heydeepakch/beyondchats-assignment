import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.LARAVEL_BASE_URL;

export default async function checkUpdatedExists(originalArticleId) {
  try {
    const response = await axios.get(`${BASE_URL}/articles/${originalArticleId}/updated`);

    // If updated article exists then Laravel will return the updated article
    if (response.data) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to check if updated article exists');
    console.error(error.message);

    // Fail-safe: assume updated exists to avoid duplication
    return true;
  }
}
