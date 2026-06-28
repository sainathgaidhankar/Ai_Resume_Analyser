import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePuterStore } from "./puter";

describe("usePuterStore.ai.feedback", () => {
    beforeEach(() => {
        const chat = vi
            .fn()
            .mockRejectedValueOnce(new Error("400 Bad Request"))
            .mockResolvedValueOnce({ message: { content: "ok" } });

        (window as any).puter = {
            ai: { chat },
        };
    });

    it("retries with the current Puter Claude Sonnet model before falling back to the legacy one", async () => {
        const response = await usePuterStore.getState().ai.feedback(
            "/files/resume.pdf",
            "Analyze this resume"
        );

        const chat = (window as any).puter.ai.chat as ReturnType<typeof vi.fn>;

        expect(chat).toHaveBeenCalledTimes(2);
        expect(chat).toHaveBeenNthCalledWith(
            1,
            expect.any(Array),
            expect.objectContaining({
                model: "claude-sonnet-4-5",
                max_tokens: 4500,
            })
        );
        expect(chat).toHaveBeenNthCalledWith(
            2,
            expect.any(Array),
            expect.objectContaining({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4500,
            })
        );
        expect(response).toEqual({ message: { content: "ok" } });
    });
});
