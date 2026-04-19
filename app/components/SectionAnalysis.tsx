import ScoreBadge from "~/components/ScoreBadge";

const SectionCard = ({
    section,
}: {
    section: NonNullable<Feedback["sectionAnalysis"]>["detectedSections"][number];
}) => {
    const shellClass = section.present
        ? "border border-slate-200 bg-slate-50"
        : "border border-amber-200 bg-amber-50";

    return (
        <div className={`rounded-2xl p-4 ${shellClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                        <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-medium uppercase tracking-wide text-white">
                            {section.importance}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {section.present ? "Detected in resume" : "Missing or not clearly represented"}
                    </p>
                </div>
                <ScoreBadge score={section.score} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <p className="mb-2 text-sm font-semibold text-green-700">Strengths</p>
                    {section.strengths.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-700">
                            {section.strengths.map((strength) => (
                                <li key={`${section.name}-${strength}`} className="flex gap-2">
                                    <img src="/icons/check.svg" alt="strength" className="mt-0.5 size-4" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No major strengths detected.</p>
                    )}
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold text-amber-700">Improvements</p>
                    {section.improvements.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-700">
                            {section.improvements.map((improvement) => (
                                <li key={`${section.name}-${improvement}`} className="flex gap-2">
                                    <img src="/icons/warning.svg" alt="improvement" className="mt-0.5 size-4" />
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No major improvements suggested.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const SectionAnalysis = ({
    sectionAnalysis,
}: {
    sectionAnalysis: NonNullable<Feedback["sectionAnalysis"]>;
}) => {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-md w-full">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Section-wise Analysis</h2>
                <p className="text-sm text-gray-500">
                    Detects the major resume blocks and scores how complete and convincing they are.
                </p>
                <p className="text-base text-gray-700">{sectionAnalysis.summary}</p>
            </div>

            {sectionAnalysis.missingSections.length > 0 && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-800">Missing or weak sections</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {sectionAnalysis.missingSections.map((section) => (
                            <span
                                key={section}
                                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-sm font-medium text-amber-700"
                            >
                                {section}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 grid gap-4">
                {sectionAnalysis.detectedSections.map((section) => (
                    <SectionCard key={section.name} section={section} />
                ))}
            </div>
        </div>
    );
};

export default SectionAnalysis;
