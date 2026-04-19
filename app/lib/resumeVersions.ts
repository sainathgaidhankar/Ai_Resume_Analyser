export const normalizeGroupPart = (value?: string) =>
    (value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "general";

export const buildVersionGroupId = ({
    companyName,
    jobTitle,
    analysisMode,
}: {
    companyName?: string;
    jobTitle?: string;
    analysisMode?: Resume["analysisMode"];
}) =>
    [
        normalizeGroupPart(companyName),
        normalizeGroupPart(jobTitle),
        normalizeGroupPart(analysisMode || "software"),
    ].join("__");

export const getNextVersionNumber = (resumes: Resume[], versionGroupId: string) => {
    const versions = resumes
        .filter((resume) => resume.versionGroupId === versionGroupId)
        .map((resume) => resume.versionNumber || 1);

    return versions.length > 0 ? Math.max(...versions) + 1 : 1;
};

export const sortResumesByDate = (resumes: Resume[]) =>
    [...resumes].sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return right - left;
    });
