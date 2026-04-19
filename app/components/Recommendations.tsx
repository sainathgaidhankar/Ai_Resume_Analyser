const RecommendationList = ({
    title,
    items,
    toneClass,
}: {
    title: string;
    items: string[];
    toneClass: string;
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
            {items.length > 0 ? (
                items.map((item) => (
                    <span
                        key={`${title}-${item}`}
                        className={`rounded-full px-3 py-1 text-sm font-medium ${toneClass}`}
                    >
                        {item}
                    </span>
                ))
            ) : (
                <p className="text-sm text-slate-500">No recommendations available.</p>
            )}
        </div>
    </div>
);

const Recommendations = ({
    recommendations,
}: {
    recommendations: NonNullable<Feedback["recommendations"]>;
}) => (
    <div className="w-full rounded-2xl bg-white p-6 shadow-md">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Personalized Recommendations</h2>
            <p className="text-sm text-slate-500">
                Skills, certifications, and project directions that would strengthen this profile.
            </p>
            <p className="text-base text-slate-700">{recommendations.summary}</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <RecommendationList
                title="Skills To Build"
                items={recommendations.skills}
                toneClass="bg-blue-50 text-blue-700 border border-blue-200"
            />
            <RecommendationList
                title="Certifications"
                items={recommendations.certifications}
                toneClass="bg-emerald-50 text-emerald-700 border border-emerald-200"
            />
            <RecommendationList
                title="Project Ideas"
                items={recommendations.projectIdeas}
                toneClass="bg-amber-50 text-amber-700 border border-amber-200"
            />
        </div>
    </div>
);

export default Recommendations;
