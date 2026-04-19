const InterviewQuestions = ({
    questions,
}: {
    questions: NonNullable<Feedback["interviewQuestions"]>;
}) => {
    if (!questions.length) return null;

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-md">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Likely Interview Questions</h2>
                <p className="text-sm text-slate-500">
                    Questions a recruiter or interviewer is likely to ask based on this resume and target role.
                </p>
            </div>

            <div className="mt-6 grid gap-4">
                {questions.map((item, index) => (
                    <div key={`${item.category}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                {item.category}
                            </span>
                        </div>
                        <p className="mt-4 text-base font-semibold text-slate-900">{item.question}</p>
                        <p className="mt-3 text-sm text-slate-600">{item.rationale}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InterviewQuestions;
