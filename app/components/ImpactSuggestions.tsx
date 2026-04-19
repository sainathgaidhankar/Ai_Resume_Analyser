const ImpactSuggestionCard = ({
    suggestion,
}: {
    suggestion: NonNullable<Feedback["impactSuggestions"]>[number];
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {suggestion.section}
            </span>
            <p className="text-sm font-medium text-amber-700">Replace weak phrasing with stronger impact</p>
        </div>

        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Weak Phrase</p>
            <p className="mt-2 text-sm text-gray-700">{suggestion.weakPhrase}</p>
        </div>

        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Stronger Action Verb</p>
            <p className="mt-2 text-sm font-semibold text-gray-800">{suggestion.strongerVerb}</p>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Measurable Version</p>
            <p className="mt-2 text-sm text-gray-800">{suggestion.measurableVersion}</p>
        </div>

        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Metric Hint</p>
            <p className="mt-2 text-sm text-gray-700">{suggestion.metricHint}</p>
        </div>
    </div>
);

const ImpactSuggestions = ({
    suggestions,
}: {
    suggestions: NonNullable<Feedback["impactSuggestions"]>;
}) => {
    if (!suggestions.length) return null;

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-md">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Action Verbs And Impact Suggestions</h2>
                <p className="text-sm text-gray-500">
                    Stronger verbs and metric-driven phrasing to make achievements more convincing.
                </p>
            </div>

            <div className="mt-6 grid gap-4">
                {suggestions.map((suggestion, index) => (
                    <ImpactSuggestionCard
                        key={`${suggestion.section}-${suggestion.weakPhrase}-${index}`}
                        suggestion={suggestion}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImpactSuggestions;
