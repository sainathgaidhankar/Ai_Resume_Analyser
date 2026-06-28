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
  "overallScore": 78,
  "jobMatch": {
    "score": 72,
    "summary": "The resume aligns well with the core role requirements but still misses a few target keywords.",
    "matchedKeywords": ["react", "typescript"],
    "missingKeywords": ["testing", "accessibility"]
  },
  "sectionAnalysis": {
    "detectedSections": [
      {
        "name": "Experience",
        "present": true,
        "score": 84,
        "importance": "core",
        "strengths": ["Clear ownership", "Relevant project scope"],
        "improvements": ["Add stronger metrics", "Show broader impact"]
      }
    ],
    "missingSections": [],
    "summary": "Experience and skills are present, but impact is under-explained in places."
  },
  "rewriteSuggestions": [
    {
      "section": "Experience",
      "issue": "Bullet is too vague",
      "original": "Worked on a dashboard feature.",
      "improved": "Built a dashboard feature that reduced manual reporting time by 30%.",
      "reason": "Adds impact, clarity, and measurable outcome."
    }
  ],
  "impactSuggestions": [
    {
      "section": "Projects",
      "weakPhrase": "helped improve",
      "strongerVerb": "reduced",
      "measurableVersion": "Reduced page load time by 40% through component caching and code splitting.",
      "metricHint": "Add a specific percentage, duration, or scale."
    }
  ],
  "recommendations": {
    "skills": ["testing", "system design"],
    "certifications": ["AWS Certified Developer"],
    "projectIdeas": ["Build a searchable job tracker", "Add automated resume scoring dashboards"],
    "summary": "Build more evidence of impact and add one or two supporting technical skills."
  },
  "interviewQuestions": [
    {
      "category": "Experience",
      "question": "How did you measure the impact of this project?",
      "rationale": "This checks whether the resume claims are backed by results."
    }
  ],
  "ATS": { "score": 80, "tips": [{ "type": "good", "tip": "Keyword coverage is decent" }] },
  "toneAndStyle": { "score": 74, "tips": [{ "type": "good", "tip": "Tone is professional", "explanation": "The language stays appropriate for a technical resume." }] },
  "content": { "score": 76, "tips": [{ "type": "good", "tip": "Experience is relevant", "explanation": "The resume includes directly related work." }] },
  "structure": { "score": 82, "tips": [{ "type": "good", "tip": "Structure is easy to scan", "explanation": "Sections are separated clearly." }] },
  "skills": { "score": 79, "tips": [{ "type": "good", "tip": "Core skills are visible", "explanation": "The resume makes the primary stack easy to identify." }] }
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
      All score fields must be plain integers from 0 to 100. Do not return scores as strings, percentages, or values like "82/100".
      ${compact ? "Keep explanations short so the full JSON fits in one response." : "Be detailed but stay concise enough to fit in one JSON response."}
      Use this exact JSON shape:
      ${AIResponseFormat}
      Return valid JSON only. No markdown. No backticks. No extra text.`;
