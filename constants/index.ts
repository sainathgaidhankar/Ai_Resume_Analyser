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
    "certifications": [],
    "projectIdeas": ["Build a searchable job tracker", "Add automated resume scoring dashboards"],
    "summary": "Build more evidence of impact and add one or two supporting technical skills when they align with the JD."
  },
  "interviewQuestions": [
    {
      "category": "Experience",
      "question": "How did you measure the impact of this project?",
      "rationale": "This checks whether the resume claims are backed by results.",
      "answer": "I tracked the result using the actual metrics from the project, such as time saved, process speed, or customer improvement, and I explained the impact clearly in my examples."
    },
    {
      "category": "Behavioral",
      "question": "Tell me about a time you handled a difficult customer issue.",
      "rationale": "This checks patience, professionalism, and problem-solving under pressure.",
      "answer": "I listened carefully, clarified the issue, followed the correct process, and kept the customer informed while resolving the problem step by step."
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
    analysisMode: string
) => {
    const normalized = analysisMode && analysisMode !== "general" ? analysisMode : "general";
    if (normalized === "general") {
        return "Compare the full resume against the full job description, responsibilities, and required skills. Score the candidate based on evidence, not a fixed template or role category.";
    }
    return `Compare the full resume against the full job description and score the candidate based on actual role evidence. Treat this as a general role analysis rather than a fixed category template.`;
};

export const prepareInstructions = ({
    jobTitle,
    jobDescription,
    targetKeywords = [],
    analysisMode = "general",
    compact = false,
}: {
    jobTitle: string;
    jobDescription: string;
    targetKeywords?: string[];
    analysisMode?: string;
    compact?: boolean;
}) => {
    return `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Analyze the actual resume content against the actual job description and return structured JSON only.
      Use the uploaded resume file and the extracted resume text as the primary source of truth. Never say the resume is missing, not provided, unreadable, or absent unless the file truly cannot be accessed.
      If the resume is a PDF, inspect the extracted text first and use it to assess keywords, gaps, and role fit. Do not fall back to generic copy such as "resume content not included" or "I can’t evaluate match because the actual resume content is missing."
      Do not use a generic template or fixed role category. This is a general-role evaluation for all industries and job functions.
      Base every score, keyword match, missing requirement, recommendation, and suggestion on evidence from the specific resume and the specific JD.
      Write all summaries in plain English that a normal recruiter or job seeker can understand without jargon.
      Keep recommendations practical, short, and easy to act on. Do not add irrelevant details, filler, or generic buzzwords.
      Focus only on what matters: overall score, job fit against the JD, key gaps, improvement actions, and interview-prep questions.
      Ignore certificates unless the job description explicitly requires them. If certificates are not required by the JD, do not add them as a major recommendation or score factor.
      The analysis mode is: general
      Mode guidance: ${getAnalysisModeGuidance(analysisMode)}
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      The prioritized target keywords are: ${targetKeywords.join(", ") || "None provided"}
      Use the prioritized target keywords for matched and missing keyword analysis, but only if they are relevant to the resume content and JD.
      Detect major sections such as Summary, Education, Experience, Projects, Skills, and Certifications when relevant; do not invent sections that are not present.
      Give concise but useful rewrite suggestions, impact suggestions, recommendations, and interview questions that are directly supported by the resume and JD.
      Keep each tip and explanation brief, practical, and easy to understand. Avoid unnecessary complexity.
      Never return all-zero scores or empty suggestions just because the resume is weak. Generate a realistic assessment with meaningful content.
      If a requirement is not mentioned in the JD or not evidenced in the resume, do not invent it. Keep recommendations grounded in the resume and job description only.
      Never return generic fallback lines such as "Resume content was not provided", "Paste the full resume text here", "resume not included", or any equivalent placeholder wording.
      Include at least 4 rewrite suggestions, 3 impact suggestions, and 5 interview questions with a short sample answer for each. Make the recommendations highly practical for resume improvement and interview preparation.
      Write the recommendation summary as a clear "what to improve" note: state the top resume gaps, what to add, what to reword, and how the candidate should position their experience against the JD.
      Only recommend certifications when the job description explicitly requires them or they are directly relevant to the role. Do not force generic certificates for unrelated roles.
      All score fields must be plain integers from 0 to 100. Do not return scores as strings, percentages, or values like "82/100".
      Return only the necessary information to make the resume decision clear and actionable. No extra noise.
      ${compact ? "Keep explanations short so the full JSON fits in one response." : "Be detailed but stay concise enough to fit in one JSON response."}
      Use this exact JSON shape:
      ${AIResponseFormat}
      Return valid JSON only. No markdown. No backticks. No extra text.`;
};
