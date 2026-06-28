import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import StatusPanel from "~/components/StatusPanel";
import JobMatch from "~/components/JobMatch";
import SectionAnalysis from "~/components/SectionAnalysis";
import RewriteSuggestions from "~/components/RewriteSuggestions";
import ImpactSuggestions from "~/components/ImpactSuggestions";
import Recommendations from "~/components/Recommendations";
import InterviewQuestions from "~/components/InterviewQuestions";
import {openDownloadableReport} from "~/lib/report";
import {buildKeywordPromptBlock, extractTargetKeywords} from "~/lib/jobMatch";
import {
    hasAnyPositiveScore,
    hasMeaningfulFeedback,
    parseFeedbackResponse,
    readFeedbackText,
} from "~/lib/feedback";
import {prepareInstructions} from "../../constants";

type StoredResume = Resume & {
    jobDescription?: string;
};

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv, ai, error } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [analysisMode, setAnalysisMode] = useState<Resume["analysisMode"]>();
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    useEffect(() => {
        let isCancelled = false;
        let nextResumeUrl: string | null = null;
        let nextImageUrl: string | null = null;

        const loadResume = async () => {
            try {
                setLoadError(null);
                setImageUrl('');
                setResumeUrl('');
                setFeedback(null);
                setAnalysisMode(undefined);
                setResumeData(null);

                if (!id) {
                    throw new Error("Missing resume id.");
                }

                const resume = await kv.get(`resume:${id}`);
                if (!resume) {
                    throw new Error("No saved review was found for this resume.");
                }

                const data = JSON.parse(resume) as StoredResume;
                if (isCancelled) return;

                setAnalysisMode(data.analysisMode);
                setResumeData(data);

                const [resumeBlobResult, imageBlobResult] = await Promise.allSettled([
                    fs.read(data.resumePath),
                    fs.read(data.imagePath),
                ]);

                if (isCancelled) return;

                if (resumeBlobResult.status === "fulfilled" && resumeBlobResult.value) {
                    const pdfBlob = new Blob([resumeBlobResult.value], { type: 'application/pdf' });
                    nextResumeUrl = URL.createObjectURL(pdfBlob);
                    setResumeUrl(nextResumeUrl);
                }

                if (imageBlobResult.status === "fulfilled" && imageBlobResult.value) {
                    nextImageUrl = URL.createObjectURL(imageBlobResult.value);
                    setImageUrl(nextImageUrl);
                }

                if (data.feedback && hasAnyPositiveScore(data.feedback)) {
                    setFeedback(data.feedback);
                    return;
                }

                const targetKeywords = extractTargetKeywords(data.jobTitle || "", data.jobDescription || "");
                const prompt = `${prepareInstructions({
                    jobTitle: data.jobTitle || "Unknown role",
                    jobDescription: data.jobDescription || "No job description was saved with this resume.",
                    targetKeywords,
                    analysisMode: data.analysisMode,
                    compact: true,
                })}

${buildKeywordPromptBlock(targetKeywords)}`;

                const response = await ai.feedback(data.resumePath, prompt);
                const feedbackText = readFeedbackText(response);

                if (!feedbackText) {
                    console.error("Puter AI recovery response without readable text:", response);
                    throw new Error("No usable AI feedback was found in storage or the recovery response.");
                }

                const recoveredFeedback = parseFeedbackResponse(feedbackText);
                if (!hasMeaningfulFeedback(recoveredFeedback)) {
                    throw new Error("The AI recovery response was received, but it did not contain usable feedback.");
                }

                const restoredResume = { ...data, feedback: recoveredFeedback };
                const saved = await kv.set(`resume:${id}`, JSON.stringify(restoredResume));
                if (!saved) {
                    throw new Error("Recovered feedback could not be saved back to storage.");
                }
                if (isCancelled) return;

                setFeedback(recoveredFeedback);
                setResumeData(restoredResume);
            } catch (err) {
                if (isCancelled) return;
                const message = err instanceof Error ? err.message : "Failed to load resume review.";
                setLoadError(message);
            }
        }

        loadResume();

        return () => {
            isCancelled = true;
            if (nextResumeUrl) URL.revokeObjectURL(nextResumeUrl);
            if (nextImageUrl) URL.revokeObjectURL(nextImageUrl);
        };
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {analysisMode && (
                        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500">
                            Analysis mode: {analysisMode.replace("-", " ")}
                        </p>
                    )}
                    {resumeData && feedback && (
                        <div className="mt-4">
                            <button
                                className="primary-button"
                                type="button"
                                onClick={() => openDownloadableReport({ resume: resumeData, feedback })}
                            >
                                Open Downloadable Report
                            </button>
                        </div>
                    )}
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            {loadError && (
                                <StatusPanel
                                    title="Partial review loaded"
                                    description={loadError}
                                    tone="warning"
                                />
                            )}
                            <Summary feedback={feedback} />
                            {feedback.jobMatch && <JobMatch jobMatch={feedback.jobMatch} />}
                            {feedback.sectionAnalysis && (
                                <SectionAnalysis sectionAnalysis={feedback.sectionAnalysis} />
                            )}
                            {feedback.rewriteSuggestions && feedback.rewriteSuggestions.length > 0 && (
                                <RewriteSuggestions suggestions={feedback.rewriteSuggestions} />
                            )}
                            {feedback.impactSuggestions && feedback.impactSuggestions.length > 0 && (
                                <ImpactSuggestions suggestions={feedback.impactSuggestions} />
                            )}
                            {feedback.recommendations && (
                                <Recommendations recommendations={feedback.recommendations} />
                            )}
                            {feedback.interviewQuestions && feedback.interviewQuestions.length > 0 && (
                                <InterviewQuestions questions={feedback.interviewQuestions} />
                            )}
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (loadError || error) ? (
                        <StatusPanel
                            title="Unable to load resume review"
                            description={loadError || error || "Unable to load resume review."}
                            tone="error"
                        />
                    ) : (
                        <div className="flex flex-col gap-4">
                            <img src="/images/resume-scan-2.gif" className="w-full" />
                            <StatusPanel
                                title="Loading resume review"
                                description="Fetching your resume file, preview image, and stored AI feedback."
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
