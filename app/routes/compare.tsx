import {Link, useNavigate, useSearchParams} from "react-router";
import {useEffect, useMemo, useState} from "react";
import StatusPanel from "~/components/StatusPanel";
import {usePuterStore} from "~/lib/puter";
import {sortResumesByDate} from "~/lib/resumeVersions";

const ScoreRow = ({
    label,
    left,
    right,
}: {
    label: string;
    left: number;
    right: number;
}) => {
    const delta = right - left;
    const deltaClass = delta > 0 ? "text-green-700" : delta < 0 ? "text-red-700" : "text-slate-500";

    return (
        <div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <p className="font-semibold text-slate-800">{label}</p>
            <p className="text-slate-700">{left}/100</p>
            <p className="text-slate-700">{right}/100</p>
            <p className={`font-semibold ${deltaClass}`}>{delta > 0 ? `+${delta}` : delta}</p>
        </div>
    );
};

const ComparisonColumn = ({ resume }: { resume: Resume }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Version {resume.versionNumber || 1}
            </p>
            <h2 className="text-2xl font-bold text-slate-900">{resume.companyName || "Resume"}</h2>
            <p className="text-sm text-slate-600">{resume.jobTitle || "Untitled role"}</p>
            {resume.analysisMode && (
                <p className="text-sm text-slate-500">Mode: {resume.analysisMode.replace("-", " ")}</p>
            )}
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Overall Score: {resume.feedback?.overallScore || 0}/100</p>
            <p>ATS Score: {resume.feedback?.ATS.score || 0}/100</p>
            <p>Job Match: {resume.feedback?.jobMatch?.score || 0}/100</p>
            <p>Matched Keywords: {resume.feedback?.jobMatch?.matchedKeywords.length || 0}</p>
            <p>Missing Keywords: {resume.feedback?.jobMatch?.missingKeywords.length || 0}</p>
        </div>
        <div className="mt-5">
            <Link to={`/resume/${resume.id}`} className="primary-button w-fit">
                Open Review
            </Link>
        </div>
    </div>
);

