const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
async function run() {
  const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Test");
  console.log(models.response.text());
}
run().catch(console.error);
