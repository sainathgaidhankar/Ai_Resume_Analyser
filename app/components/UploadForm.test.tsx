import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UploadForm from "./UploadForm";

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    usePuterStore: vi.fn(),
    convertPdfToImage: vi.fn(),
    acceptedFiles: [] as File[],
}));

vi.mock("react-router", () => ({
    useNavigate: () => mocks.navigate,
}));

vi.mock("~/lib/puter", () => ({
    usePuterStore: () => mocks.usePuterStore(),
}));

vi.mock("~/lib/pdf2img", () => ({
    convertPdfToImage: (file: File) => mocks.convertPdfToImage(file),
}));

vi.mock("react-dropzone", () => ({
    useDropzone: ({ onDrop }: { onDrop: (files: File[]) => void }) => ({
        getRootProps: () => ({}),
        getInputProps: () => ({
            "aria-label": "Resume uploader",
            type: "file",
            onChange: () => onDrop(mocks.acceptedFiles),
        }),
        isDragActive: false,
        acceptedFiles: mocks.acceptedFiles,
    }),
}));

const createStore = () => ({
    auth: {
        user: { username: "student-user" },
        isAuthenticated: true,
    },
    fs: {
        upload: vi
            .fn()
            .mockResolvedValueOnce({ path: "/files/resume.pdf" })
            .mockResolvedValueOnce({ path: "/files/resume.png" }),
    },
    ai: {
        feedback: vi.fn().mockResolvedValue({
            message: {
                content: JSON.stringify({
                    overallScore: 80,
                    ATS: { score: 75, tips: [] },
                    toneAndStyle: { score: 70, tips: [] },
                    content: { score: 72, tips: [] },
                    structure: { score: 68, tips: [] },
                    skills: { score: 74, tips: [] },
                }),
            },
        }),
    },
    kv: {
        list: vi.fn().mockResolvedValue([]),
        set: vi.fn().mockResolvedValue(true),
    },
});

describe("UploadForm", () => {
    beforeEach(() => {
        mocks.navigate.mockReset();
        mocks.usePuterStore.mockReset();
        mocks.convertPdfToImage.mockReset();
        mocks.acceptedFiles = [];
        mocks.convertPdfToImage.mockResolvedValue({
            file: new File(["image"], "resume.png", { type: "image/png" }),
            imageUrl: "blob:image",
        });
    });

    it("shows a validation error when no resume file is selected", async () => {
        mocks.usePuterStore.mockReturnValue(createStore());
        const user = userEvent.setup();

        const view = render(<UploadForm />);

        await user.type(view.getByLabelText("Job Title"), "Frontend Developer");
        await user.type(view.getByLabelText("Job Description"), "Build React interfaces");
        await user.click(view.getByRole("button", { name: "Analyze Resume" }));

        expect(
            await view.findByText("Please upload a resume PDF before starting analysis.")
        ).not.toBeNull();
    });

    it("submits the upload flow and redirects to the review page", async () => {
        const store = createStore();
        mocks.usePuterStore.mockReturnValue(store);
        const user = userEvent.setup();
        mocks.acceptedFiles = [new File(["resume"], "resume.pdf", { type: "application/pdf" })];

        const view = render(<UploadForm />);

        await user.type(view.getByLabelText("Company Name"), "OpenAI");
        await user.selectOptions(view.getByLabelText("Analysis Mode"), "software");
        await user.type(view.getByLabelText("Job Title"), "Frontend Developer");
        await user.type(view.getByLabelText("Job Description"), "Build React interfaces with strong TypeScript skills");
        await user.upload(view.getByLabelText("Resume uploader"), mocks.acceptedFiles[0]);
        await user.click(view.getByRole("button", { name: "Analyze Resume" }));

        await vi.waitFor(() => {
            expect(store.fs.upload).toHaveBeenCalledTimes(2);
            expect(store.kv.list).toHaveBeenCalledWith("resume:*", true);
            expect(store.ai.feedback).toHaveBeenCalledTimes(1);
            expect(store.kv.set).toHaveBeenCalledTimes(2);
            expect(mocks.navigate).toHaveBeenCalledWith(expect.stringMatching(/^\/resume\//));
        });
    });
});
