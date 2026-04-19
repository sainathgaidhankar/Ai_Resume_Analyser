const StatusPanel = ({
    title,
    description,
    tone = "neutral",
}: {
    title: string;
    description: string;
    tone?: "neutral" | "warning" | "error";
}) => {
    const shellClass =
        tone === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : tone === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-white text-slate-700";

    return (
        <div className={`rounded-2xl border p-6 shadow-sm ${shellClass}`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm">{description}</p>
        </div>
    );
};

export default StatusPanel;
