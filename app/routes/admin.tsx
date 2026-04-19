import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router";
import Navbar from "~/components/Navbar";
import StatusPanel from "~/components/StatusPanel";
import {usePuterStore} from "~/lib/puter";
import {buildAnalytics} from "~/lib/analytics";
import {sortResumesByDate} from "~/lib/resumeVersions";

const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
);

const RankedList = ({
    title,
    items,
}: {
    title: string;
    items: { label: string; count: number }[];
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="mt-4 space-y-3">
            {items.length > 0 ? (
                items.map((item) => (
                    <div key={`${title}-${item.label}`} className="flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-700">{item.label}</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                            {item.count}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-500">No data available yet.</p>
            )}
        </div>
    </div>
);

export default function Admin() {
    const { auth, isLoading, kv, error } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/admin");
        if (!isLoading && auth.isAuthenticated && auth.role !== "admin") navigate("/");
    }, [auth.isAuthenticated, auth.role, isLoading, navigate]);

    useEffect(() => {
        const load = async () => {
            if (!auth.isAuthenticated || auth.role !== "admin") return;

            setLoading(true);
            const entries = ((await kv.list("resume:*", true)) as KVItem[] | undefined) || [];
            const parsed = entries.map((entry) => JSON.parse(entry.value) as Resume);
            setResumes(sortResumesByDate(parsed));
            setLoading(false);
        };

        load();
    }, [auth.isAuthenticated, auth.role, kv]);

    const analytics = useMemo(() => buildAnalytics(resumes), [resumes]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section py-12">
                <div className="page-heading">
                    <h1>Admin Analytics Dashboard</h1>
                    <h2>Aggregated insights from stored resume analyses using Puter KV.</h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                        <StatusPanel
                            title="Loading analytics"
                            description="Aggregating stored resume data from Puter KV."
                        />
                    </div>
                ) : error ? (
                    <StatusPanel
                        title="Unable to load analytics"
                        description={error}
                        tone="error"
                    />
                ) : resumes.length === 0 ? (
                    <StatusPanel
                        title="No analytics data yet"
                        description="Admin metrics will appear after users upload and analyze resumes."
                        tone="warning"
                    />
                ) : (
                    <div className="mt-10 space-y-8">
                        <div className="grid gap-4 md:grid-cols-3">
                            <MetricCard label="Total Analyses" value={analytics.totalResumes} />
                            <MetricCard label="Average Overall Score" value={`${analytics.averageOverallScore}/100`} />
                            <MetricCard label="Average ATS Score" value={`${analytics.averageATSScore}/100`} />
                        </div>

                        <div className="grid gap-4 xl:grid-cols-2">
                            <RankedList title="Most Targeted Roles" items={analytics.targetedRoles} />
                            <RankedList title="Common Missing Skills" items={analytics.missingSkills} />
                            <RankedList title="Weak Resume Sections" items={analytics.weakSections} />
                            <RankedList title="Analysis Modes Used" items={analytics.analysisModes} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Recent Analyses</h2>
                                    <p className="text-sm text-slate-500">Quick access to the latest resume reviews.</p>
                                </div>
                                <Link to="/" className="primary-button w-fit">
                                    Back To Home
                                </Link>
                            </div>
                            <div className="mt-4 grid gap-3">
                                {resumes.slice(0, 8).map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {resume.companyName || "Resume"} - {resume.jobTitle || "Untitled role"}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {resume.analysisMode?.replace("-", " ") || "software"} | Version{" "}
                                                {resume.versionNumber || 1}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                                {resume.feedback?.overallScore || 0}/100
                                            </span>
                                            <Link to={`/resume/${resume.id}`} className="auth-button">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
