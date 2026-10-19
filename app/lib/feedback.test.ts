import { describe, expect, it } from "vitest";
import { prepareInstructions } from "../../constants";
import { parseFeedbackResponse } from "./feedback";

describe("prepareInstructions", () => {
    it("bases analysis on the actual resume and JD and avoids generic certificate recommendations", () => {
        const prompt = prepareInstructions({
            jobTitle: "Sales Executive",
            jobDescription: "Drive revenue, manage customer pipeline, and build relationships with B2B clients.",
            targetKeywords: ["sales", "pipeline", "CRM"],
            analysisMode: "software",
        });

        expect(prompt).toContain("Analyze the actual resume content against the actual job description");
        expect(prompt).toContain("This is a general-role evaluation for all industries and job functions");
        expect(prompt).toContain("Ignore certificates unless the job description explicitly requires them");
        expect(prompt).toContain("Only recommend certifications when the job description explicitly requires them");
        expect(prompt).toContain("Do not force generic certificates");
        expect(prompt).toContain("Never say the resume is missing, not provided, unreadable, or absent unless the file truly cannot be accessed.");
        expect(prompt).toContain("5 interview questions with a short sample answer for each");
        expect(prompt).toContain("Include at least 4 rewrite suggestions, 3 impact suggestions");
        expect(prompt).toContain("overall score, job fit against the JD, key gaps, improvement actions, and interview-prep questions");
        expect(prompt).not.toContain("software/finance");
        expect(prompt).not.toContain("The analysis mode is: software");
    });
});

describe("parseFeedbackResponse", () => {
    it("repairs truncated JSON with an unterminated string", () => {
        const feedback = parseFeedbackResponse(`Here is the review:
{
  "overallScore": 82,
  "jobMatch": {
    "score": 75,
    "summary": "Strong alignment with React and TypeScript
  },
  "ATS": { "score": 74, "tips": [] },
  "toneAndStyle": { "score": 70, "tips": [] },
  "content": { "score": 69, "tips": [] },
  "structure": { "score": 68, "tips": [] },
  "skills": { "score": 67, "tips": [] }
}`);

        expect(feedback.overallScore).toBe(82);
        expect(feedback.jobMatch?.score).toBe(75);
        expect(feedback.jobMatch?.summary).toContain("React and TypeScript");
        expect(feedback.ATS.score).toBe(74);
    });

    it("parses score fields even when the model returns them as strings", () => {
        const feedback = parseFeedbackResponse(`{
  "overallScore": "82/100",
  "jobMatch": {
    "score": "75%",
    "summary": "Strong alignment",
    "matchedKeywords": [],
    "missingKeywords": []
  },
  "ATS": { "score": "74 points", "tips": [] },
  "toneAndStyle": { "score": "70", "tips": [] },
  "content": { "score": "69.5", "tips": [] },
  "structure": { "score": "68", "tips": [] },
  "skills": { "score": "67", "tips": [] }
}`);

        expect(feedback.overallScore).toBe(82);
        expect(feedback.jobMatch?.score).toBe(75);
        expect(feedback.ATS.score).toBe(74);
        expect(feedback.content.score).toBe(70);
    });

    it("repairs unescaped quotes and ignores trailing text after the JSON object", () => {
        const feedback = parseFeedbackResponse(`\`\`\`json
{
  "overallScore": 91,
  "jobMatch": {
    "score": 88,
    "summary": "He called the app "production-ready" during review",
    "matchedKeywords": ["react"],
    "missingKeywords": []
  },
  "ATS": { "score": 90, "tips": [] },
  "toneAndStyle": { "score": 89, "tips": [] },
  "content": { "score": 88, "tips": [] },
  "structure": { "score": 87, "tips": [] },
  "skills": { "score": 86, "tips": [] }
}
\`\`\`
Extra text that should be ignored.
`);

        expect(feedback.overallScore).toBe(91);
        expect(feedback.jobMatch?.summary).toContain("production-ready");
        expect(feedback.jobMatch?.matchedKeywords).toEqual(["react"]);
        expect(feedback.ATS.score).toBe(90);
    });

    it("keeps interview question answers when the model returns them", () => {
        const feedback = parseFeedbackResponse(`{
  "overallScore": 88,
  "jobMatch": { "score": 84, "summary": "Strong fit", "matchedKeywords": ["customer service"], "missingKeywords": ["sales"] },
  "ATS": { "score": 86, "tips": [] },
  "toneAndStyle": { "score": 82, "tips": [] },
  "content": { "score": 84, "tips": [] },
  "structure": { "score": 80, "tips": [] },
  "skills": { "score": 85, "tips": [] },
  "interviewQuestions": [{
    "category": "Experience",
    "question": "Tell me about handling customer complaints.",
    "rationale": "Checks problem-solving and empathy.",
    "answer": "I listened carefully, clarified the issue, followed the company process, and ensured the customer received a clear resolution with follow-up."
  }]
}`);

        expect(feedback.interviewQuestions?.[0]?.answer).toContain("listened carefully");
    });
});
