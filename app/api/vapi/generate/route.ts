// import { generateText } from "ai";
// import { adminDB } from "@/firebase/admin";
// import { getRandomInterviewCover } from "@/lib/utils";
// import { google } from "@ai-sdk/google";

// export async function POST(request: Request) {
//   const { type, role, level, techstack, amount, userid } = await request.json();

//   try {
//     // custom prompting...
//     const { text: questions } = await generateText({
//       model: google('gemini-2.0-flash-001'),
//       prompt: `Prepare questions for a job interview.
//         The job role is ${role}.
//         The job experience level is ${level}.
//         The tech stack used in the job is: ${techstack}.
//         The focus between behavioural and technical questions should lean towards: ${type}.
//         The amount of questions required is: ${amount}.
//         Please return only the questions, without any additional text.
//         The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//         Return the questions formatted like this:
//         ["Question 1", "Question 2", "Question 3"]
        
//         Thank you! <3
//     `,
//     });

//     const interview = {
//       role: role,
//       type: type,
//       level: level,
//       techstack: techstack.split(","),
//       questions: JSON.parse(questions),
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };

//     await adminDB.collection("interviews").add(interview);

//     return Response.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return Response.json({ success: false, error: error }, { status: 500 });
//   }
// }

// export async function GET() {
//   return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
// }
// // we have to test it...  httpie
// // next.js ai sdk 
// // next.js route.ts


import { generateText } from "ai";
import { adminDB } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // ---------------------------
    // 1) Force Gemini JSON
    // ---------------------------
    const prompt = `
      Generate exactly ${amount} interview questions.

      ROLE: ${role}
      LEVEL: ${level}
      TECH STACK: ${techstack}
      STYLE: ${type}

      Return ONLY valid JSON matching this structure:

      {
        "questions": [
          { "question": "string", "answer": "string" }
        ]
      }

      ❗ STRICT:
      - No backticks
      - No markdown
      - No headings
      - Only JSON object
    `;

    const { text: raw } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
      responseFormat: {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    console.log("📝 Raw Gemini:", raw);

    // ---------------------------
    // 2) REMOVE MARKDOWN BLOCKS
    // ---------------------------
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧹 Clean JSON:", clean);

    // ---------------------------
    // 3) Parse JSON safely
    // ---------------------------
    let data;
    try {
      data = JSON.parse(clean);
    } catch (err) {
      console.error("❌ Invalid JSON:", err, clean);
      return Response.json(
        { success: false, error: "Gemini returned invalid JSON questions" },
        { status: 500 }
      );
    }

    // validation
    if (!data.questions || !Array.isArray(data.questions)) {
      return Response.json(
        { success: false, error: "Malformed JSON: missing questions" },
        { status: 500 }
      );
    }

    // ---------------------------
    // 4) Prepare interview object
    // ---------------------------
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map(t => t.trim()),
      questions: data.questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // ---------------------------
    // 5) Save to Firestore
    // ---------------------------
    const docRef = await adminDB.collection("interviews").add(interview);

    console.log("🔥 Saved:", docRef.id);

    return Response.json({ success: true, id: docRef.id }, { status: 200 });

  } catch (error) {
    console.error("❌ Route crashed:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}


export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}