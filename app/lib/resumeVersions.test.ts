import { describe, expect, it } from "vitest";
import {
    buildVersionGroupId,
    getNextVersionNumber,
    normalizeGroupPart,
    sortResumesByDate,
} from "./resumeVersions";

describe("resume version helpers", () => {
    it("normalizes group parts for stable grouping", () => {
        expect(normalizeGroupPart("Senior Frontend Developer")).toBe("senior-frontend-developer");
        expect(normalizeGroupPart("")).toBe("general");
    });

    it("builds consistent version group ids", () => {
        expect(
            buildVersionGroupId({
                companyName: "OpenAI",
                jobTitle: "Frontend Engineer",
                analysisMode: "software",
            })
        ).toBe("openai__frontend-engineer__software");
    });

    it("increments version numbers inside the same group", () => {
        const resumes = [
            {
                id: "1",
                imagePath: "",
                resumePath: "",
                versionGroupId: "group-a",
                versionNumber: 1,
                feedback: null,
            },
            {
                id: "2",
                imagePath: "",
                resumePath: "",
                versionGroupId: "group-a",
                versionNumber: 2,
                feedback: null,
            },
        ] as Resume[];

        expect(getNextVersionNumber(resumes, "group-a")).toBe(3);
        expect(getNextVersionNumber(resumes, "group-b")).toBe(1);
    });

    it("sorts resumes from newest to oldest", () => {
        const sorted = sortResumesByDate([
            { id: "1", imagePath: "", resumePath: "", createdAt: "2026-04-20T00:00:00.000Z", feedback: null },
            { id: "2", imagePath: "", resumePath: "", createdAt: "2026-04-22T00:00:00.000Z", feedback: null },
        ] as Resume[]);

        expect(sorted.map((item) => item.id)).toEqual(["2", "1"]);
    });
});
