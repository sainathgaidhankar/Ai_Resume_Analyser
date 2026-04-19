import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import StatusPanel from "~/components/StatusPanel";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {sortResumesByDate} from "~/lib/resumeVersions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv, error } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(sortResumesByDate(parsedResumes || []));
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            <StatusPanel
                title="Loading resumes"
                description="Fetching your stored analyses from Puter KV."
            />
          </div>
      )}

      {!loadingResumes && error && (
          <StatusPanel
              title="Unable to load resumes"
              description={error}
              tone="error"
          />
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => {
            const relatedVersions = resumes
                .filter((item) => item.versionGroupId === resume.versionGroupId)
                .sort((a, b) => (a.versionNumber || 1) - (b.versionNumber || 1));
            const previousVersion = relatedVersions.find(
                (item) => (item.versionNumber || 1) === ((resume.versionNumber || 1) - 1)
            );

            return (
              <ResumeCard
                  key={resume.id}
                  resume={resume}
                  compareHref={previousVersion ? `/compare?left=${previousVersion.id}&right=${resume.id}` : undefined}
              />
            );
          })}
        </div>
      )}

      {!loadingResumes && !error && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <StatusPanel
                title="No resume analyses yet"
                description="Upload your first resume to start getting ATS feedback, job-match insights, and version history."
            />
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
