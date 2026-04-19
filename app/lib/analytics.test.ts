import { describe, expect, it } from "vitest";
import { buildAnalytics } from "./analytics";

const resumeFactory = (overrides: Partial<Resume> = {}): Resume => ({
    id: crypto.randomUUID(),
    imagePath: "/image.png",
    resumePath: "/resume.pdf",
    feedback: {
        overallScore: 80,
        ATS: { score: 75, tips: [] },
        toneAndStyle: { score: 70, tips: [] },
        content: { score: 72, tips: [] },
        structure: { score: 68, tips: [] },
        skills: { score: 66, tips: [] },
        jobMatch: {
            score: 64,
            summary: "summary",
            matchedKeywords: ["React"],
            missingKeywords: ["Node.js", "SQL"],
        },
        sectionAnalysis: {
            summary: "section summary",
            missingSections: [],
            detectedSections: [
                {
                    name: "Experience",
                    present: true,
                    score: 55,
                    importance: "core",
                    strengths: [],
                    improvements: [],
                },
            ],
        },
    },
    ...overrides,
});

describe("buildAnalytics", () => {
    it("aggregates counts and average scores from stored resumes", () => {
        const analytics = buildAnalytics([
            resumeFactory({ jobTitle: "Frontend Developer", analysisMode: "software" }),
            resumeFactory({
                jobTitle: "Frontend Developer",
                analysisMode: "software",
                feedback: {
                    ...resumeFactory().feedback!,
                    overallScore: 60,
                    ATS: { score: 50, tips: [] },
                    jobMatch: {
                        score: 40,
                        summary: "summary",
                        matchedKeywords: ["HTML"],
                        missingKeywords: ["SQL"],
                    },
                    sectionAnalysis: {
                        summary: "section summary",
                        missingSections: [],
                        detectedSections: [
                            {
                                name: "Projects",
                                present: false,
                                score: 30,
                                importance: "supporting",
                                strengths: [],
                                improvements: [],
                            },
                        ],
                    },
                },
            }),
        ]);

        expect(analytics.totalResumes).toBe(2);
        expect(analytics.averageOverallScore).toBe(70);
        expect(analytics.averageATSScore).toBe(63);
        expect(analytics.targetedRoles[0]).toEqual({ label: "Frontend Developer", count: 2 });
        expect(analytics.missingSkills[0]).toEqual({ label: "SQL", count: 2 });
        expect(analytics.weakSections[0].label).toBe("Experience");
        expect(analytics.analysisModes[0]).toEqual({ label: "software", count: 2 });
    });
});
