import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function rewriteWithLLM({ originalContent, referenceContent }) {
  try {
    const prompt = `
You are an expert content editor.

You are given:
1. An original article.
2. Two reference articles that rank well on Google.

Your task:
- Rewrite and improve the original article.
- Use better structure and clear headings.
- Make the content SEO-friendly and engaging.
- Keep the content fully original.
- Do NOT include Title in the rewritten article and directly start with the content.
- Do NOT copy sentences from reference articles.
- Do NOT include any references or URLs.
- Output the result in valid Markdown format.

Original Article:
"""
${originalContent}
"""

Reference Articles:
"""
${referenceContent.join("\n\n")}
"""
`;

const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
         
          parts: [
            { text: prompt },
          ],
        },
      ],
    }
  );

    const rewrittenText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rewrittenText) {
      throw new Error("Empty response from Gemini");
    }

    return rewrittenText.trim();
  }catch (error) {
    console.error("Failed to rewrite with LLM");
    console.error(error.message);
    return null;
  }
}
