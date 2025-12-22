import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.LARAVEL_BASE_URL;

export default async function fetchLatestArticle() {
  try {
    const response = await axios.get(`${BASE_URL}/articles/latest`);

    if (!response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch latest article');
    console.error(error.message);
    return null;
  }
}
