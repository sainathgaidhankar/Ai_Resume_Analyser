import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({
    resume: { id, companyName, jobTitle, analysisMode, versionNumber, feedback, imagePath },
    compareHref,
}: {
    resume: Resume;
    compareHref?: string;
}) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    return (
        <div className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header px-2 pt-2">
                <div className="flex flex-col gap-2 pr-3">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    {versionNumber && (
                        <p className="text-sm font-medium text-emerald-700">Version {versionNumber}</p>
                    )}
                    {analysisMode && (
                        <p className="text-sm font-medium text-slate-600">
                            Mode: {analysisMode.replace("-", " ")}
                        </p>
                    )}
                    {feedback?.jobMatch && (
                        <p className="text-sm font-medium text-blue-600">
                            Job match: {feedback.jobMatch.score}/100
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback?.overallScore || 0} />
                </div>
            </div>
            {resumeUrl && (
                <Link to={`/resume/${id}`} className="gradient-border animate-in fade-in duration-1000 block mx-1">
                    <div className="w-full h-full overflow-hidden rounded-xl bg-white">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    </div>
                </Link>
            )}
            <div className="mt-auto flex flex-wrap gap-3 px-2 pb-2 pt-2">
                <Link to={`/resume/${id}`} className="primary-button !w-fit !px-5 !py-3">
                    View Review
                </Link>
                {compareHref && (
                    <Link
                        to={compareHref}
                        className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        Compare Versions
                    </Link>
                )}
            </div>
        </div>
    )
}
export default ResumeCard
