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

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv, error } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [analysisMode, setAnalysisMode] = useState<Resume["analysisMode"]>();
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            setAnalysisMode(data.analysisMode);
            setResumeData(data);
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();
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
                    ) : error ? (
                        <StatusPanel
                            title="Unable to load resume review"
                            description={error}
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
