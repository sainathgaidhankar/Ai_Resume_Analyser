const clampScore = (value: unknown) => {
    if (typeof value === "string") {
        const match = value.match(/-?\d+(?:\.\d+)?/);
        if (match) {
            value = Number(match[0]);
        }
    }

    const parsed = Math.round(Number(value));

    if (Number.isNaN(parsed)) return 0;

    return Math.max(0, Math.min(100, parsed));
};

const normalizeTip = (
    tip: Partial<{ type: "good" | "improve"; tip: string; explanation: string }>,
    includeExplanation = true
) => ({
    type: (tip.type === "good" ? "good" : "improve") as "good" | "improve",
    tip: typeof tip.tip === "string" && tip.tip.trim().length > 0 ? tip.tip : "Needs review",
    ...(includeExplanation
        ? {
              explanation:
                  typeof tip.explanation === "string" && tip.explanation.trim().length > 0
                      ? tip.explanation
                      : "No detailed explanation was returned by the AI response.",
          }
        : {}),
});

const normalizeKeywordList = (keywords: unknown) =>
    Array.isArray(keywords)
        ? keywords.filter((keyword): keyword is string => typeof keyword === "string" && keyword.trim().length > 0)
        : [];

const normalizeSection = (
    section: Partial<{
        name: string;
        present: boolean;
        score: number;
        importance: "core" | "supporting";
        strengths: string[];
        improvements: string[];
    }>
) => ({
    name:
        typeof section.name === "string" && section.name.trim().length > 0
            ? section.name
            : "Unknown Section",
    present: Boolean(section.present),
    score: clampScore(section.score),
    importance: section.importance === "supporting" ? "supporting" as const : "core" as const,
    strengths: normalizeKeywordList(section.strengths),
    improvements: normalizeKeywordList(section.improvements),
});

const normalizeRewriteSuggestion = (
    suggestion: Partial<{
        section: string;
        issue: string;
        original?: string;
        improved: string;
        reason: string;
    }>
) => ({
    section:
        typeof suggestion.section === "string" && suggestion.section.trim().length > 0
            ? suggestion.section
            : "General",
    issue:
        typeof suggestion.issue === "string" && suggestion.issue.trim().length > 0
            ? suggestion.issue
            : "Needs stronger wording",
    original:
        typeof suggestion.original === "string" && suggestion.original.trim().length > 0
            ? suggestion.original
            : undefined,
    improved:
        typeof suggestion.improved === "string" && suggestion.improved.trim().length > 0
            ? suggestion.improved
            : "Rewrite unavailable.",
    reason:
        typeof suggestion.reason === "string" && suggestion.reason.trim().length > 0
            ? suggestion.reason
            : "This rewrite is intended to be clearer and more role-aligned.",
});

const normalizeImpactSuggestion = (
    suggestion: Partial<{
        section: string;
        weakPhrase: string;
        strongerVerb: string;
        measurableVersion: string;
        metricHint: string;
    }>
) => ({
    section:
        typeof suggestion.section === "string" && suggestion.section.trim().length > 0
            ? suggestion.section
            : "General",
    weakPhrase:
        typeof suggestion.weakPhrase === "string" && suggestion.weakPhrase.trim().length > 0
            ? suggestion.weakPhrase
            : "Weak wording detected",
    strongerVerb:
        typeof suggestion.strongerVerb === "string" && suggestion.strongerVerb.trim().length > 0
            ? suggestion.strongerVerb
            : "Improved",
    measurableVersion:
        typeof suggestion.measurableVersion === "string" &&
        suggestion.measurableVersion.trim().length > 0
            ? suggestion.measurableVersion
            : "Add a result-focused line with concrete scale or outcome.",
    metricHint:
        typeof suggestion.metricHint === "string" && suggestion.metricHint.trim().length > 0
            ? suggestion.metricHint
            : "Include a realistic metric such as time saved, accuracy gained, users served, or process improvement.",
});

const normalizeCategory = (
    category: Partial<{
        score: number;
        tips: { type: "good" | "improve"; tip: string; explanation: string }[];
    }> = {}
) => ({
    score: clampScore(category.score),
    tips: Array.isArray(category.tips)
        ? category.tips.map((tip) => normalizeTip(tip) as Feedback["toneAndStyle"]["tips"][number])
        : [],
});

