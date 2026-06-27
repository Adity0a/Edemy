import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateAIContent(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a professional blog writer. Generate a comprehensive blog post based on the given topic. Your output must be in pure HTML format ONLY. Do not include markdown code blocks (```html), do not include <html> or <body> tags, and do not include any introductory or concluding remarks. Just the HTML content for the blog post body.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return chatCompletion.choices[0]?.message?.content || "";
}

export default generateAIContent;
