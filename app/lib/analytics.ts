const countItems = (items: string[]) => {
    const counts = new Map<string, number>();

    items.forEach((item) => {
        const normalized = item.trim();
        if (!normalized) return;

        counts.set(normalized, (counts.get(normalized) || 0) + 1);
    });

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ label, count }));
};

export const buildAnalytics = (resumes: Resume[]) => {
    const feedbackResumes = resumes.filter((resume) => resume.feedback);
    const totalResumes = feedbackResumes.length;
    const averageOverallScore =
        totalResumes > 0
            ? Math.round(
                  feedbackResumes.reduce((sum, resume) => sum + (resume.feedback?.overallScore || 0), 0) /
                      totalResumes
              )
            : 0;
    const averageATSScore =
        totalResumes > 0
            ? Math.round(
                  feedbackResumes.reduce((sum, resume) => sum + (resume.feedback?.ATS.score || 0), 0) / totalResumes
              )
            : 0;

    const missingSkills = countItems(
        feedbackResumes.flatMap((resume) => resume.feedback?.jobMatch?.missingKeywords || [])
    ).slice(0, 8);
    const targetedRoles = countItems(feedbackResumes.map((resume) => resume.jobTitle || "Untitled Role")).slice(0, 8);
    const analysisModes = countItems(
        feedbackResumes.map((resume) => (resume.analysisMode || "software").replace("-", " "))
    ).slice(0, 8);

    const weakSections = countItems(
        feedbackResumes.flatMap((resume) =>
            (resume.feedback?.sectionAnalysis?.detectedSections || [])
                .filter((section) => section.score < 60 || !section.present)
                .map((section) => section.name)
        )
    ).slice(0, 8);

    return {
        totalResumes,
        averageOverallScore,
        averageATSScore,
        missingSkills,
        targetedRoles,
        analysisModes,
        weakSections,
    };
};
