import {type FormEvent, useState} from 'react'
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage, extractPdfText} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import {hasMeaningfulFeedback, isZeroedFeedback, parseFeedbackResponse, readFeedbackText} from "~/lib/feedback";
import {buildKeywordPromptBlock, extractTargetKeywords} from "~/lib/jobMatch";
import {buildVersionGroupId, getNextVersionNumber} from "~/lib/resumeVersions";

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
};

const UploadForm = () => {
    const { auth, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [formError, setFormError] = useState('');

    const handleFileSelect = (file: File | null) => {
        setFile(file)
        setFormError('');
    }

    const handleAnalyze = async ({
        companyName,
        jobTitle,
        jobDescription,
        analysisMode = "general",
        file,
    }: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        analysisMode?: NonNullable<Resume["analysisMode"]>,
        file: File
    }) => {
        setIsProcessing(true);
        setFormError('');

        try {
            const targetKeywords = extractTargetKeywords(jobTitle, jobDescription);
            const existingEntries = ((await kv.list('resume:*', true)) as KVItem[] | undefined) || [];
            const existingResumes = existingEntries.map((entry) => JSON.parse(entry.value) as Resume);
            const versionGroupId = buildVersionGroupId({ companyName, jobTitle, analysisMode });
            const versionNumber = getNextVersionNumber(existingResumes, versionGroupId);

            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) throw new Error('Failed to upload file');

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) throw new Error(imageFile.error || 'Failed to convert PDF to image');

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) throw new Error('Failed to upload image');

            setStatusText('Preparing data...');
            const resumeText = await extractPdfText(file);
            const uuid = generateUUID();
            const data: {
                id: string;
                resumePath: string;
                imagePath: string;
                companyName: string;
                jobTitle: string;
                jobDescription: string;
                analysisMode: Resume["analysisMode"];
                ownerUsername: string;
                versionGroupId: string;
                versionNumber: number;
                createdAt: string;
                feedback: Feedback | null;
            } = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                analysisMode,
                ownerUsername: auth.user?.username || "unknown",
                versionGroupId,
                versionNumber,
                createdAt: new Date().toISOString(),
                feedback: null,
            }
            const initialSaved = await kv.set(`resume:${uuid}`, JSON.stringify(data));
            if (!initialSaved) {
                throw new Error("Failed to save the resume record before analysis.");
            }

            setStatusText('Analyzing...');

            const runFeedback = (compact = false) =>
                withTimeout(
                    ai.feedback(
                        [uploadedFile.path, uploadedImage.path].filter(Boolean) as string[],
                        `${prepareInstructions({
                            jobTitle,
                            jobDescription,
                            targetKeywords,
                            analysisMode,
                            compact,
                        })}

Resume text extracted from the uploaded PDF, when available:
${resumeText || "No text could be extracted from the PDF. Use the uploaded PDF and image content as the primary evidence."}

${buildKeywordPromptBlock(targetKeywords)}`
                    ),
                    120000,
                    'AI analysis timed out. Please try again with a shorter job description.'
                );

            let feedback = await runFeedback(false);
            if (!feedback) throw new Error('Failed to analyze resume');

            const feedbackText = readFeedbackText(feedback);
            if (!feedbackText) {
                console.error("Puter AI response without readable text:", feedback);
            }

            if (!feedbackText) throw new Error('Puter returned a response, but it did not contain readable text.');

            let parsedFeedback = parseFeedbackResponse(feedbackText);

            if (!hasMeaningfulFeedback(parsedFeedback) || isZeroedFeedback(parsedFeedback)) {
                setStatusText('AI returned an incomplete result, re-running with stricter guidance...');
                feedback = await runFeedback(true);
                if (!feedback) throw new Error('Failed to analyze resume');

                const retryFeedbackText = readFeedbackText(feedback);
                if (!retryFeedbackText) {
                    console.error("Puter AI retry response without readable text:", feedback);
                }

                if (!retryFeedbackText) throw new Error('Puter retry response did not contain readable text.');

                parsedFeedback = parseFeedbackResponse(retryFeedbackText);
            }

            if (!hasMeaningfulFeedback(parsedFeedback) || isZeroedFeedback(parsedFeedback)) {
                throw new Error('The AI response was incomplete or too sparse. Please try a shorter resume or job description and regenerate the analysis.');
            }

            data.feedback = parsedFeedback;
            const savedWithFeedback = await kv.set(`resume:${uuid}`, JSON.stringify(data));
            if (!savedWithFeedback) {
                throw new Error("Analysis completed, but the result could not be saved.");
            }
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error during analysis';
            setStatusText(`Error: ${message}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = ((formData.get('company-name') as string) || '').trim();
        const analysisMode = 'general' as NonNullable<Resume["analysisMode"]>;
        const jobTitle = ((formData.get('job-title') as string) || '').trim();
        const jobDescription = ((formData.get('job-description') as string) || '').trim();

        if(!jobTitle) {
            setFormError('Job title is required.');
            return;
        }

        if(!jobDescription) {
            setFormError('Job description is required.');
            return;
        }

        if(!file) {
            setFormError('Please upload a resume PDF before starting analysis.');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, analysisMode, file });
    }

    return (
        <div className="page-heading py-16">
            <h1>Smart feedback for your dream job</h1>
            {isProcessing ? (
                <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" alt="" className="w-full" />
                </>
            ) : (
                <h2>Drop your resume for an ATS score and improvement tips</h2>
            )}
            {!isProcessing && (
                <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                    </div>
                    <div className="form-div">
                        <label htmlFor="job-description">Job Description</label>
                        <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
                    </div>

                    <div className="form-div">
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader onFileSelect={handleFileSelect} />
                    </div>

                    {formError && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {formError}
                        </p>
                    )}

                    <button className="primary-button" type="submit">
                        Analyze Resume
                    </button>
                </form>
            )}
        </div>
    )
}

export default UploadForm
