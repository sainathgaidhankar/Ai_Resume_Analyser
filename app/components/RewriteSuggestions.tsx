const RewriteCard = ({
    suggestion,
}: {
    suggestion: NonNullable<Feedback["rewriteSuggestions"]>[number];
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {suggestion.section}
            </span>
            <p className="text-sm font-medium text-amber-700">{suggestion.issue}</p>
        </div>

        {suggestion.original && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Original</p>
                <p className="mt-2 text-sm text-gray-700">{suggestion.original}</p>
            </div>
        )}

        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Improved Version</p>
            <p className="mt-2 text-sm text-gray-800">{suggestion.improved}</p>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Why This Is Better</p>
            <p className="mt-2 text-sm text-gray-700">{suggestion.reason}</p>
        </div>
    </div>
);

const RewriteSuggestions = ({
    suggestions,
}: {
    suggestions: NonNullable<Feedback["rewriteSuggestions"]>;
}) => {
    if (!suggestions.length) return null;

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-md">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">AI Rewrite Suggestions</h2>
                <p className="text-sm text-gray-500">
                    Concrete rewritten lines for the weakest parts of the resume.
                </p>
            </div>

            <div className="mt-6 grid gap-4">
                {suggestions.map((suggestion, index) => (
                    <RewriteCard
                        key={`${suggestion.section}-${suggestion.issue}-${index}`}
                        suggestion={suggestion}
                    />
                ))}
            </div>
        </div>
    );
};

export default RewriteSuggestions;
