export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `{
  "overallScore": 0,
  "jobMatch": {
    "score": 0,
    "summary": "",
    "matchedKeywords": [],
    "missingKeywords": []
  },
  "sectionAnalysis": {
    "detectedSections": [
      {
        "name": "",
        "present": true,
        "score": 0,
        "importance": "core",
        "strengths": [],
        "improvements": []
      }
    ],
    "missingSections": [],
    "summary": ""
  },
  "rewriteSuggestions": [
    {
      "section": "",
      "issue": "",
      "original": "",
      "improved": "",
      "reason": ""
    }
  ],
  "impactSuggestions": [
    {
      "section": "",
      "weakPhrase": "",
      "strongerVerb": "",
      "measurableVersion": "",
      "metricHint": ""
    }
  ],
  "recommendations": {
    "skills": [],
    "certifications": [],
    "projectIdeas": [],
    "summary": ""
  },
  "interviewQuestions": [
    {
      "category": "",
      "question": "",
      "rationale": ""
    }
  ],
  "ATS": { "score": 0, "tips": [{ "type": "good", "tip": "" }] },
  "toneAndStyle": { "score": 0, "tips": [{ "type": "good", "tip": "", "explanation": "" }] },
  "content": { "score": 0, "tips": [{ "type": "good", "tip": "", "explanation": "" }] },
  "structure": { "score": 0, "tips": [{ "type": "good", "tip": "", "explanation": "" }] },
  "skills": { "score": 0, "tips": [{ "type": "good", "tip": "", "explanation": "" }] }
}`;

const ANALYSIS_MODE_GUIDANCE: Record<
    "software" | "marketing" | "finance" | "data-science",
    string
> = {
    software:
        "Focus on programming languages, frameworks, tools, debugging, architecture, project impact, problem solving, and engineering best practices.",
    marketing:
        "Focus on campaign execution, branding, audience engagement, SEO or SEM, content quality, communication, and quantified growth outcomes.",
    finance:
        "Focus on financial analysis, reporting, forecasting, modeling, spreadsheet proficiency, data accuracy, compliance awareness, and quantified business value.",
    "data-science":
        "Focus on statistics, machine learning, experimentation, SQL, Python or analytics tools, model performance, data storytelling, and insight-driven impact.",
};

export const getAnalysisModeGuidance = (
    analysisMode: "software" | "marketing" | "finance" | "data-science"
) => ANALYSIS_MODE_GUIDANCE[analysisMode];

export const prepareInstructions = ({
    jobTitle,
    jobDescription,
    targetKeywords = [],
    analysisMode = "software",
    compact = false,
}: {
    jobTitle: string;
    jobDescription: string;
    targetKeywords?: string[];
    analysisMode?: "software" | "marketing" | "finance" | "data-science";
    compact?: boolean;
}) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Analyze this resume for the target job and return structured JSON only.
      The analysis mode is: ${analysisMode}
      Mode guidance: ${getAnalysisModeGuidance(analysisMode)}
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      The prioritized target keywords are: ${targetKeywords.join(", ") || "None provided"}
      Use the prioritized target keywords for matched and missing keyword analysis.
      Detect major sections such as Summary, Education, Experience, Projects, Skills, and Certifications.
      Give concise but useful rewrite suggestions, impact suggestions, recommendations, and interview questions.
      ${compact ? "Keep explanations short so the full JSON fits in one response." : "Be detailed but stay concise enough to fit in one JSON response."}
      Use this exact JSON shape:
      ${AIResponseFormat}
      Return valid JSON only. No markdown. No backticks. No extra text.`;
