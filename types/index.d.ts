interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    analysisMode?: "software" | "marketing" | "finance" | "data-science";
    ownerUsername?: string;
    versionGroupId?: string;
    versionNumber?: number;
    createdAt?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback | null;
}

interface Feedback {
    overallScore: number;
    jobMatch?: {
        score: number;
        summary: string;
        matchedKeywords: string[];
        missingKeywords: string[];
    };
    sectionAnalysis?: {
        detectedSections: {
            name: string;
            present: boolean;
            score: number;
            importance: "core" | "supporting";
            strengths: string[];
            improvements: string[];
        }[];
        missingSections: string[];
        summary: string;
    };
    rewriteSuggestions?: {
        section: string;
        issue: string;
        original?: string;
        improved: string;
        reason: string;
    }[];
    impactSuggestions?: {
        section: string;
        weakPhrase: string;
        strongerVerb: string;
        measurableVersion: string;
        metricHint: string;
    }[];
    recommendations?: {
        skills: string[];
        certifications: string[];
        projectIdeas: string[];
        summary: string;
    };
    interviewQuestions?: {
        category: string;
        question: string;
        rationale: string;
    }[];
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}
