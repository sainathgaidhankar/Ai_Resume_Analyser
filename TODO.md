# Final Year Project Roadmap

## Phase 1 - Core Product Upgrades
- [x] Add job match analysis to the AI feedback schema and review UI
- [x] Extract matched keywords and missing keywords from the target job description
- [x] Add validation for empty job title and empty job description
- [x] Improve resilience when AI returns invalid or partial JSON
- [x] Surface job match score on home cards and summary views

## Phase 2 - Smarter Resume Analysis
- [x] Detect resume sections such as summary, education, experience, projects, skills, and certifications
- [x] Add section-wise completeness and strength analysis
- [x] Add AI rewrite suggestions for weak resume bullets
- [x] Add action verb and measurable impact suggestions
- [x] Add role-specific analysis modes such as software, marketing, finance, and data science

## Phase 3 - Resume History and Comparison
- [x] Save and group multiple resume versions per user
- [x] Compare two resume analyses side by side
- [x] Show score improvements over time
- [x] Add charts for overall score and category score trends

## Phase 4 - Reporting and Recommendations
- [x] Generate a downloadable PDF report for each analysis
- [x] Add personalized recommendations for skills, certifications, and project ideas
- [x] Add interview question generation based on resume and role

## Phase 5 - System Depth
- [x] Strengthen Puter-based data architecture using KV and FS
- [x] Add app-level user roles for student and admin
- [x] Build an admin analytics dashboard
- [x] Track common missing skills, targeted roles, and average ATS scores from stored analyses

## Phase 6 - Engineering Quality
- [x] Add unit tests for scoring and parsing logic
- [x] Add integration tests for upload and analysis flow
- [x] Improve loading, empty, and error states throughout the app
- [x] Update documentation with architecture, setup, and feature descriptions

## Next Implementation Target
- [ ] Add explicit missing keyword and matched keyword counts to the summary page
- [ ] Add required-field validation to the upload form
