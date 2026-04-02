const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "d:/sgp-gamefield/sgp-gamefield/backend/.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
  for (const m of models) {
     for (const v of ["v1", "v1beta"]) {
        try {
          console.log(`Testing ${m} on ${v}...`);
          const model = genAI.getGenerativeModel({ model: m }, { apiVersion: v });
          const result = await model.generateContent("hello");
          console.log(`✅ ${m} (${v}) SUCCESS: ${result.response.text()}`);
          return;
        } catch (e) {
          console.error(`❌ ${m} (${v}) FAIL: ${e.message}`);
        }
     }
  }
}

test();
