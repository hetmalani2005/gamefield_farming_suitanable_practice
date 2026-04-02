const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "d:/sgp-gamefield/sgp-gamefield/backend/.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-1.0-pro"
];

async function test() {
  console.log("Starting model availability test (Tracing precise model IDs)...");
  for (const name of models) {
    for (const version of ["v1", "v1beta"]) {
      try {
        console.log(`Testing model: ${name} (${version})...`);
        const model = genAI.getGenerativeModel({ model: name }, { apiVersion: version });
        const result = await model.generateContent("Say hello");
        console.log(`✅ ${name} (${version}) SUCCESS: ${result.response.text().trim()}`);
        break; 
      } catch (e) {
        console.error(`❌ ${name} (${version}) ERROR: ${e.message}`);
      }
    }
  }
}

test();