const normalizeATS = (
    category: Partial<{
        score: number;
        tips: { type: "good" | "improve"; tip: string }[];
    }> = {}
) => ({
    score: clampScore(category.score),
    tips: Array.isArray(category.tips)
        ? category.tips.map((tip) => normalizeTip(tip, false) as Feedback["ATS"]["tips"][number])
        : [],
});

const stripCodeFences = (value: string) => {
    const trimmed = value.trim();

    if (trimmed.startsWith("```")) {
        return trimmed
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "");
    }

    return trimmed;
};

const nextSignificantChar = (value: string, startIndex: number) => {
    for (let index = startIndex; index < value.length; index += 1) {
        const char = value[index];
        if (!/\s/.test(char)) return char;
    }

    return undefined;
};

const closeTokenFor = (token: string) => (token === "{" ? "}" : "]");

const repairJsonCandidate = (value: string) => {
    const startIndex = value.indexOf("{");

    if (startIndex === -1) return value;

    const source = value.slice(startIndex);
    const output: string[] = [];
    const stack: string[] = [];
    let inString = false;
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];

        if (inString) {
            if (escaped) {
                output.push(char);
                escaped = false;
                continue;
            }

            if (char === "\\") {
                output.push(char);
                escaped = true;
                continue;
            }

            if (char === '"') {
                const next = nextSignificantChar(source, index + 1);
                if (next === undefined || next === ":" || next === "," || next === "}" || next === "]") {
                    output.push(char);
                    inString = false;
                } else {
                    output.push("\\\"");
                }
                continue;
            }

            if (char === "\n") {
                const next = nextSignificantChar(source, index + 1);
                if (next === undefined || next === "," || next === "}" || next === "]" || next === '"') {
                    output.push('"');
                    inString = false;
                } else {
                    output.push("\\n");
                }
                continue;
            }

            if (char === "\r") {
                const next = nextSignificantChar(source, index + 1);
                if (next === undefined || next === "," || next === "}" || next === "]" || next === '"') {
                    output.push('"');
                    inString = false;
                } else {
                    output.push("\\r");
                }
                continue;
            }

            if (char === "\t") {
                output.push("\\t");
                continue;
            }

            output.push(char);
            continue;
        }

        if (char === '"') {
            output.push(char);
            inString = true;
            continue;
        }

        if (char === "{" || char === "[") {
            stack.push(char);
            output.push(char);
            continue;
        }

        if (char === "}" || char === "]") {
            const expected = char === "}" ? "{" : "[";

            if (stack.length === 0) {
                return output.join("");
            }

            if (stack[stack.length - 1] === expected) {
                stack.pop();
                output.push(char);
                if (stack.length === 0) return output.join("");
            }

            continue;
        }

        if (char === ",") {
            const next = nextSignificantChar(source, index + 1);
            if (next === undefined || next === "}" || next === "]") {
                continue;
            }
        }

        output.push(char);
    }

    if (inString) {
        output.push(escaped ? "\\\\" : '"');
    }

    while (stack.length > 0) {
        output.push(closeTokenFor(stack.pop() as string));
    }

    return output.join("");
};

export const extractJson = (value: string) => {
    const trimmed = stripCodeFences(value);

    const firstBrace = trimmed.indexOf("{");

    if (firstBrace !== -1) {
        return repairJsonCandidate(trimmed);
    }

    return trimmed;
};

