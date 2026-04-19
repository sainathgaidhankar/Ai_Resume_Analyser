const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "our",
    "the",
    "to",
    "we",
    "with",
    "you",
    "your",
]);

const NORMALIZATION_MAP: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    reactjs: "react",
    nodejs: "node.js",
    nextjs: "next.js",
    expressjs: "express",
    aws: "aws",
    gcp: "gcp",
};

const multiWordPatterns = [
    /\bmachine learning\b/gi,
    /\bdeep learning\b/gi,
    /\bdata analysis\b/gi,
    /\bdata analytics\b/gi,
    /\bproject management\b/gi,
    /\bproduct management\b/gi,
    /\bsoftware development\b/gi,
    /\bweb development\b/gi,
    /\bproblem solving\b/gi,
    /\bteam leadership\b/gi,
    /\bcloud computing\b/gi,
    /\bdata structures\b/gi,
    /\bcomputer vision\b/gi,
    /\bnatural language processing\b/gi,
    /\bquality assurance\b/gi,
    /\buser experience\b/gi,
    /\buser interface\b/gi,
    /\bversion control\b/gi,
    /\bcontinuous integration\b/gi,
    /\bcontinuous delivery\b/gi,
    /\brest api\b/gi,
];

const ROLE_KEYWORDS: Record<string, string[]> = {
    software: ["algorithms", "debugging", "git", "api", "testing"],
    frontend: ["html", "css", "javascript", "react", "responsive design"],
    backend: ["api", "database", "node.js", "sql", "system design"],
    data: ["python", "sql", "data analysis", "machine learning", "statistics"],
    marketing: ["seo", "content strategy", "campaigns", "analytics", "branding"],
    finance: ["financial modeling", "excel", "reporting", "forecasting", "analysis"],
};

const normalizeKeyword = (keyword: string) => {
    const cleaned = keyword.trim().toLowerCase();

    return NORMALIZATION_MAP[cleaned] || cleaned;
};

const scoreKeyword = (keyword: string, description: string, title: string) => {
    const normalized = normalizeKeyword(keyword);
    const regex = new RegExp(`\\b${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const descriptionMatches = description.match(regex)?.length || 0;
    const titleMatches = title.includes(normalized) ? 2 : 0;
    const lengthBonus = normalized.includes(" ") ? 2 : Math.min(normalized.length / 6, 2);

    return descriptionMatches * 3 + titleMatches + lengthBonus;
};

export const extractTargetKeywords = (jobTitle: string, jobDescription: string) => {
    const normalizedTitle = jobTitle.toLowerCase();
    const normalizedDescription = jobDescription.toLowerCase();
    const keywords = new Set<string>();

    for (const pattern of multiWordPatterns) {
        const matches = normalizedDescription.match(pattern);
        matches?.forEach((match) => keywords.add(normalizeKeyword(match)));
    }

    const tokens = normalizedDescription
        .replace(/[^a-z0-9+.#/\-\s]/gi, " ")
        .split(/\s+/)
        .map(normalizeKeyword)
        .filter(
            (token) =>
                token.length > 2 &&
                !STOP_WORDS.has(token) &&
                /[a-z]/i.test(token)
        );

    tokens.forEach((token) => keywords.add(token));

    Object.entries(ROLE_KEYWORDS).forEach(([role, roleKeywords]) => {
        if (normalizedTitle.includes(role)) {
            roleKeywords.forEach((keyword) => keywords.add(keyword));
        }
    });

    return [...keywords]
        .sort((a, b) => scoreKeyword(b, normalizedDescription, normalizedTitle) - scoreKeyword(a, normalizedDescription, normalizedTitle))
        .slice(0, 12);
};

export const buildKeywordPromptBlock = (keywords: string[]) =>
    keywords.length > 0
        ? `Target role keywords: ${keywords.join(", ")}`
        : "Target role keywords: none extracted; infer role keywords cautiously from the title and resume.";