const TrendChart = ({
    title,
    resumes,
    selector,
    stroke,
}: {
    title: string;
    resumes: Resume[];
    selector: (resume: Resume) => number;
    stroke: string;
}) => {
    if (resumes.length === 0) return null;

    const width = 420;
    const height = 180;
    const padding = 24;
    const values = resumes.map(selector);
    const maxIndex = Math.max(resumes.length - 1, 1);
    const points = values.map((value, index) => {
        const x = padding + ((width - padding * 2) * index) / maxIndex;
        const y = height - padding - ((height - padding * 2) * value) / 100;

        return `${x},${y}`;
    });

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">Version-by-version score trend.</p>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
                <polyline
                    fill="none"
                    stroke={stroke}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points.join(" ")}
                />
                {values.map((value, index) => {
                    const [x, y] = points[index].split(",");

                    return (
                        <g key={`${title}-${index}`}>
                            <circle cx={x} cy={y} r="4" fill={stroke} />
                            <text x={x} y={Number(y) - 10} textAnchor="middle" fontSize="10" fill="#334155">
                                {value}
                            </text>
                            <text
                                x={x}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#64748b"
                            >
                                V{resumes[index].versionNumber || index + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default function Compare() {
    const { auth, isLoading, kv, error } = usePuterStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [leftResume, setLeftResume] = useState<Resume | null>(null);
    const [rightResume, setRightResume] = useState<Resume | null>(null);
    const [versionHistory, setVersionHistory] = useState<Resume[]>([]);

    const leftId = searchParams.get("left");
    const rightId = searchParams.get("right");

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/compare");
    }, [auth.isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const load = async () => {
            if (!leftId || !rightId) return;

            const [leftRaw, rightRaw] = await Promise.all([
                kv.get(`resume:${leftId}`),
                kv.get(`resume:${rightId}`),
            ]);

            if (leftRaw) setLeftResume(JSON.parse(leftRaw) as Resume);
            if (rightRaw) setRightResume(JSON.parse(rightRaw) as Resume);
        };

        load();
    }, [kv, leftId, rightId]);

    useEffect(() => {
        const loadHistory = async () => {
            const versionGroupId = rightResume?.versionGroupId || leftResume?.versionGroupId;
            if (!versionGroupId) return;

            const entries = ((await kv.list("resume:*", true)) as KVItem[] | undefined) || [];
            const resumes = entries
                .map((entry) => JSON.parse(entry.value) as Resume)
                .filter((resume) => resume.versionGroupId === versionGroupId)
                .sort((a, b) => (a.versionNumber || 1) - (b.versionNumber || 1));

            setVersionHistory(sortResumesByDate(resumes).reverse());
        };

        loadHistory();
    }, [kv, leftResume, rightResume]);

    const scoreRows = useMemo(() => {
        if (!leftResume?.feedback || !rightResume?.feedback) return [];

        return [
            ["Overall", leftResume.feedback.overallScore, rightResume.feedback.overallScore],
            ["ATS", leftResume.feedback.ATS.score, rightResume.feedback.ATS.score],
            ["Job Match", leftResume.feedback.jobMatch?.score || 0, rightResume.feedback.jobMatch?.score || 0],
            ["Tone & Style", leftResume.feedback.toneAndStyle.score, rightResume.feedback.toneAndStyle.score],
            ["Content", leftResume.feedback.content.score, rightResume.feedback.content.score],
            ["Structure", leftResume.feedback.structure.score, rightResume.feedback.structure.score],
            ["Skills", leftResume.feedback.skills.score, rightResume.feedback.skills.score],
        ];
    }, [leftResume, rightResume]);

    const trendSummary = useMemo(() => {
        if (versionHistory.length < 2) return null;

        const first = versionHistory[0];
        const last = versionHistory[versionHistory.length - 1];
        const overallDelta = (last.feedback?.overallScore || 0) - (first.feedback?.overallScore || 0);
        const atsDelta = (last.feedback?.ATS.score || 0) - (first.feedback?.ATS.score || 0);
        const jobMatchDelta =
            (last.feedback?.jobMatch?.score || 0) - (first.feedback?.jobMatch?.score || 0);

        return {
            versions: versionHistory.length,
            overallDelta,
            atsDelta,
            jobMatchDelta,
        };
    }, [versionHistory]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <section className="main-section py-12">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1>Resume Version Comparison</h1>
                        <h2>Compare score changes between two iterations of the same resume track.</h2>
                    </div>
                    <Link to="/" className="back-button">
                        <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                    </Link>
                </div>

                {!leftId || !rightId ? (
                    <StatusPanel
                        title="Comparison not configured"
                        description="Select two resume versions from the dashboard to open a side-by-side comparison."
                        tone="warning"
                    />
                ) : leftResume && rightResume ? (
                    <div className="space-y-8">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <ComparisonColumn resume={leftResume} />
                            <ComparisonColumn resume={rightResume} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                            <div className="mb-4 grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-4 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <p>Metric</p>
                                <p>Older</p>
                                <p>Newer</p>
                                <p>Delta</p>
                            </div>
                            <div className="space-y-3">
                                {scoreRows.map(([label, left, right]) => (
                                    <ScoreRow
                                        key={label as string}
                                        label={label as string}
                                        left={left as number}
                                        right={right as number}
                                    />
                                ))}
                            </div>
                        </div>

                        {trendSummary && (
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-slate-500">Versions Tracked</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">{trendSummary.versions}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-slate-500">Overall Improvement</p>
                                    <p className={`mt-2 text-3xl font-bold ${trendSummary.overallDelta >= 0 ? "text-green-700" : "text-red-700"}`}>
                                        {trendSummary.overallDelta >= 0 ? `+${trendSummary.overallDelta}` : trendSummary.overallDelta}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-sm text-slate-500">ATS / Job Match Change</p>
                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {trendSummary.atsDelta >= 0 ? `+${trendSummary.atsDelta}` : trendSummary.atsDelta}
                                        {" / "}
                                        {trendSummary.jobMatchDelta >= 0 ? `+${trendSummary.jobMatchDelta}` : trendSummary.jobMatchDelta}
                                    </p>
                                </div>
                            </div>
                        )}

                        {versionHistory.length > 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Score Improvements Over Time</h2>
                                    <p className="text-sm text-slate-500">
                                        Trend lines for the full version history of this resume track.
                                    </p>
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <TrendChart
                                        title="Overall Score Trend"
                                        resumes={versionHistory}
                                        selector={(resume) => resume.feedback?.overallScore || 0}
                                        stroke="#2563eb"
                                    />
                                    <TrendChart
                                        title="ATS Score Trend"
                                        resumes={versionHistory}
                                        selector={(resume) => resume.feedback?.ATS.score || 0}
                                        stroke="#16a34a"
                                    />
                                    <TrendChart
                                        title="Job Match Trend"
                                        resumes={versionHistory}
                                        selector={(resume) => resume.feedback?.jobMatch?.score || 0}
                                        stroke="#7c3aed"
                                    />
                                    <TrendChart
                                        title="Category Trend"
                                        resumes={versionHistory}
                                        selector={(resume) => {
                                            const feedback = resume.feedback;
                                            if (!feedback) return 0;

                                            return Math.round(
                                                (feedback.toneAndStyle.score +
                                                    feedback.content.score +
                                                    feedback.structure.score +
                                                    feedback.skills.score) / 4
                                            );
                                        }}
                                        stroke="#ea580c"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : error ? (
                    <StatusPanel
                        title="Unable to load comparison"
                        description={error}
                        tone="error"
                    />
                ) : (
                    <StatusPanel
                        title="Loading comparison"
                        description="Fetching both resume versions and the full trend history from Puter KV."
                    />
                )}
            </section>
        </main>
    );
}
