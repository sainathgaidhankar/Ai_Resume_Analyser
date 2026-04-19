const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const renderList = (items: string[]) =>
    items.length > 0
        ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : `<p class="muted">No items available.</p>`;

const renderTipGroup = (
    title: string,
    tips: { type: "good" | "improve"; tip: string; explanation?: string }[]
) => `
    <section class="card">
        <h3>${escapeHtml(title)}</h3>
        ${
            tips.length > 0
                ? tips
                      .map(
                          (tip) => `
                <div class="tip ${tip.type}">
                    <p><strong>${escapeHtml(tip.tip)}</strong></p>
                    ${tip.explanation ? `<p>${escapeHtml(tip.explanation)}</p>` : ""}
                </div>
            `
                      )
                      .join("")
                : `<p class="muted">No detailed suggestions returned.</p>`
        }
    </section>
`;

const buildReportHtml = ({ resume, feedback }: { resume: Resume; feedback: Feedback }) => {
    const sectionCards =
        feedback.sectionAnalysis?.detectedSections
            .map(
                (section) => `
            <div class="card">
                <h3>${escapeHtml(section.name)} <span class="badge">${escapeHtml(section.importance)}</span></h3>
                <p>${section.present ? "Present in resume" : "Missing or too weak"}</p>
                <p><strong>Score:</strong> ${section.score}/100</p>
                <div class="split">
                    <div>
                        <h4>Strengths</h4>
                        ${renderList(section.strengths)}
                    </div>
                    <div>
                        <h4>Improvements</h4>
                        ${renderList(section.improvements)}
                    </div>
                </div>
            </div>
        `
            )
            .join("") || `<p class="muted">No section analysis available.</p>`;

    const rewriteCards =
        feedback.rewriteSuggestions?.length
            ? feedback.rewriteSuggestions
                  .map(
                      (suggestion) => `
            <div class="card">
                <h3>${escapeHtml(suggestion.section)}</h3>
                <p><strong>Issue:</strong> ${escapeHtml(suggestion.issue)}</p>
                ${suggestion.original ? `<p><strong>Original:</strong> ${escapeHtml(suggestion.original)}</p>` : ""}
                <p><strong>Improved:</strong> ${escapeHtml(suggestion.improved)}</p>
                <p><strong>Reason:</strong> ${escapeHtml(suggestion.reason)}</p>
            </div>
        `
                  )
                  .join("")
            : `<p class="muted">No rewrite suggestions available.</p>`;

    const impactCards =
        feedback.impactSuggestions?.length
            ? feedback.impactSuggestions
                  .map(
                      (suggestion) => `
            <div class="card">
                <h3>${escapeHtml(suggestion.section)}</h3>
                <p><strong>Weak phrase:</strong> ${escapeHtml(suggestion.weakPhrase)}</p>
                <p><strong>Stronger verb:</strong> ${escapeHtml(suggestion.strongerVerb)}</p>
                <p><strong>Measurable version:</strong> ${escapeHtml(suggestion.measurableVersion)}</p>
                <p><strong>Metric hint:</strong> ${escapeHtml(suggestion.metricHint)}</p>
            </div>
        `
                  )
                  .join("")
            : `<p class="muted">No impact suggestions available.</p>`;

    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <title>Resumind Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; background: #f8fafc; }
                    h1, h2, h3, h4 { margin: 0 0 12px; }
                    section { margin-bottom: 24px; }
                    .hero { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
                    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
                    .card { border: 1px solid #cbd5e1; background: #fff; border-radius: 16px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
                    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .muted { color: #64748b; }
                    .badge { font-size: 12px; background: #e2e8f0; border-radius: 999px; padding: 4px 8px; vertical-align: middle; }
                    .tip { border-radius: 12px; padding: 12px; margin-bottom: 12px; }
                    .tip.good { background: #ecfdf5; border: 1px solid #86efac; }
                    .tip.improve { background: #fffbeb; border: 1px solid #fcd34d; }
                    .actions { position: sticky; top: 0; z-index: 10; display: flex; gap: 12px; padding: 16px 0; background: #f8fafc; }
                    .action-button { border: none; border-radius: 999px; padding: 12px 18px; font-weight: 700; cursor: pointer; }
                    .primary { background: #0f172a; color: white; }
                    .secondary { background: #dbeafe; color: #1d4ed8; }
                    ul { margin: 8px 0 0 18px; }
                    li { margin-bottom: 6px; }
                    @media print {
                        body { margin: 16px; background: white; }
                        .actions { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="actions">
                    <button class="action-button primary" onclick="window.print()">Print / Save as PDF</button>
                    <button class="action-button secondary" onclick="downloadHtmlReport()">Download Report (.html)</button>
                </div>

                <div class="hero">
                    <h1>Resumind Analysis Report</h1>
                    <p><strong>Company:</strong> ${escapeHtml(resume.companyName || "N/A")}</p>
                    <p><strong>Job Title:</strong> ${escapeHtml(resume.jobTitle || "N/A")}</p>
                    <p><strong>Analysis Mode:</strong> ${escapeHtml((resume.analysisMode || "software").replace("-", " "))}</p>
                    <p><strong>Version:</strong> ${resume.versionNumber || 1}</p>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <section>
                    <h2>Score Summary</h2>
                    <div class="grid">
                        <div class="card"><h3>Overall</h3><p>${feedback.overallScore}/100</p></div>
                        <div class="card"><h3>ATS</h3><p>${feedback.ATS.score}/100</p></div>
                        <div class="card"><h3>Job Match</h3><p>${feedback.jobMatch?.score || 0}/100</p></div>
                    </div>
                </section>

                <section>
                    <h2>Keyword Match</h2>
                    <div class="split">
                        <div class="card">
                            <h3>Matched Keywords</h3>
                            ${renderList(feedback.jobMatch?.matchedKeywords || [])}
                        </div>
                        <div class="card">
                            <h3>Missing Keywords</h3>
                            ${renderList(feedback.jobMatch?.missingKeywords || [])}
                        </div>
                    </div>
                    <div class="card">
                        <h3>Job Match Summary</h3>
                        <p>${escapeHtml(feedback.jobMatch?.summary || "No job match summary available.")}</p>
                    </div>
                </section>

                <section>
                    <h2>Section Analysis</h2>
                    <p class="muted">${escapeHtml(feedback.sectionAnalysis?.summary || "No section summary available.")}</p>
                    ${sectionCards}
                </section>

                <section>
                    <h2>Personalized Recommendations</h2>
                    <div class="split">
                        <div class="card">
                            <h3>Skills To Build</h3>
                            ${renderList(feedback.recommendations?.skills || [])}
                        </div>
                        <div class="card">
                            <h3>Certifications</h3>
                            ${renderList(feedback.recommendations?.certifications || [])}
                        </div>
                    </div>
                    <div class="card">
                        <h3>Project Ideas</h3>
                        ${renderList(feedback.recommendations?.projectIdeas || [])}
                    </div>
                    <div class="card">
                        <h3>Recommendation Summary</h3>
                        <p>${escapeHtml(feedback.recommendations?.summary || "No recommendation summary available.")}</p>
                    </div>
                </section>

                <section>
                    <h2>Likely Interview Questions</h2>
                    ${
                        feedback.interviewQuestions?.length
                            ? feedback.interviewQuestions
                                  .map(
                                      (item) => `
                            <div class="card">
                                <h3>${escapeHtml(item.category)}</h3>
                                <p><strong>Question:</strong> ${escapeHtml(item.question)}</p>
                                <p><strong>Why it matters:</strong> ${escapeHtml(item.rationale)}</p>
                            </div>
                        `
                                  )
                                  .join("")
                            : `<p class="muted">No interview questions available.</p>`
                    }
                </section>

                <section>
                    <h2>Detailed Feedback</h2>
                    ${renderTipGroup("Tone & Style", feedback.toneAndStyle.tips)}
                    ${renderTipGroup("Content", feedback.content.tips)}
                    ${renderTipGroup("Structure", feedback.structure.tips)}
                    ${renderTipGroup("Skills", feedback.skills.tips)}
                </section>

                <section>
                    <h2>Rewrite Suggestions</h2>
                    ${rewriteCards}
                </section>

                <section>
                    <h2>Impact Suggestions</h2>
                    ${impactCards}
                </section>

                <script>
                    function downloadHtmlReport() {
                        const html = document.documentElement.outerHTML;
                        const blob = new Blob([html], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "${escapeHtml(
                            `${(resume.companyName || "resumind").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-report-v${resume.versionNumber || 1}.html`
                        )}";
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }
                </script>
            </body>
        </html>
    `;
};

export const openDownloadableReport = ({
    resume,
    feedback,
}: {
    resume: Resume;
    feedback: Feedback;
}) => {
    const printWindow = window.open("", "_blank", "width=1200,height=900");

    if (!printWindow) return false;

    const html = buildReportHtml({ resume, feedback });
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    return true;
};
