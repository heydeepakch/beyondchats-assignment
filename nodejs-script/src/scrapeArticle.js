import axios from 'axios';
import {load} from 'cheerio';

export default async function scrapeArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const html = response.data;
    const $ = load(html);

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, iframe, noscript').remove();

    let content = '';

    // Selectors to extract article content
    const selectors = [
      'article',
      'main',
      '.article-body',
      '.body-content',
      '#body-content',
      '.post-content',
      '.article-content',
      '.content'
    ];

    // Try each selector in order to get the article content and break if we find it
    for (const selector of selectors) {
      if ($(selector).length) {
        content = $(selector).text();
        break;
      }
    }

    // Fallback to body text if nothing matched
    if (!content) {
      content = $('body').text();
    }

    // Clean up whitespace and newlines
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    // Limit size to avoid feeding huge text to LLM
    const MAX_LENGTH = 10000;
    if (content.length > MAX_LENGTH) {
      content = content.substring(0, MAX_LENGTH);
    }

    return content;
  } catch (error) {
    console.error(`Failed to scrape article: ${url}`);
    console.error(error.message);
    return "";
  }
}