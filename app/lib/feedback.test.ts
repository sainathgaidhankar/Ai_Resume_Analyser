import { describe, expect, it } from "vitest";
import { parseFeedbackResponse } from "./feedback";

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
});
