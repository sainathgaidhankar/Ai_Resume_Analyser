const KeywordList = ({
    title,
    keywords,
    tone,
}: {
    title: string;
    keywords: string[];
    tone: "good" | "improve";
}) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <img
                src={tone === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={tone === "good" ? "matched keywords" : "missing keywords"}
                className="size-5"
            />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {keywords.length > 0 ? (
                keywords.map((keyword) => (
                    <span
                        key={`${title}-${keyword}`}
                        className={
                            tone === "good"
                                ? "rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200"
                                : "rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700 border border-yellow-200"
                        }
                    >
                        {keyword}
                    </span>
                ))
            ) : (
                <p className="text-sm text-gray-500">No keywords available.</p>
            )}
        </div>
    </div>
);

const JobMatch = ({ jobMatch }: { jobMatch: NonNullable<Feedback["jobMatch"]> }) => {
    const badgeClass =
        jobMatch.score > 69
            ? "bg-green-100 text-green-700"
            : jobMatch.score > 49
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700";

    return (
        <div className="rounded-2xl bg-white p-6 shadow-md w-full">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Job Match Analysis</h2>
                    <p className="text-sm text-gray-500">
                        Keyword alignment and relevance against the target role.
                    </p>
                </div>
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}>
                    Match Score: {jobMatch.score}/100
                </div>
            </div>

            <p className="mt-4 text-base text-gray-700">{jobMatch.summary}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <KeywordList
                    title="Matched Keywords"
                    keywords={jobMatch.matchedKeywords}
                    tone="good"
                />
                <KeywordList
                    title="Missing Keywords"
                    keywords={jobMatch.missingKeywords}
                    tone="improve"
                />
            </div>
        </div>
    );
};

export default JobMatch;