export const parseFeedbackResponse = (value: string): Feedback => {
    const normalized = extractJson(value);
    const parsed = JSON.parse(normalized) as Partial<Feedback>;

    return {
        overallScore: clampScore(parsed.overallScore),
        jobMatch: parsed.jobMatch
            ? {
                  score: clampScore(parsed.jobMatch.score),
                  summary:
                      typeof parsed.jobMatch.summary === "string" && parsed.jobMatch.summary.trim().length > 0
                          ? parsed.jobMatch.summary
                          : "Job match analysis is available, but the summary was incomplete.",
                  matchedKeywords: normalizeKeywordList(parsed.jobMatch.matchedKeywords),
                  missingKeywords: normalizeKeywordList(parsed.jobMatch.missingKeywords),
              }
            : undefined,
        sectionAnalysis: parsed.sectionAnalysis
            ? {
                  detectedSections: Array.isArray(parsed.sectionAnalysis.detectedSections)
                      ? parsed.sectionAnalysis.detectedSections.map((section) => normalizeSection(section))
                      : [],
                  missingSections: normalizeKeywordList(parsed.sectionAnalysis.missingSections),
                  summary:
                      typeof parsed.sectionAnalysis.summary === "string" &&
                      parsed.sectionAnalysis.summary.trim().length > 0
                          ? parsed.sectionAnalysis.summary
                          : "Section-wise resume analysis is available, but the summary was incomplete.",
              }
            : undefined,
        rewriteSuggestions: Array.isArray(parsed.rewriteSuggestions)
            ? parsed.rewriteSuggestions.map((suggestion) => normalizeRewriteSuggestion(suggestion))
            : [],
        impactSuggestions: Array.isArray(parsed.impactSuggestions)
            ? parsed.impactSuggestions.map((suggestion) => normalizeImpactSuggestion(suggestion))
            : [],
        recommendations: parsed.recommendations
            ? {
                  skills: normalizeKeywordList(parsed.recommendations.skills),
                  certifications: normalizeKeywordList(parsed.recommendations.certifications),
                  projectIdeas: normalizeKeywordList(parsed.recommendations.projectIdeas),
                  summary:
                      typeof parsed.recommendations.summary === "string" &&
                      parsed.recommendations.summary.trim().length > 0
                          ? parsed.recommendations.summary
                          : "Recommendations were generated based on the resume and target role.",
              }
            : undefined,
        interviewQuestions: Array.isArray(parsed.interviewQuestions)
            ? parsed.interviewQuestions.map((question) => ({
                  category:
                      typeof question.category === "string" && question.category.trim().length > 0
                          ? question.category
                          : "General",
                  question:
                      typeof question.question === "string" && question.question.trim().length > 0
                          ? question.question
                          : "Tell me about a project you are most confident discussing.",
                  rationale:
                      typeof question.rationale === "string" && question.rationale.trim().length > 0
                          ? question.rationale
                          : "This question helps assess role fit and the depth of your resume claims.",
              }))
            : [],
        ATS: normalizeATS(parsed.ATS),
        toneAndStyle: normalizeCategory(parsed.toneAndStyle),
        content: normalizeCategory(parsed.content),
        structure: normalizeCategory(parsed.structure),
        skills: normalizeCategory(parsed.skills),
    };
};

export const readFeedbackText = (response: AIResponse | undefined) => {
    const anyResponse = response as any;
    const content =
        anyResponse?.message?.content ??
        anyResponse?.choices?.[0]?.message?.content ??
        anyResponse?.text;

    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        const text = content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part && typeof part.text === "string") return part.text;
                return "";
            })
            .filter(Boolean)
            .join("\n");

        return text.length > 0 ? text : undefined;
    }

    return undefined;
};

export const hasMeaningfulFeedback = (feedback: Feedback) => {
    const categoryScores = [
        feedback.ATS.score,
        feedback.toneAndStyle.score,
        feedback.content.score,
        feedback.structure.score,
        feedback.skills.score,
        feedback.jobMatch?.score || 0,
    ];

    const hasNonZeroScore = categoryScores.some((score) => score > 0);
    const hasTips =
        feedback.ATS.tips.length > 0 ||
        feedback.toneAndStyle.tips.length > 0 ||
        feedback.content.tips.length > 0 ||
        feedback.structure.tips.length > 0 ||
        feedback.skills.tips.length > 0;
    const hasAdvancedContent =
        (feedback.rewriteSuggestions?.length || 0) > 0 ||
        (feedback.impactSuggestions?.length || 0) > 0 ||
        (feedback.interviewQuestions?.length || 0) > 0 ||
        Boolean(feedback.recommendations);

    return hasNonZeroScore || hasTips || hasAdvancedContent;
};

export const hasAnyPositiveScore = (feedback: Feedback) =>
    [
        feedback.overallScore,
        feedback.jobMatch?.score || 0,
        feedback.ATS.score,
        feedback.toneAndStyle.score,
        feedback.content.score,
        feedback.structure.score,
        feedback.skills.score,
    ].some((score) => score > 0);
